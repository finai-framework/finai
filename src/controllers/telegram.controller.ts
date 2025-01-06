// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, post, requestBody} from '@loopback/rest';
import {headerGroupPostContent, max_number_of_message_for_context_bot_telegram, minutes_of_session_telegram_bot, nameChatBotTelegram, prompt_reply_telegram_no_content, prompt_reply_user} from '../constant';
import {ChatGptParam, MessGpt} from '../models';
import {ContentTelegramRepository, GroupToPostContentRepository, MessageRepository} from '../repositories';
import {GptService, TelegramBotService} from '../services';

export class TelegramController {
  constructor(
    @service(TelegramBotService)
    public telegramBotService: TelegramBotService,
    @service(GptService)
    public gptService: GptService,
    @repository(MessageRepository)
    public messageRepository: MessageRepository,
    @repository(ContentTelegramRepository)
    public contentTelegramRepository: ContentTelegramRepository,
    @repository(GroupToPostContentRepository)
    public groupToPostContentRepository: GroupToPostContentRepository
  ) { }

  @get('api/delete-all-data')
  async deleteAllData(): Promise<void> {
    await this.messageRepository.deleteAll();
    await this.contentTelegramRepository.deleteAll();
    await this.groupToPostContentRepository.deleteAll();
  }


  @get('api/delete-all-without-session')
  async deleteAllSession(): Promise<void> {
    let timeBefore10Minutes = new Date();
    timeBefore10Minutes.setMinutes(timeBefore10Minutes.getMinutes() - minutes_of_session_telegram_bot);
    await this.messageRepository.deleteAll(
      {
        create_at: {
          lt: timeBefore10Minutes
        }
      }
    );
  }

  @post('api/telegram-webhook')
  async handleTelegramUpdate(
    @requestBody() body: any,
  ): Promise<void> {
    try {
      console.log('🚀 New update from Telegram:', body);
      const bot = this.telegramBotService.bot;

      const update = body;

      if (update.message) {
        let isGroup = update.message.chat.type.includes("group");
        if (isGroup) {
          const chatId = update.message.chat.id;
          const idOfSender = update.message.from.id;
          const content: string = update.message.text || '';

          const context_chat = await this.saveMessageAndGetContext(update.message);

          const nameBot = nameChatBotTelegram.split("_bot")[0];
          let isMention = content.toLowerCase().includes(nameBot);
          let isQuoute = false;

          if (isMention) {
            await this.reply_in_group(context_chat, chatId, idOfSender, bot);
          } else {
            try {
              if (body.message?.reply_to_message != null) {
                isQuoute = (body.message?.reply_to_message?.from?.username == nameChatBotTelegram);
              }
            } catch (e) {
              console.log(e);
            }
            if (isQuoute) {
              await this.reply_in_group(context_chat, chatId, idOfSender, bot);
            }

          }

        } else {
          let mess = "Chức năng này chỉ hoạt động trong group";
          await bot.sendMessage(update.message.chat.id, mess);
        }
      }
    } catch (e) {
      console.log(e);
    }

    this.deleteAllSession();
  }
  private async reply_in_group(context_chat: {rolesOfContext: string; context: string;}, chatId: any, idOfSender: any, bot: any) {
    let content_reply = await this.getContentReplyFromGPT(
      context_chat.rolesOfContext,
      context_chat.context, chatId);

    await this.messageRepository.create({
      username: nameChatBotTelegram,
      text: content_reply,
      group_id: chatId,
      sender_id: idOfSender,
    });
    await bot.sendMessage(chatId, content_reply);
  }

  private async saveMessageAndGetContext(message: any): Promise<{
    rolesOfContext: string,
    context: string
  }> {
    const chatId = message.chat.id;
    const idOfSender = message.from.id;
    let nameOfSender = (message.from.first_name ?? "") + " " + (message.from.last_name ?? "");
    nameOfSender = nameOfSender.trim();
    const content = message.text || '';
    let group_title = message.chat.title;

    this.add_group_chat_to_post_content(group_title, chatId);

    await this.messageRepository.create({
      sender_id: idOfSender,
      username: nameOfSender,
      text: content,
      group_id: chatId,
    });
    const context_chat = await this.getContextChat(chatId);

    return context_chat;
  }

  private async add_group_chat_to_post_content(group_title: any, chatId: any) {
    if (group_title.includes(headerGroupPostContent)) {
      if (await this.groupToPostContentRepository.findOne({
        where: {
          group_id: chatId,
        }
      }) == null) await this.groupToPostContentRepository.create({
        group_id: chatId,
      });
    }
  }

  async getContextChat(chatId: any): Promise<{
    rolesOfContext: string,
    context: string
  }> {
    let timeBefore10Minutes = new Date();
    timeBefore10Minutes.setMinutes(timeBefore10Minutes.getMinutes() - minutes_of_session_telegram_bot);
    let messages = await this.messageRepository.find({
      where: {
        group_id: chatId,
        create_at: {
          between: [timeBefore10Minutes, new Date()]
        }
      }
    })
    if (messages.length > max_number_of_message_for_context_bot_telegram) messages = messages.slice(messages.length - max_number_of_message_for_context_bot_telegram, messages.length);
    let messagesTexts = messages.map((message) => message.username + ": " + message.text);
    let roles = [];
    for (let i = 0; i < messages.length; i++) {
      if (roles.indexOf(messages[i].username) === -1) {
        roles.push(messages[i].username);
      }
    }
    return {
      rolesOfContext: roles.join(", "),
      context: messagesTexts.join("\n")
    };
  }

  async getContentReplyFromGPT(
    rolesOfContext: string,
    context: string,
    chatId: string,
  ): Promise<string> {
    const lastContent = await this.contentTelegramRepository.findOne({
      order: ['create_at DESC'],
      where: {
        id_group: chatId,
      }
    })
    let prompt = "";
    if (lastContent == null) {
      prompt = prompt_reply_telegram_no_content(rolesOfContext, context);
    } else {
      prompt = prompt_reply_user(rolesOfContext, lastContent.content ?? "", context, nameChatBotTelegram);
    }
    const res = await this.gptService.responseChat(new ChatGptParam({
      messages: [
        new MessGpt({
          role: "user",
          content: prompt,
        }),
      ]
    }));
    const content_reply = (res as any)["choices"][0]["message"]["content"];
    if (content_reply.includes(":")) {
      let content_start = content_reply.substring(0, content_reply.indexOf(":") + 1).toLowerCase();
      if (content_start.startsWith(`${nameChatBotTelegram}:`) || content_start.startsWith(`@${nameChatBotTelegram}:`)) {
        return content_reply.substring(content_reply.indexOf(":") + 1).trim();
      }
    }

    return content_reply;
  }
}

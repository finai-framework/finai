import { ContentTelegramRepository, GroupToPostContentRepository, MessageRepository } from '../repositories';
import { GptService, TelegramBotService } from '../services';
export declare class TelegramController {
    telegramBotService: TelegramBotService;
    gptService: GptService;
    messageRepository: MessageRepository;
    contentTelegramRepository: ContentTelegramRepository;
    groupToPostContentRepository: GroupToPostContentRepository;
    constructor(telegramBotService: TelegramBotService, gptService: GptService, messageRepository: MessageRepository, contentTelegramRepository: ContentTelegramRepository, groupToPostContentRepository: GroupToPostContentRepository);
    deleteAllData(): Promise<void>;
    deleteAllSession(): Promise<void>;
    handleTelegramUpdate(body: any): Promise<void>;
    private reply_in_group;
    private saveMessageAndGetContext;
    private add_group_chat_to_post_content;
    getContextChat(chatId: any): Promise<{
        rolesOfContext: string;
        context: string;
    }>;
    getContentReplyFromGPT(rolesOfContext: string, context: string, chatId: string): Promise<string>;
}

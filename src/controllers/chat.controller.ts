// Uncomment these imports to begin using these cool features!

import {getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {Readable} from 'stream';
import {prompt_reply_telegram_no_content} from '../constant';
import {ChatGptParam, MessGpt} from '../models';
import {chatCompleteApiV2, chatResponseApi} from '../open_ai_api/chat_api/chat_api';

export class ChatController {
  constructor() { }

  @post('/chat/completions')
  @response(200, {
    description: 'Chat',
    content: {'application/json': {schema: getModelSchemaRef(ChatGptParam, {includeRelations: true}), }},
  },)
  async completionsChat(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChatGptParam, {
            title: 'NewChatGptParam',
          }),
        },
      },
    })
    chatGptParam: ChatGptParam,
  ): Promise<Readable> {
    const stream = new Readable({
      read() { }
    },);
    chatCompleteApiV2(stream, chatGptParam);
    return stream;
  }

  @post('/chat/response')
  @response(200, {
    description: 'Chat',
    content: {'application/json': {schema: getModelSchemaRef(ChatGptParam, {includeRelations: true}), }},
  },)
  async responseChat(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChatGptParam, {
            title: 'NewChatGptParam',
          }),
        },
      },
    })
    chatGptParam: ChatGptParam,
  ): Promise<JSON> {
    let a: JSON = await chatResponseApi(chatGptParam);
    return a;
  }

  @post('/chat/reply')
  @response(200, {
    description: 'Chat',
    content: {'application/json': {schema: getModelSchemaRef(ChatGptParam, {includeRelations: true}), }},
  },)
  async responseReplyChat(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              conversation: {
                type: 'string',
              },
            },
          },

        },
      }
    })
    body: {
      conversation: string;
    },
  ): Promise<JSON> {
    const chatGptParam = new ChatGptParam({
      messages: [
        new MessGpt({
          role: 'user',
          content: prompt_reply_telegram_no_content("User, Bot", body.conversation, "Bot"),
        })
      ]
    });
    let a: JSON = await chatResponseApi(chatGptParam);
    return a;
  }
}


export interface ChatGptParamRelations {
  // describe navigational properties here
}

export type ChatGptParamWithRelations = ChatGptParam & ChatGptParamRelations;

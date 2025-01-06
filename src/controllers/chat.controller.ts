// Uncomment these imports to begin using these cool features!

import {getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {Readable} from 'stream';
import {ChatGptParam} from '../models';
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
}


export interface ChatGptParamRelations {
  // describe navigational properties here
}

export type ChatGptParamWithRelations = ChatGptParam & ChatGptParamRelations;

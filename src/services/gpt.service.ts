import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {ChatGptParam} from '../models';
import {chatResponseApi} from '../open_ai_api/chat_api/chat_api';

@injectable({scope: BindingScope.TRANSIENT})
export class GptService {
  constructor(/* Add @inject to inject parameters */) { }

  public async responseChat(
    chatGptParam: ChatGptParam,
  ): Promise<JSON> {
    let a: JSON = await chatResponseApi(chatGptParam);
    return a;
  }
}

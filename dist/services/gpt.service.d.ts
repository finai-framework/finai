import { ChatGptParam } from '../models';
export declare class GptService {
    constructor();
    responseChat(chatGptParam: ChatGptParam): Promise<JSON>;
}

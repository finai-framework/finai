/// <reference types="node" />
import { Readable } from 'stream';
import { ChatGptParam } from '../models';
export declare class ChatController {
    constructor();
    completionsChat(chatGptParam: ChatGptParam): Promise<Readable>;
    responseChat(chatGptParam: ChatGptParam): Promise<JSON>;
}
export interface ChatGptParamRelations {
}
export type ChatGptParamWithRelations = ChatGptParam & ChatGptParamRelations;

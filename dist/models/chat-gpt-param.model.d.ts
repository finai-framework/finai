import { Model } from '@loopback/repository';
import { MessGpt } from './mess-gpt.model';
export declare class ChatGptParam extends Model {
    model?: string;
    frequency_penalty?: string;
    max_tokens?: number;
    messages: MessGpt[];
    n?: number;
    presence_penalty?: number;
    logit_bias?: object;
    response_format?: object;
    stop?: string[];
    stream?: boolean;
    temperature?: number;
    top_p?: number;
    constructor(data?: Partial<ChatGptParam>);
}
export interface ChatGgtParamRelations {
}
export type ChatGgtParamWithRelations = ChatGptParam & ChatGgtParamRelations;

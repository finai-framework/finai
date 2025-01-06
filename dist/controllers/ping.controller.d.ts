/// <reference types="express" />
import { Request } from '@loopback/rest';
import { AssetService, GptService, TwitterService } from '../services';
export declare class PingController {
    gptService: GptService;
    assetService: AssetService;
    twitterService: TwitterService;
    private req;
    constructor(gptService: GptService, assetService: AssetService, twitterService: TwitterService, req: Request);
    getReply(): Promise<void>;
    getPathImage(): Promise<void>;
    private getContentFromGPTWithTopic;
    private getContentFromGPT;
    getContentReplyFromGPT(content: string, reply: string): Promise<string>;
}

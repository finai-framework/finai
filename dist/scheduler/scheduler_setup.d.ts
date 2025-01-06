import { LifeCycleObserver } from '@loopback/core';
import { ContentTelegramRepository, GroupToPostContentRepository, MessageRepository } from '../repositories';
import { AssetService, GptService, TelegramBotService, TwitterService } from '../services';
export declare class SchedulerManager implements LifeCycleObserver {
    assetService: AssetService;
    twitterService: TwitterService;
    gptService: GptService;
    telegramBotService: TelegramBotService;
    contentTelegramRepository: ContentTelegramRepository;
    messageRepository: MessageRepository;
    groupToPostContentRepository: GroupToPostContentRepository;
    constructor(assetService: AssetService, twitterService: TwitterService, gptService: GptService, telegramBotService: TelegramBotService, contentTelegramRepository: ContentTelegramRepository, messageRepository: MessageRepository, groupToPostContentRepository: GroupToPostContentRepository);
    getContentReplyFromGPT(content: string, reply: string): Promise<string>;
    private getContentFromGPT;
    private getContentFromGPTWithTopic;
    start(): void;
    stop(): void;
}

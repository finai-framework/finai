import TelegramBot from 'node-telegram-bot-api';
export declare class TelegramBotService {
    bot: TelegramBot;
    constructor();
    initWebHook(): Promise<void>;
}

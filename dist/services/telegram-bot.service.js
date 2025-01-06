"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramBotService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const node_telegram_bot_api_1 = tslib_1.__importDefault(require("node-telegram-bot-api"));
let TelegramBotService = class TelegramBotService {
    constructor( /* Add @inject to inject parameters */) {
        const token = process.env.TELEGRAM_BOT_TOKEN || '';
        // Khởi tạo bot ở chế độ 'none' => ta sẽ chủ động thiết lập Webhook sau
        this.bot = new node_telegram_bot_api_1.default(token, { polling: false });
    }
    async initWebHook() {
        const appUrl = process.env.APP_URL;
        const webhookPath = process.env.WEBHOOK_PATH || '/api/telegram-webhook';
        if (!appUrl) {
            console.error('APP_URL không được cấu hình!');
            return;
        }
        const webhookUrl = `${appUrl}${webhookPath}`;
        try {
            await this.bot.setWebHook(webhookUrl);
            console.log(`✅ Webhook của bot đã được thiết lập tới: ${webhookUrl}`);
        }
        catch (error) {
            console.error('❌ Lỗi khi thiết lập Webhook:', error);
        }
    }
};
exports.TelegramBotService = TelegramBotService;
exports.TelegramBotService = TelegramBotService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__metadata("design:paramtypes", [])
], TelegramBotService);
//# sourceMappingURL=telegram-bot.service.js.map
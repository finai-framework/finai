import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import TelegramBot from 'node-telegram-bot-api';
import {NGROK_FRONTEND} from '../domain';



@injectable({scope: BindingScope.TRANSIENT})
export class TelegramBotService {
  public bot: TelegramBot;

  constructor(/* Add @inject to inject parameters */) {
    const token = process.env.TELEGRAM_BOT_TOKEN || '';
    // Khởi tạo bot ở chế độ 'none' => ta sẽ chủ động thiết lập Webhook sau
    this.bot = new TelegramBot(token, {polling: false});
  }

  async initWebHook() {
    const appUrl = NGROK_FRONTEND;
    const webhookPath = process.env.WEBHOOK_PATH || '/api/telegram-webhook';

    if (!appUrl) {
      console.error('APP_URL không được cấu hình!');
      return;
    }

    const webhookUrl = `${appUrl}${webhookPath}`;
    try {
      await this.bot.setWebHook(webhookUrl);
      console.log(`✅ Webhook của bot đã được thiết lập tới: ${webhookUrl}`);
    } catch (error) {
      console.error('❌ Lỗi khi thiết lập Webhook:', error);
    }
  }
  /*
   * Add service methods here
   */
}

export declare let time_utc_post_telegram_every_day: string;
export declare let nameChatBotTelegram: string;
export declare let max_number_of_message_for_context_bot_telegram: number;
export declare let minutes_of_session_telegram_bot: number;
export declare let headerGroupPostContent: string;
export declare function prompt_reply_telegram_no_content(role: string, context: string): string;
export declare let time_utc_post_tweeter_every_day: string;
export declare let prompt_system_twitter_post: string;
export declare let prompt_to_create_post: string;
export declare function prompt_to_create_post_with_specific_topic(topic: string): string;
export declare function prompt_reply_user(role: string, content: string, context: string, nameChatBotTelegram?: string): string;
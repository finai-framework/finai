export declare class TwitterService {
    constructor();
    postTweet(content: string): Promise<{
        response: any;
    }>;
    postTweetWithMedia(content: string, media: {
        media_ids: string[];
    }): Promise<{
        response: any;
    }>;
    uploadMedia(filePath: string): Promise<string | null>;
    replyToTweet(tweetId: string, content: string): Promise<{
        response: any;
    }>;
    getRepliesToReplyInTodayTweet(): Promise<{
        tweetContent: string;
        repliesToReply: {
            id: string;
            text: string;
        }[];
    } | null>;
    private getIdMe;
    private getTweetsOfMe;
    private getConversationId;
    getRepliesOfTweet(tweet_id: string): Promise<{
        id: string;
        created_at: string;
        edit_history_tweet_ids: string[];
        conversation_id: string;
        text: string;
        author_id: string;
        in_reply_to_user_id: string;
    }[]>;
    private clientUsePackageV2;
    private clientUsePackageV1;
    private getHearderOauth01;
}

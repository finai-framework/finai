"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const axios_1 = tslib_1.__importDefault(require("axios"));
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const form_data_1 = tslib_1.__importDefault(require("form-data"));
const fs = tslib_1.__importStar(require("fs"));
const oauth_1_0a_1 = tslib_1.__importDefault(require("oauth-1.0a"));
const twitter_lite_1 = tslib_1.__importDefault(require("twitter-lite"));
let TwitterService = class TwitterService {
    constructor( /* Add @inject to inject parameters */) { }
    async postTweet(content) {
        try {
            let request_data = {
                url: 'https://api.twitter.com/2/tweets',
                method: 'POST'
            };
            var headersString = this.getHearderOauth01(request_data);
            const response = await axios_1.default.request({
                method: request_data.method,
                url: request_data.url,
                headers: {
                    "Authorization": "OAuth " + headersString,
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Connection": "keep-alive",
                },
                data: {
                    text: content,
                },
            });
            return {
                response: response.data,
            };
        }
        catch (e) {
            console.log(e);
            return {
                response: e,
            };
        }
    }
    async postTweetWithMedia(content, media) {
        try {
            let request_data = {
                url: 'https://api.twitter.com/2/tweets',
                method: 'POST'
            };
            var headersString = this.getHearderOauth01(request_data);
            const response = await axios_1.default.request({
                method: request_data.method,
                url: request_data.url,
                headers: {
                    "Authorization": "OAuth " + headersString,
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Connection": "keep-alive",
                },
                data: {
                    text: content,
                    media,
                },
            });
            return {
                response: response.data,
            };
        }
        catch (e) {
            console.log(e);
            return {
                response: e,
            };
        }
    }
    async uploadMedia(filePath) {
        try {
            let request_data = {
                url: 'https://upload.twitter.com/1.1/media/upload.json?media_category=tweet_image',
                method: 'POST'
            };
            var headersString = this.getHearderOauth01(request_data);
            const form = new form_data_1.default();
            form.append('media', fs.createReadStream(filePath), 'image.jpg');
            const response = await axios_1.default.post(request_data.url, form, {
                headers: {
                    "Authorization": "OAuth " + headersString,
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Connection": "keep-alive",
                    ...form.getHeaders(),
                },
            });
            return response.data.media_id_string;
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }
    async replyToTweet(tweetId, content) {
        try {
            let request_data = {
                url: `https://api.twitter.com/2/tweets`,
                method: 'POST'
            };
            var headersString = this.getHearderOauth01(request_data);
            console.log(headersString);
            console.log({
                text: content,
            });
            const response = await axios_1.default.request({
                method: request_data.method,
                url: request_data.url,
                headers: {
                    "Authorization": "OAuth " + headersString,
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Connection": "keep-alive",
                },
                data: {
                    text: content,
                    reply: {
                        in_reply_to_tweet_id: tweetId,
                    }
                },
            });
            return {
                response: response.data,
            };
        }
        catch (e) {
            return {
                response: e,
            };
        }
    }
    async getRepliesToReplyInTodayTweet() {
        var _a, _b;
        const idMe = await this.getIdMe();
        if (!idMe)
            return null;
        const tweetsOfMe = await this.getTweetsOfMe(idMe);
        if (tweetsOfMe.length == 0)
            return null;
        const tweetId = tweetsOfMe[0].id;
        const conversationId = await this.getConversationId(tweetId);
        const tweetContent = (_b = (_a = tweetsOfMe.find((item) => item.id == conversationId)) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "";
        if (!conversationId)
            return null;
        const res = await this.getRepliesOfTweet(conversationId);
        return {
            tweetContent: tweetContent,
            repliesToReply: res.map((item) => {
                return {
                    id: item.id,
                    text: item.text,
                };
            }),
        };
    }
    async getIdMe() {
        try {
            let request_data = {
                url: `https://api.x.com/2/users/me`,
                method: 'GET'
            };
            var headersString = this.getHearderOauth01(request_data);
            const response = await axios_1.default.request({
                method: request_data.method,
                url: request_data.url,
                headers: {
                    "Authorization": "OAuth " + headersString,
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Connection": "keep-alive",
                },
            });
            return response.data.data.id;
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }
    async getTweetsOfMe(user_id) {
        try {
            let request_data = {
                url: `https://api.twitter.com/2/users/${user_id}/tweets?exclude=replies,retweets`,
                method: 'GET'
            };
            var headersString = this.getHearderOauth01(request_data);
            const response = await axios_1.default.request({
                method: request_data.method,
                url: request_data.url,
                headers: {
                    "Authorization": "OAuth " + headersString,
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Connection": "keep-alive",
                },
            });
            return response.data.data.map((item) => {
                return {
                    id: item.id,
                    text: item.text,
                    edit_history_tweet_ids: item.edit_history_tweet_ids,
                };
            });
        }
        catch (e) {
            console.log(e);
            return [];
        }
    }
    async getConversationId(tweet_id) {
        try {
            let request_data = {
                url: `https://api.x.com/2/tweets?ids=${tweet_id}&tweet.fields=conversation_id,created_at`,
                method: 'GET'
            };
            var headersString = this.getHearderOauth01(request_data);
            const response = await axios_1.default.request({
                method: request_data.method,
                url: request_data.url,
                headers: {
                    "Authorization": "OAuth " + headersString,
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Connection": "keep-alive",
                },
            });
            return response.data.data[0].conversation_id;
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }
    async getRepliesOfTweet(tweet_id) {
        try {
            let tweetClient = this.clientUsePackageV2();
            let res = await tweetClient.get(`tweets/search/recent`, {
                query: `conversation_id:${tweet_id}`,
                "tweet.fields": "in_reply_to_user_id,author_id,created_at,conversation_id",
            });
            const tweets = res.data;
            const unReplytweets = [];
            const repliesMap = new Map();
            if (tweets == undefined || tweets.length == 0)
                return [];
            tweets.forEach(tweet => {
                if (tweet.in_reply_to_user_id) {
                    repliesMap.set(tweet.in_reply_to_user_id, (repliesMap.get(tweet.in_reply_to_user_id) || []).concat(tweet.author_id));
                    console.log(repliesMap);
                }
            });
            for (const tweet of tweets) {
                if (!repliesMap.has(tweet.author_id)) {
                    unReplytweets.push(tweet);
                }
            }
            return unReplytweets;
        }
        catch (e) {
            console.log(e);
            return [];
        }
    }
    clientUsePackageV2() {
        var _a, _b, _c, _d;
        return new twitter_lite_1.default({
            consumer_key: (_a = process.env.TWITTER_CONSUMER_KEY) !== null && _a !== void 0 ? _a : "",
            consumer_secret: (_b = process.env.TWITTER_CONSUMER_SECRET) !== null && _b !== void 0 ? _b : "",
            access_token_key: (_c = process.env.TWITTER_ACCESS_TOKEN) !== null && _c !== void 0 ? _c : "",
            access_token_secret: (_d = process.env.TWITTER_ACCESS_TOKEN_SECRET) !== null && _d !== void 0 ? _d : "",
            version: "2",
            extension: false,
        });
    }
    clientUsePackageV1() {
        var _a, _b, _c, _d;
        return new twitter_lite_1.default({
            consumer_key: (_a = process.env.TWITTER_CONSUMER_KEY) !== null && _a !== void 0 ? _a : "",
            consumer_secret: (_b = process.env.TWITTER_CONSUMER_SECRET) !== null && _b !== void 0 ? _b : "",
            access_token_key: (_c = process.env.TWITTER_ACCESS_TOKEN) !== null && _c !== void 0 ? _c : "",
            access_token_secret: (_d = process.env.TWITTER_ACCESS_TOKEN_SECRET) !== null && _d !== void 0 ? _d : "",
            version: "1.1",
            extension: true
        });
    }
    getHearderOauth01(request_data) {
        var _a, _b, _c, _d;
        const oauth = new oauth_1_0a_1.default({
            consumer: {
                key: (_a = process.env.TWITTER_CONSUMER_KEY) !== null && _a !== void 0 ? _a : "",
                secret: (_b = process.env.TWITTER_CONSUMER_SECRET) !== null && _b !== void 0 ? _b : "",
            },
            signature_method: 'HMAC-SHA1',
            hash_function(base_string, key) {
                return crypto_1.default.createHmac('sha1', key).update(base_string).digest('base64');
            }
        });
        const token = {
            key: (_c = process.env.TWITTER_ACCESS_TOKEN) !== null && _c !== void 0 ? _c : "",
            secret: (_d = process.env.TWITTER_ACCESS_TOKEN_SECRET) !== null && _d !== void 0 ? _d : "",
        };
        const headers = oauth.toHeader(oauth.authorize(request_data, token));
        let headersString = headers.Authorization;
        headersString = headersString.replace("OAuth ", "");
        function removeQuotesAndSpaces(input) {
            return input.replace(/["\s]/g, '');
        }
        headersString = removeQuotesAndSpaces(headersString);
        return headersString;
    }
};
exports.TwitterService = TwitterService;
exports.TwitterService = TwitterService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__metadata("design:paramtypes", [])
], TwitterService);
//# sourceMappingURL=twitter.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const constant_1 = require("../constant");
const models_1 = require("../models");
const services_1 = require("../services");
let PingController = class PingController {
    constructor(gptService, assetService, twitterService, req) {
        this.gptService = gptService;
        this.assetService = assetService;
        this.twitterService = twitterService;
        this.req = req;
    }
    async getReply() {
        try {
            let RepliesToReplyInTodayTweet = await this.twitterService.getRepliesToReplyInTodayTweet();
            if (RepliesToReplyInTodayTweet == null)
                return;
            for (let i = 0; i < RepliesToReplyInTodayTweet.repliesToReply.length; i++) {
                try {
                    let content = await this.getContentReplyFromGPT(RepliesToReplyInTodayTweet.tweetContent, RepliesToReplyInTodayTweet.repliesToReply[i].text);
                    while (content.length > 280) {
                        content = await this.getContentReplyFromGPT(RepliesToReplyInTodayTweet.tweetContent, RepliesToReplyInTodayTweet.repliesToReply[i].text);
                    }
                    await this.twitterService.replyToTweet(RepliesToReplyInTodayTweet.repliesToReply[i].id, content);
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    async getPathImage() {
        console.log("Post bài viết lên Twitter mỗi ngày");
        try {
            let image = await this.assetService.getImageToday();
            if (image != null) {
                // Post bài viết lên Twitter với ảnh
                let id = await this.twitterService.uploadMedia(image.filepath);
                if (id != null) {
                    let content = await this.getContentFromGPTWithTopic(image.topic);
                    while (content.length > 280) {
                        content = await this.getContentFromGPTWithTopic(image.topic);
                    }
                    await this.twitterService.postTweetWithMedia(content, {
                        media_ids: [(id !== null && id !== void 0 ? id : "")],
                    });
                    await this.assetService.changeDoneImage(image.filepath);
                    return;
                }
            }
            // Post bài viết lên Twitter bình thường.
            let content = await this.getContentFromGPT();
            while (content.length > 280) {
                content = await this.getContentFromGPT();
            }
            await this.twitterService.postTweet(content);
        }
        catch (e) {
            console.log(e);
        }
    }
    async getContentFromGPTWithTopic(topic) {
        const res = await this.gptService.responseChat(new models_1.ChatGptParam({
            messages: [
                new models_1.MessGpt({
                    role: "system",
                    content: constant_1.prompt_system_twitter_post,
                }),
                new models_1.MessGpt({
                    role: "user",
                    content: (0, constant_1.prompt_to_create_post_with_specific_topic)(topic),
                })
            ]
        }));
        const content = res["choices"][0]["message"]["content"];
        return content;
    }
    async getContentFromGPT() {
        const res = await this.gptService.responseChat(new models_1.ChatGptParam({
            messages: [
                new models_1.MessGpt({
                    role: "system",
                    content: constant_1.prompt_system_twitter_post,
                }),
                new models_1.MessGpt({
                    role: "user",
                    content: constant_1.prompt_to_create_post,
                })
            ]
        }));
        const content = res["choices"][0]["message"]["content"];
        return content;
    }
    async getContentReplyFromGPT(content, reply) {
        const res = await this.gptService.responseChat(new models_1.ChatGptParam({
            messages: [
                new models_1.MessGpt({
                    role: "user",
                    content: (0, constant_1.prompt_reply_user)("user", content, `user: ${reply}`, constant_1.nameChatBotTelegram),
                }),
            ]
        }));
        const content_reply = res["choices"][0]["message"]["content"];
        if (content_reply.startsWith(`${constant_1.nameChatBotTelegram}:`) || content_reply.startsWith(`@${constant_1.nameChatBotTelegram}: `)) {
            return content_reply.substring(content_reply.indexOf(":") + 1).trim();
        }
        return content_reply;
    }
};
exports.PingController = PingController;
tslib_1.__decorate([
    (0, rest_1.get)('/test-reply-twitter'),
    (0, rest_1.response)(200, {}),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PingController.prototype, "getReply", null);
tslib_1.__decorate([
    (0, rest_1.get)('/test-upload-with-media'),
    (0, rest_1.response)(200, {}),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PingController.prototype, "getPathImage", null);
exports.PingController = PingController = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.service)(services_1.GptService)),
    tslib_1.__param(1, (0, core_1.service)(services_1.AssetService)),
    tslib_1.__param(2, (0, core_1.service)(services_1.TwitterService)),
    tslib_1.__param(3, (0, core_1.inject)(rest_1.RestBindings.Http.REQUEST)),
    tslib_1.__metadata("design:paramtypes", [services_1.GptService,
        services_1.AssetService,
        services_1.TwitterService, Object])
], PingController);
//# sourceMappingURL=ping.controller.js.map
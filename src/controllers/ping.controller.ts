import {inject, service} from '@loopback/core';
import {
  get,
  Request,
  response,
  RestBindings
} from '@loopback/rest';
import {nameChatBotTelegram, prompt_reply_user, prompt_system_twitter_post, prompt_to_create_post, prompt_to_create_post_with_specific_topic} from '../constant';
import {ChatGptParam, MessGpt} from '../models';
import {AssetService, GptService, TwitterService} from '../services';

export class PingController {
  constructor(
    @service(GptService)
    public gptService: GptService,
    @service(AssetService)
    public assetService: AssetService,

    @service(TwitterService)
    public twitterService: TwitterService,

    @inject(RestBindings.Http.REQUEST,)
    private req: Request) { }

  @get('/test-reply-twitter')
  @response(200, {})
  async getReply() {
    try {
      let RepliesToReplyInTodayTweet = await this.twitterService.getRepliesToReplyInTodayTweet();
      if (RepliesToReplyInTodayTweet == null) return;

      for (let i = 0; i < RepliesToReplyInTodayTweet.repliesToReply.length; i++) {
        try {
          let content = await this.getContentReplyFromGPT(
            RepliesToReplyInTodayTweet.tweetContent,
            RepliesToReplyInTodayTweet.repliesToReply[i].text,
          );
          while (content.length > 280) {
            content = await this.getContentReplyFromGPT(
              RepliesToReplyInTodayTweet.tweetContent,
              RepliesToReplyInTodayTweet.repliesToReply[i].text,
            );
          }

          await this.twitterService.replyToTweet(RepliesToReplyInTodayTweet.repliesToReply[i].id, content);
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  @get('/test-upload-with-media')
  @response(200, {})
  async getPathImage(): Promise<void> {
    console.log("Post bài viết lên Twitter mỗi ngày");
    try {
      let image = await this.assetService.getImageToday();
      if (image != null) {
        // Post bài viết lên Twitter với ảnh
        let id = await this.twitterService.uploadMedia(
          image.filepath,
        );
        if (id != null) {
          let content = await this.getContentFromGPTWithTopic(image.topic);
          while (content.length > 280) {
            content = await this.getContentFromGPTWithTopic(image.topic);
          }
          await this.twitterService.postTweetWithMedia(
            content,
            {
              media_ids: [(id ?? "")],
            }
          )
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
    } catch (e) {
      console.log(e);
    }
  }


  private async getContentFromGPTWithTopic(topic: string): Promise<string> {
    const res = await this.gptService.responseChat(new ChatGptParam({
      messages: [
        new MessGpt({
          role: "system",
          content: prompt_system_twitter_post,
        }),
        new MessGpt({
          role: "user",
          content: prompt_to_create_post_with_specific_topic(topic),
        })
      ]
    }));
    const content = (res as any)["choices"][0]["message"]["content"];
    return content;
  }
  private async getContentFromGPT() {
    const res = await this.gptService.responseChat(new ChatGptParam({
      messages: [
        new MessGpt({
          role: "system",
          content: prompt_system_twitter_post,
        }),
        new MessGpt({
          role: "user",
          content: prompt_to_create_post,
        })
      ]
    }));
    const content = (res as any)["choices"][0]["message"]["content"];
    return content;
  }
  async getContentReplyFromGPT(
    content: string,
    reply: string,
  ): Promise<string> {
    const res = await this.gptService.responseChat(new ChatGptParam({
      messages: [
        new MessGpt({
          role: "user",
          content: prompt_reply_user(
            {
              role: "user",
              content: content,
              context: `user: ${reply}`,
              nameChatBot: nameChatBotTelegram,
            }
          ),
        }),
      ]
    }));
    const content_reply = (res as any)["choices"][0]["message"]["content"];
    if (content_reply.startsWith(`${nameChatBotTelegram}:`) || content_reply.startsWith(`@${nameChatBotTelegram}: `)) {
      return content_reply.substring(content_reply.indexOf(":") + 1).trim();
    }
    return content_reply;
  }
}

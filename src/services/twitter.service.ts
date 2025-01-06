import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import axios from 'axios';
import crypto from 'crypto';
import FormData from 'form-data';
import * as fs from 'fs';
import OAuth from 'oauth-1.0a';
import Twitter from 'twitter-lite';

@injectable({scope: BindingScope.TRANSIENT})
export class TwitterService {
  constructor(/* Add @inject to inject parameters */) { }

  public async postTweet(content: string) {
    try {
      let request_data = {
        url: 'https://api.twitter.com/2/tweets',
        method: 'POST'
      }
      var headersString = this.getHearderOauth01(request_data);
      const response = await axios.request(
        {
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
        }
      )
      return {
        response: response.data,
      };

    } catch (e) {
      console.log(e);
      return {
        response: e,
      };
    }
  }
  public async postTweetWithMedia(content: string, media: {
    media_ids: string[],
  }) {
    try {
      let request_data = {
        url: 'https://api.twitter.com/2/tweets',
        method: 'POST'
      }
      var headersString = this.getHearderOauth01(request_data);
      const response = await axios.request(
        {
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
        }
      )
      return {
        response: response.data,
      };

    } catch (e) {
      console.log(e);
      return {
        response: e,
      };
    }
  }

  public async uploadMedia(filePath: string): Promise<string | null> {

    try {
      let request_data = {
        url: 'https://upload.twitter.com/1.1/media/upload.json?media_category=tweet_image',
        method: 'POST'
      }
      var headersString = this.getHearderOauth01(request_data);
      const form = new FormData();
      form.append('media', fs.createReadStream(filePath), 'image.jpg');

      const response = await axios.post(request_data.url, form, {
        headers: {
          "Authorization": "OAuth " + headersString,
          "Content-Type": "application/json",
          "Accept": "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "Connection": "keep-alive",
          ...form.getHeaders(),
        },
      }
      )
      return response.data.media_id_string;
    } catch (e) {
      console.log(e);
      return null;
    }

  }

  public async replyToTweet(
    tweetId: string,
    content: string,
  ) {
    try {
      let request_data = {
        url: `https://api.twitter.com/2/tweets`,
        method: 'POST'
      }
      var headersString = this.getHearderOauth01(request_data);
      console.log(headersString);
      console.log({
        text: content,
      });
      const response = await axios.request(
        {
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
        }
      )
      return {
        response: response.data,
      };

    } catch (e) {
      return {
        response: e,
      };
    }
  }

  public async getRepliesToReplyInTodayTweet(): Promise<{
    tweetContent: string,
    repliesToReply: {
      id: string,
      text: string,
    }[]
  } | null> {
    const idMe = await this.getIdMe();
    if (!idMe) return null;
    const tweetsOfMe = await this.getTweetsOfMe(idMe);
    if (tweetsOfMe.length == 0) return null;
    const tweetId = tweetsOfMe[0].id;
    const conversationId = await this.getConversationId(tweetId);
    const tweetContent = tweetsOfMe.find((item) => item.id == conversationId)?.text ?? "";
    if (!conversationId) return null;
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

  private async getIdMe(): Promise<string | null> {
    try {
      let request_data = {
        url: `https://api.x.com/2/users/me`,
        method: 'GET'
      }
      var headersString = this.getHearderOauth01(request_data);
      const response = await axios.request(
        {
          method: request_data.method,
          url: request_data.url,
          headers: {
            "Authorization": "OAuth " + headersString,
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
          },
        }
      )
      return response.data.data.id;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  private async getTweetsOfMe(user_id: string): Promise<{
    id: string,
    text: string,
    edit_history_tweet_ids: string[],
  }[]> {
    try {
      let request_data = {
        url: `https://api.twitter.com/2/users/${user_id}/tweets?exclude=replies,retweets`,
        method: 'GET'
      }
      var headersString = this.getHearderOauth01(request_data);
      const response = await axios.request(
        {
          method: request_data.method,
          url: request_data.url,
          headers: {
            "Authorization": "OAuth " + headersString,
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
          },
        }
      )
      return response.data.data.map((item: any) => {
        return {
          id: item.id,
          text: item.text,
          edit_history_tweet_ids: item.edit_history_tweet_ids,
        };
      });
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  private async getConversationId(tweet_id: string): Promise<string | null> {
    try {
      let request_data = {
        url: `https://api.x.com/2/tweets?ids=${tweet_id}&tweet.fields=conversation_id,created_at`,
        method: 'GET'
      }
      var headersString = this.getHearderOauth01(request_data);
      const response = await axios.request(
        {
          method: request_data.method,
          url: request_data.url,
          headers: {
            "Authorization": "OAuth " + headersString,
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
          },
        }
      )
      return response.data.data[0].conversation_id;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  public async getRepliesOfTweet(tweet_id: string): Promise<{
    id: string,
    created_at: string,
    edit_history_tweet_ids: string[]
    conversation_id: string,
    text: string,
    author_id: string,
    in_reply_to_user_id: string,
  }[]> {
    try {
      let tweetClient = this.clientUsePackageV2()

      let res = await tweetClient.get(
        `tweets/search/recent`,
        {
          query: `conversation_id:${tweet_id}`,
          "tweet.fields": "in_reply_to_user_id,author_id,created_at,conversation_id",
        }
      )

      const tweets = res.data as any[];

      const unReplytweets = [];
      const repliesMap = new Map();

      if (tweets == undefined || tweets.length == 0) return [];
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
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  private clientUsePackageV2() {
    return new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY ?? "",
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET ?? "",
      access_token_key: process.env.TWITTER_ACCESS_TOKEN ?? "",
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET ?? "",
      version: "2",
      extension: false,
    });
  }
  private clientUsePackageV1() {
    return new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY ?? "",
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET ?? "",
      access_token_key: process.env.TWITTER_ACCESS_TOKEN ?? "",
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET ?? "",
      version: "1.1",
      extension: true
    });
  }

  private getHearderOauth01(
    request_data: {url: string; method: string;},
  ) {
    const oauth = new OAuth({
      consumer: {
        key: process.env.TWITTER_CONSUMER_KEY ?? "",
        secret: process.env.TWITTER_CONSUMER_SECRET ?? "",
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
      }
    });

    const token = {
      key: process.env.TWITTER_ACCESS_TOKEN ?? "",
      secret: process.env.TWITTER_ACCESS_TOKEN_SECRET ?? "",
    };

    const headers = oauth.toHeader(oauth.authorize(request_data, token));
    let headersString = headers.Authorization;
    headersString = headersString.replace("OAuth ", "");
    function removeQuotesAndSpaces(input: string): string {
      return input.replace(/["\s]/g, '');
    }
    headersString = removeQuotesAndSpaces(headersString);
    return headersString;
  }
}

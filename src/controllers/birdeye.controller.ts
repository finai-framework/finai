// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {get} from '@loopback/rest';
import {BirdeyeService, TwitterService} from '../services';

// import {inject} from '@loopback/core';


export class BirdeyeController {
  constructor(
    @service(BirdeyeService)
    public birdeyeService: BirdeyeService,
    @service(TwitterService)
    public twitterService: TwitterService,
  ) { }

  // @get('/birdeye/string-to-make-content')
  // async getStringToMakeContent(): Promise<string> {
  //   return this.birdeyeService.getStringToMakeContent({
  //     isNotHaveCommentary: false,
  //   });
  // }

  // @get('/birdeye/post-content-by-birdeye')
  // async postContentByBirdeye(): Promise<void> {
  //   let res = await this.birdeyeService.getStringToMakeContent({
  //     isNotHaveCommentary: true,
  //   });
  //   this.twitterService.postTweet(res);
  // }
}

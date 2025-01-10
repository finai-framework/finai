// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {get, param} from '@loopback/rest';
import {BirdeyeService, Token, TokenInfo} from '../services';

// import {inject} from '@loopback/core';


export class BirdeyeController {
  constructor(
    @service(BirdeyeService)
    public birdeyeService: BirdeyeService,
  ) { }

  @get('/birdeye/tokens-trending')
  async getTokensTrending(): Promise<Token[]> {
    return this.birdeyeService.getTokensTrending();
  }

  @get('/birdeye/token-info')
  async getInfoToken(
    @param.query.string('address')
    address: string
  ): Promise<TokenInfo> {
    return this.birdeyeService.getInfoToken(address);
  }

  @get('/birdeye/string-to-make-content')
  async getStringToMakeContent(): Promise<string> {
    return this.birdeyeService.getStringToMakeContent({
      isNotHaveCommentary: true,
    });
  }
}

import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import axios from 'axios';
import {TokenAnalysisInfo, isApplyCommentary, prompt_analytics_token} from '../constant';
import {ChatGptParam, MessGpt} from '../models';
import {GptService} from './gpt.service';

@injectable({scope: BindingScope.TRANSIENT})
export class BirdeyeService {
  constructor(
    @service(GptService)
    public gptService: GptService
  ) { }

  async getStringToMakeContent(info: {
    isNotHaveCommentary: boolean,
    infoToken: TokenAnalysisInfo,
  }) {
    let {isNotHaveCommentary, infoToken} = info;
    let stringToMakeContent = `${infoToken.title}\n`;
    let topTokenInfoTrending: Token[] = []

    topTokenInfoTrending = await this.fetchTrendingTokens(infoToken, topTokenInfoTrending);

    for (let i = 0; i < topTokenInfoTrending.length; i++) {
      stringToMakeContent = this.getInfoTokenToMakeContent(topTokenInfoTrending, i, stringToMakeContent, infoToken);
    }
    let contentOfTop5Token = stringToMakeContent.toLowerCase();

    if (isNotHaveCommentary || !isApplyCommentary) {
      return contentOfTop5Token;
    }

    let contentOfGpt = await this.gptService.responseChat(
      new ChatGptParam(
        {
          messages: [
            new MessGpt({
              role: "user",
              content: prompt_analytics_token(contentOfTop5Token)
            }),
          ]
        }
      )
    );
    return (contentOfGpt as any)["choices"][0]["message"]["content"].toLowerCase();
  }

  private async fetchTrendingTokens(infoToken: TokenAnalysisInfo, topTokenInfoTrending: Token[]) {
    if (infoToken.typeCategory instanceof TypeChainAll) {
      let typeChainAll: TypeChainAll = infoToken.typeCategory as TypeChainAll;
      let promises = typeChainAll.chains.map(async (chain) => {
        let topAllTokenTrending = (await this.getTokensTrending(chain))[0];
        return topAllTokenTrending;
      });
      let topTokenTrendingRes = await Promise.all(promises);

      topTokenTrendingRes = await this.addAgeAndSocialByDexScreener(topTokenTrendingRes);

      topTokenInfoTrending = await this.getTokenInfosTrending(topTokenTrendingRes);
    } else if (infoToken.typeCategory instanceof TypeChainCustom) {
      let typeChainCustom = infoToken.typeCategory as TypeChainCustom;
      let topAllTokenTrending = await this.getTokensTrending(typeChainCustom.chain);

      topAllTokenTrending = await this.addAgeAndSocialByDexScreener(topAllTokenTrending);

      if (typeChainCustom.is_new_trending) {
        topAllTokenTrending = topAllTokenTrending.sort((a, b) => {
          if (a.age_hour && b.age_hour) {
            return a.age_hour - b.age_hour;
          }
          return 0;
        });
        // filter token have age < 24h
        topAllTokenTrending = topAllTokenTrending.filter((item) => {
          console.log(item.age_hour);
          return item.age_hour && item.age_hour < 24;
        });
      }

      topAllTokenTrending = topAllTokenTrending.slice(0, typeChainCustom.max_number_of_token);
      topTokenInfoTrending = await this.getTokenInfosTrending(topAllTokenTrending);
    } else if (infoToken.typeCategory instanceof TypeChainSpecificToken) {
      let listToken = (infoToken.typeCategory as TypeChainSpecificToken).listToken;
      let tokens: Token[] = [];
      for (let i = 0; i < listToken.length; i++) {
        let token = listToken[i];
        tokens.push(new Token({
          address: token.token,
          chain: token.chain,
        }));
      }
      tokens = await this.addAgeAndSocialByDexScreener(tokens);

      topTokenInfoTrending = await this.getTokenInfosTrendingByListAddress((infoToken.typeCategory as TypeChainSpecificToken).listToken);
    }
    return topTokenInfoTrending;
  }

  public getCategoryToPost(): TokenAnalysisInfo {
    // return {
    //   typeCategory: new TypeChainAll(),
    //   type_time: TypeTime._24h,
    //   title: "🚀 Top 5 trending tokens on Solana 🚀\n",
    // };
    // return {
    //   typeCategory: new TypeChainSpecialToken(
    //     [
    //       {
    //         token: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
    //         chain: "bsc"
    //       },
    //       {
    //         token: "3vPnCvrYU6xrWQj4xQqLtLeBzbiiYH4dLSoJQq2Lpump",
    //         chain: "solana"
    //       },
    //     ],
    //   ),
    //   type_time: TypeTime._24h,
    //   title: "🚀 Top 5 trending tokens on Solana 🚀\n",
    // };
    return {
      typeCategory: new TypeChainCustom(
        {
          chain: "ethereum",
          max_number_of_token: 10,
          is_new_trending: true,
        }
      ),
      type_time: TypeTime._1h,
      title: "🚀 Top 5 trending tokens on Solana 🚀\n",
    }
  }

  private getInfoTokenToMakeContent(top5TokenInfoTrending: TokenInfo[], i: number, stringToMakeContent: string, infoAnalaizeToken: TokenAnalysisInfo) {
    let tokenInfo = top5TokenInfoTrending[i];
    let symbol = tokenInfo.symbol;
    let market_cap = formatNumber(((tokenInfo.price ?? 0) * (tokenInfo.supply ?? 0)));

    let type_time = infoAnalaizeToken.type_time;
    let change_percent = () => {
      switch (type_time) {
        case TypeTime._30m:
          return tokenInfo.priceChange30mPercent;
        case TypeTime._1h:
          return tokenInfo.priceChange1hPercent;
        case TypeTime._2h:
          return tokenInfo.priceChange2hPercent;
        case TypeTime._4h:
          return tokenInfo.priceChange4hPercent;
        case TypeTime._6h:
          return tokenInfo.priceChange6hPercent;
        case TypeTime._8h:
          return tokenInfo.priceChange8hPercent;
        case TypeTime._12h:
          return tokenInfo.priceChange12hPercent;
        case TypeTime._24h:
          return tokenInfo.priceChange24hPercent;
        default:
          0;
      }
    };

    let change_percent_string = formatNumber(change_percent() ?? 0);

    let linktwitter = tokenInfo.extensions?.twitter ?? (tokenInfo.socials_from_dexscreener ?? []).find((item: any) => {
      return item.type == "twitter";
    })?.url ?? "";
    let nameTwitter = this.getNameTwiiter(linktwitter);

    stringToMakeContent += `$${symbol} - $${market_cap} (${((tokenInfo.priceChange24hPercent ?? 0) > 0) ? "🟢" : "🔴"}${change_percent_string}%) ${nameTwitter}`;
    stringToMakeContent += "\n";
    return stringToMakeContent;
  }

  private getNameTwiiter(linktwitter: string) {
    let nameTwitter = "@";
    if (!linktwitter) {
      nameTwitter = "";
    } else {
      nameTwitter += linktwitter?.split("/")[linktwitter.split("/").length - 1];
    }
    return nameTwitter;
  }

  private async getTokenInfosTrending(top5TokenTrending: Token[]) {
    let top5TokenInfoTrending = [];

    for (let i = 0; i < top5TokenTrending.length; i++) {
      let token = top5TokenTrending[i];
      let tokenInfo = await this.getInfoToken(token.address ?? "", token.chain ?? "");
      if (!tokenInfo) {
        continue;
      }
      tokenInfo.socials_from_dexscreener = token.socials_from_dexscreener;
      top5TokenInfoTrending.push(tokenInfo);
    }
    return top5TokenInfoTrending;
  }

  private async getTokenInfosTrendingByListAddress(tokens: Token[],) {
    let top5TokenInfoTrending = [];

    for (let i = 0; i < tokens.length; i++) {
      let tokenInfo = await this.getInfoToken(tokens[i].address ?? '', tokens[i].chain ?? '');
      if (!tokenInfo) {
        continue;
      }
      tokenInfo.socials_from_dexscreener = tokens[i].socials_from_dexscreener;
      top5TokenInfoTrending.push(tokenInfo);
    }
    return top5TokenInfoTrending;
  }

  async getTokensTrending(category: string): Promise<Token[]> {
    let url = "https://public-api.birdeye.so/defi/token_trending";
    let params = {
      "sort_by": "rank",
      "sort_type": "asc",
      "offset": 0,
      "limit": 20
    }

    let header = {
      "x-chain": category
    }
    let response = await this.get(url, params, header);

    let listTokenTrending = response.data.data.tokens;
    listTokenTrending.forEach((item: Token, index: number) => {
      item.chain = category;
    });
    return listTokenTrending;
  }

  async getInfoToken(address: string, category: string): Promise<TokenInfo | null> {
    try {
      let url = `https://public-api.birdeye.so/defi/token_overview`;
      let params = {
        "address": address
      }
      let header = {
        "x-chain": category
      }
      let response = await this.get(url, params, header)
      let tokenInfo: TokenInfo = response.data.data;
      return tokenInfo;
    } catch (e) {
      return null;
    }
  }

  get(url: string, params: object, header?: object) {
    return axios.get(url, {
      params: params,
      headers: {
        "X-API-KEY": process.env.BIRDEYE_API_KEY,
        ...header
      }
    });
  }

  async addAgeAndSocialByDexScreener(token: Token[]): Promise<Token[]> {
    let tokens: Token[] = [];
    let listToken = token.map((item) => item.address).join(",");
    let res = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${listToken}`);
    let data = res.data;
    let listPair: TokenInfoFromDexScreener[] = data.pairs;


    for (let i = 0; i < token.length; i++) {
      let tokenInfo = token[i];
      let tokenFromDexScreener = listPair.find((item) => item.baseToken?.address === tokenInfo.address);
      if (tokenFromDexScreener) {
        let age_hour = new Date().getTime() - new Date(tokenFromDexScreener.pairCreatedAt ?? 0).getTime();
        age_hour = Math.floor(age_hour / 1000 / 60 / 60);
        tokenInfo.age_hour = age_hour;
        tokenInfo.socials_from_dexscreener = tokenFromDexScreener.info?.socials;
      }
      tokens.push(tokenInfo);
    }



    return tokens;
  }

}

export class Token {
  address?: string;
  decimals?: number;
  liquidity?: number;
  logoURI?: string;
  name?: string;
  symbol?: string;
  volume24hUSD?: number;
  rank?: number;
  price?: number;
  age_hour?: number;
  chain?: string;
  socials_from_dexscreener?: any;

  // CONTRUCTOR
  constructor(
    info?: {
      address?: string;
      decimals?: number;
      liquidity?: number;
      logoURI?: string;
      name?: string;
      symbol?: string;
      volume24hUSD?: number;
      rank?: number;
      price?: number;
      age_hour?: number;
      chain?: string;
      socials_from_dexscreener?: any[];
    }
  ) {
    if (info != null) {
      const {address, decimals, liquidity, logoURI, name, symbol, volume24hUSD, rank, price, age_hour, chain, socials_from_dexscreener} = info;
      if (address != null)
        this.address = address;
      if (decimals != null)
        this.decimals = decimals;
      if (liquidity != null)
        this.liquidity = liquidity;
      if (logoURI != null)
        this.logoURI = logoURI;
      if (name != null)
        this.name = name;
      if (symbol != null)
        this.symbol = symbol;
      if (volume24hUSD != null)
        this.volume24hUSD = volume24hUSD;
      if (rank != null)
        this.rank = rank;
      if (price != null)
        this.price = price;
      if (age_hour != null)
        this.age_hour = age_hour;
      if (chain != null)
        this.chain = chain;
      if (socials_from_dexscreener != null)
        this.socials_from_dexscreener = socials_from_dexscreener;
    }
  }
}

export class TokenInfo {
  address?: string;
  decimals?: number;
  symbol?: string;
  name?: string;
  extensions?: {
    coingeckoId?: string;
    serumV3Usdc?: string;
    serumV3Usdt?: string;
    website?: string;
    telegram?: string;
    twitter?: string;
    description?: string;
    discord?: string;
    medium?: string;
  };
  logoURI?: string;
  liquidity?: number;
  lastTradeUnixTime?: number;
  lastTradeHumanTime?: string;
  price?: number;
  history30mPrice?: number;
  priceChange30mPercent?: number;
  history1hPrice?: number;
  priceChange1hPercent?: number;
  history2hPrice?: number;
  priceChange2hPercent?: number;
  history4hPrice?: number;
  priceChange4hPercent?: number;
  history6hPrice?: number;
  priceChange6hPercent?: number;
  history8hPrice?: number;
  priceChange8hPercent?: number;
  history12hPrice?: number;
  priceChange12hPercent?: number;
  history24hPrice?: number;
  priceChange24hPercent?: number;
  uniqueWallet30m?: number;
  uniqueWalletHistory30m?: number;
  uniqueWallet30mChangePercent?: number;
  uniqueWallet1h?: number;
  uniqueWalletHistory1h?: number;
  uniqueWallet1hChangePercent?: number;
  uniqueWallet2h?: number;
  uniqueWalletHistory2h?: number;
  uniqueWallet2hChangePercent?: number;
  uniqueWallet4h?: number;
  uniqueWalletHistory4h?: number;
  uniqueWallet4hChangePercent?: number;
  uniqueWallet8h?: number;
  uniqueWalletHistory8h?: number;
  uniqueWallet8hChangePercent?: number;
  uniqueWallet24h?: number;
  uniqueWalletHistory24h?: number;
  uniqueWallet24hChangePercent?: number;
  supply?: number;
  mc?: number;
  circulatingSupply?: number;
  realMc?: number;
  holder?: number;
  trade30m?: number;
  tradeHistory30m?: number;
  trade30mChangePercent?: number;
  sell30m?: number;
  sellHistory30m?: number;
  sell30mChangePercent?: number;
  buy30m?: number;
  buyHistory30m?: number;
  buy30mChangePercent?: number;
  v30m?: number;
  v30mUSD?: number;
  vHistory30m?: number;
  vHistory30mUSD?: number;
  v30mChangePercent?: number;
  vBuy30m?: number;
  vBuy30mUSD?: number;
  vBuyHistory30m?: number;
  vBuyHistory30mUSD?: number;
  vBuy30mChangePercent?: number;
  vSell30m?: number;
  vSell30mUSD?: number;
  vSellHistory30m?: number;
  vSellHistory30mUSD?: number;
  vSell30mChangePercent?: number;
  trade1h?: number;
  tradeHistory1h?: number;
  trade1hChangePercent?: number;
  sell1h?: number;
  sellHistory1h?: number;
  sell1hChangePercent?: number;
  buy1h?: number;
  buyHistory1h?: number;
  v1h?: number;
  v1hUSD?: number;
  vHistory1h?: number;
  vHistory1hUSD?: number;
  v1hChangePercent?: number;
  vBuy1h?: number;
  vBuy1hUSD?: number;
  vBuyHistory1h?: number;
  vBuyHistory1hUSD?: number;
  vBuy1hChangePercent?: number;
  vSell1h?: number;
  vSell1hUSD?: number;
  vSellHistory1h?: number;
  vSellHistory1hUSD?: number;
  vSell1hChangePercent?: number;
  trade2h?: number;
  tradeHistory2h?: number;
  trade2hChangePercent?: number;
  sell2h?: number;
  sellHistory2h?: number;
  sell2hChangePercent?: number;
  buy2h?: number;
  buyHistory2h?: number;
  buy2hChangePercent?: number;
  v2h?: number;
  v2hUSD?: number;
  vHistory2h?: number;
  vHistory2hUSD?: number;
  v2hChangePercent?: number;
  vBuy2h?: number;
  vBuy2hUSD?: number;
  vBuyHistory2h?: number;
  vBuyHistory2hUSD?: number;
  vBuy2hChangePercent?: number;
  vSell2h?: number;
  vSell2hUSD?: number;
  vSellHistory2h?: number;
  vSellHistory2hUSD?: number;
  vSell2hChangePercent?: number;
  trade4h?: number;
  tradeHistory4h?: number;
  trade4hChangePercent?: number;
  sell4h?: number;
  sellHistory4h?: number;
  sell4hChangePercent?: number;
  buy4h?: number;
  buyHistory4h?: number;
  buy4hChangePercent?: number;
  v4h?: number;
  v4hUSD?: number;
  vHistory4h?: number;
  vHistory4hUSD?: number;
  v4hChangePercent?: number;
  vBuy4h?: number;
  vBuy4hUSD?: number;
  vBuyHistory4h?: number;
  vBuyHistory4hUSD?: number;
  vBuy4hChangePercent?: number;
  vSell4h?: number;
  vSell4hUSD?: number;
  vSellHistory4h?: number;
  vSellHistory4hUSD?: number;
  vSell4hChangePercent?: number;
  trade8h?: number;
  tradeHistory8h?: number;
  trade8hChangePercent?: number;
  sell8h?: number;
  sellHistory8h?: number;
  sell8hChangePercent?: number;
  buy8h?: number;
  buyHistory8h?: number;
  buy8hChangePercent?: number;
  v8h?: number;
  v8hUSD?: number;
  vHistory8h?: number;
  vHistory8hUSD?: number;
  v8hChangePercent?: number;
  vBuy8h?: number;
  vBuy8hUSD?: number;
  vBuyHistory8h?: number;
  vBuyHistory8hUSD?: number;
  vBuy8hChangePercent?: number;
  vSell8h?: number;
  vSell8hUSD?: number;
  vSellHistory8h?: number;
  vSellHistory8hUSD?: number;
  vSell8hChangePercent?: number;
  trade24h?: number;
  tradeHistory24h?: number;
  trade24hChangePercent?: number;
  sell24h?: number;
  sellHistory24h?: number;
  sell24hChangePercent?: number;
  buy24h?: number;
  buyHistory24h?: number;
  buy24hChangePercent?: number;
  v24h?: number;
  v24hUSD?: number;
  vHistory24h?: number;
  vHistory24hUSD?: number;
  v24hChangePercent?: number;
  vBuy24h?: number;
  vBuy24hUSD?: number;
  vBuyHistory24h?: number;
  vBuyHistory24hUSD?: number;
  vBuy24hChangePercent?: number;
  vSell24h?: number;
  vSell24hUSD?: number;
  vSellHistory24h?: number;
  vSellHistory24hUSD?: number;
  vSell24hChangePercent?: number;
  watch?: any;
  numberMarkets?: number;
  socials_from_dexscreener?: any[];
}

function formatNumber(num: number): string {
  if (num >= 1e9) {
    return parseFloat((num / 1e9).toFixed(1)) + 'B';
  }
  if (num >= 1e6) {
    return parseFloat((num / 1e6).toFixed(1)) + 'M';
  }
  if (num >= 1e3) {
    return parseFloat((num / 1e3).toFixed(1)) + 'k';
  }
  const roundedNumber = num.toFixed(1);
  return parseFloat(roundedNumber).toString();
}

class TokenInfoFromDexScreener {
  chainId?: string;
  dexId?: string;
  url?: string;
  pairAddress?: string;
  labels?: string[];
  baseToken?: {
    address?: string;
    name?: string;
    symbol?: string;
  };
  quoteToken?: {
    address?: string;
    name?: string;
    symbol?: string;
  };
  priceNative?: string;
  priceUsd?: string;
  liquidity?: {
    usd?: number;
    base?: number;
    quote?: number;
  };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
  info?: {
    imageUrl?: string;
    websites?: {
      url?: string;
    }[];
    socials?: {
      type?: string;
      url?: string;
    }[];
  };
  boosts?: {
    active?: number;
  };
  txns: any;
  priceChange: any;
}
export enum TypeTime {
  _30m = "30m",
  _1h = "1h",
  _2h = "2h",
  _4h = "4h",
  _8h = "8h",
  _24h = "24h",
  _6h = "6h",
  _12h = "12h",
}
export abstract class TypeChain { }

export class TypeChainAll extends TypeChain {
  chains: string[] = ["solana", "ethereum", "arbitrum", "avalanche", "bsc", "optimism", "polygon", "base", "zksync", "sui"];

  // contructor
  constructor(
    chains?: string[],
  ) {
    super();
    if (chains != null)
      this.chains = chains;
  }
}
export class TypeChainCustom extends TypeChain {
  chain: string = "solana";

  // number of token to analyze
  // if null, use the default value is 5
  max_number_of_token: number = 5;
  // is new trending
  is_new_trending: boolean = false;

  constructor(
    info: {
      chain?: string,
      max_number_of_token?: number,
      is_new_trending?: boolean,
    }
  ) {
    super();
    const {chain, max_number_of_token, is_new_trending} = info;
    if (chain != null)
      this.chain = chain;
    if (max_number_of_token != null)
      this.max_number_of_token = max_number_of_token;
    if (is_new_trending != null)
      this.is_new_trending = is_new_trending;
  }
}
export class TypeChainSpecificToken extends TypeChain {
  listToken: {
    token: string;
    chain: string;
  }[] = [];

  constructor(
    listToken: {
      token: string;
      chain: string;
    }[],
  ) {
    super();
    this.listToken = listToken;
  }

}

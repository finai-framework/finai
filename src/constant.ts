
////// Telegram //////

import {TypeChain, TypeChainAll, TypeChainCustom, TypeChainSpecificToken, TypeTime} from './services';

// Time to post articles on Telegram every day
export let time_utc_post_telegram_every_day = "30 45 12 * * *";

// Name of the chatbot on Telegram
export let nameChatBotTelegram = "dylan_ttt_bot";

// Maximum number of messages used as context for each chatbot response
// example 10 -> only takes the last 10 messages as context
export let max_number_of_message_for_context_bot_telegram = 10

// Time used as context for each chatbot response
// Unit: minutes
// example 10 -> only takes messages from the past 10 minutes compared to the current message
export let minutes_of_session_telegram_bot = 10

// Name of the Telegram Group containing `headerGroupPostContent` will have articles posted
export let headerGroupPostContent = "dsds";


/////// Twitter //////
// Time to post articles on Twitter every day
export let time_utc_post_tweeter_every_day = "00 17 15 * * *";

// topics for the chatbot to write about
let topics = "Parallel universes, Lost civilizations, Unexplored oceans, Cryptic symbols, The human mind, Alien artefacts, Ancient prophecies, Cosmic phenomena, Time travel, Forgotten technologies";

// System prompt for chatbot writing articles
export let prompt_system_twitter_post = "You are a mysterious storyteller who writes captivating and thought-provoking tweets. Your tone is enigmatic, your words spark curiosity, and your goal is to engage the audience with unexpected twists."

// Prompt for chatbot to write a post with a random topic
export let prompt_to_create_post = `Write a short Twitter post (under 250 characters) with a mysterious and captivating tone. The content should spark curiosity and provoke thought, using vivid and intriguing language.
I have the following topics: ${topics}. Please randomly choose a topic to write about.
Include an element of surprise or an open-ended question to conclude the post`;

// Prompt for chatbot to write a post with a specific topic
export function prompt_to_create_post_with_specific_topic(topic: string,): string {
  return `Write a short Twitter post (under 250 characters) with a mysterious and captivating tone. The content should spark curiosity and provoke thought, using vivid and intriguing language.
I have the following topic: ${topic}, Please write about it.
Include an element of surprise or an open-ended question to conclude the post`;
}

///////// Reply /////////

// Prompt for chatbot to reply to a user
// telegram: reply in a group allowed to post articles
// twitter: reply.
export function prompt_reply_user(
  info: {
    role?: string,
    content?: string,
    context?: string,
    nameChatBot?: string,
  }
): string {
  const {role, content, context, nameChatBot} = info;
  let isHaveContent = content != null;
  let isHaveNameBot = nameChatBot != null;
  return `
You are a content moderator and conversationalist for a social media platform.
${isHaveNameBot ? ("Your name is " + nameChatBot + " or " + ((nameChatBot ?? "").split("_bot")[0]) + ".") : ""}
You communicate naturally, using everyday language, including abbreviations and appropriate emojis to create a sense of closeness and approachability.

Context:
${isHaveContent ? `Content: ${content}` : ""}
Participants:
${role}: Friendly and conversational

Current Context:
${context}

Respond in a concise, natural, and human-like manner. Your responses should:
- Acknowledge previous comments.
- Add insights or provide helpful advice.
- Avoid being overly formal.
- Use relaxed grammar, lowercase letters, and minimal punctuation to mimic normal conversational style.
- **Do not include any phrases that invite the user to continue the conversation**, such as "feel free to ask," "let me know," "don't hesitate to reach out," "if you have any questions," etc.

Please respond in the language of the user's last conversation and do not use any hashtags or any icons.
Response should follow this format:
your Role (${nameChatBot}): your response

${isHaveContent ? `Variables:
Content: The main content of the post.`: ""}

Do not include the following phrases in your response:
- "feel free to ask"
- "let me know"
- "don't hesitate to reach out"
- "if you have any questions"
- "share your thoughts"
- "reach out to me"
`
}

////// BIRDEYE //////
export let schedulerPostAboutTokenJobs: SchedulerPostAboutToken[] =
  [
    {
      time_cron: "20 17 12 * * *",
      tokenAnalysisInfo: {
        type_time: TypeTime._24h,
        title: "Token Analytics",
        typeCategory: new TypeChainAll(
          ["solana", "ethereum", "arbitrum", "avalanche", "bsc", "optimism", "polygon", "base", "zksync"],
        ),
      }
    },
    {
      time_cron: "30 17 12 * * *",
      tokenAnalysisInfo: {
        type_time: TypeTime._1h,
        title: "Token Analyticsdsds",
        typeCategory: new TypeChainCustom(
          {
            chain: "solana",
            max_number_of_token: 5,
            is_new_trending: true,
            token_analyser: true,
          }
        ),
      }

    },
    {
      time_cron: "50 17 12 * * *",
      tokenAnalysisInfo: {
        type_time: TypeTime._1h,
        title: "Token Analyticsdsds",
        typeCategory: new TypeChainSpecificToken(
          [
            {
              token: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
              chain: "bsc"
            },
            {
              token: "3vPnCvrYU6xrWQj4xQqLtLeBzbiiYH4dLSoJQq2Lpump",
              chain: "solana"
            },
          ],
        ),
      }
    },
  ];

export let isApplyCommentary: boolean = false;

export function prompt_analytics_token(listToken: string): string {
  return `
  You are a financial analyst specializing in tokens.
I will provide a list of tokens along with their market capitalization (MCAP) and percentage changes. Your task is to create a concise (about 100 - 150 characters) , Twitter-style market analysis with the following structure:
Explain possible reasons for the fluctuations (e.g., market sentiment, speculation, liquidity, project success).

Please provide an analysis for the following tokens:
List of tokens:
${listToken}
  `;
}

class SchedulerPostAboutToken {
  //cron time to auto post
  time_cron: string;

  tokenAnalysisInfo: TokenAnalysisInfo;
}

export class TokenAnalysisInfo {
  // type of time to analyze
  type_time: TypeTime = TypeTime._24h;
  title: string = "Token Analytics";
  typeCategory: TypeChain = new TypeChainAll(
    ["solana", "ethereum", "arbitrum", "avalanche", "bsc", "optimism", "polygon", "base", "zksync", "sui"],
  );
}

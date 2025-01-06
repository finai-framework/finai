import axios, {AxiosResponse} from 'axios';
import {Readable} from 'stream';
import {ChatGptParam} from '../../models';

export const chatCompleteApiV2 = async (streamGPT: Readable, data: ChatGptParam) => {
  const url = 'https://api.openai.com/v1/chat/completions';
  const apiKey: string = process.env.KEY_OPENAI || "";

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
  console.log({
    model: "gpt-3.5-turbo",
    max_tokens: 600,
    ...data,
    stream: true, // stream always is true.
  });
  try {
    const response: AxiosResponse<Readable> = await axios.post(url, {
      model: "gpt-3.5-turbo",
      max_tokens: 600,
      stream: true, ...data,
    }, {
      headers,
      responseType: 'stream'
    });

    response.data.on('data', handleData);
    response.data.on('end', () => {
      streamGPT.push(null);
      streamGPT.destroy();
      console.log("end");
    });
  } catch (error) {
    console.error(error);
  }

  function handleData(chunk: Buffer) {
    const dataString = chunk.toString();
    streamGPT.push(dataString);
  }
};


export const chatResponseApi = async (data: ChatGptParam): Promise<JSON> => {
  const url = 'https://api.openai.com/v1/chat/completions';
  const apiKey: string = process.env.KEY_OPENAI || "";

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  /// edit
  if (data.messages.length >= 8) {
    data.messages = [data.messages[0], ...data.messages.slice(data.messages.length - 7, data.messages.length)]
  }
  ///end edit

  console.log({
    model: "gpt-3.5-turbo",
    max_tokens: 600,
    ...data,
    stream: false // stream always is false.
  });
  try {
    console.log("start")
    const response: AxiosResponse<JSON> = await axios.post(url, {
      model: "gpt-3.5-turbo",
      max_tokens: 600,
      ...data,
      stream: false,
    }, {
      headers,
      responseType: 'json'
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return JSON.parse("{}");
  }
}


import {Model, model, property} from '@loopback/repository';
import {MessGpt} from './mess-gpt.model';

@model()
export class ChatGptParam extends Model {
  @property({
    type: 'string',
    default: "gpt-3.5-turbo",
  })
  model?: string;

  @property({
    type: 'string',
  })
  frequency_penalty?: string;

  @property({
    type: 'number',
  })
  max_tokens?: number;

  @property({
    type: 'array',
    itemType: MessGpt,
    required: true
  })
  messages: MessGpt[];

  @property({
    type: 'number',
  })
  n?: number;

  @property({
    type: 'number',
  })
  presence_penalty?: number;

  @property({
    type: 'object',
    default: null,
  })
  logit_bias?: object;

  @property({
    type: 'object',
    default: null,
  })
  response_format?: object;

  @property({
    type: 'array',
    itemType: 'string',
  })
  stop?: string[];

  @property({
    type: 'boolean',
  })
  stream?: boolean;

  @property({
    type: 'number',
  })
  temperature?: number;

  @property({
    type: 'number',
  })
  top_p?: number;


  constructor(data?: Partial<ChatGptParam>) {
    super(data);
  }
}

export interface ChatGgtParamRelations {
  // describe navigational properties here
}

export type ChatGgtParamWithRelations = ChatGptParam & ChatGgtParamRelations;

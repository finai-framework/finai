import {Entity, model, property} from '@loopback/repository';

@model()
export class Message extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  sender_id: string;

  @property({
    type: 'string',
    required: true,
  })
  group_id: string;

  @property({
    type: 'string',
    required: true,
  })
  text: string;

  @property({
    type: 'date',
    required: false,
  })
  create_at?: Date;

  @property({
    type: 'string',
    required: true,
  })
  username: string;


  constructor(data?: Partial<Message>) {
    super(data);
    if (data?.create_at == null) {
      this.create_at = new Date();
    }
  }
}

export interface MessageRelations {
  // describe navigational properties here
}

export type MessageWithRelations = Message & MessageRelations;

import {Entity, model, property} from '@loopback/repository';

@model()
export class ContentTelegram extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: false,
  })
  content?: string;

  @property({
    type: 'string',
    required: false,
  })
  id_group?: string;

  @property({
    type: 'date',
    required: false,
  })
  create_at?: Date;


  constructor(data?: Partial<ContentTelegram>) {
    super(data);
    if (data?.create_at == null) {
      this.create_at = new Date();
    }
  }
}

export interface ContentTelegramRelations {
  // describe navigational properties here
}

export type ContentTelegramWithRelations = ContentTelegram & ContentTelegramRelations;

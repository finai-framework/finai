import {Model, model, property} from '@loopback/repository';

@model()
export class MessGpt extends Model {
  @property({
    type: 'string',
  })
  role?: string;

  @property({
    type: 'string',
  })
  content?: string;


  constructor(data?: Partial<MessGpt>) {
    super(data);
  }
}

export interface MessGptRelations {
  // describe navigational properties here
}

export type MessGptWithRelations = MessGpt & MessGptRelations;

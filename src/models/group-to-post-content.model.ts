import {Entity, model, property} from '@loopback/repository';

@model()
export class GroupToPostContent extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  group_id?: string;


  constructor(data?: Partial<GroupToPostContent>) {
    super(data);
  }
}

export interface GroupToPostContentRelations {
  // describe navigational properties here
}

export type GroupToPostContentWithRelations = GroupToPostContent & GroupToPostContentRelations;

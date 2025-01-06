import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {TelegramHistoryMessageDataSource} from '../datasources';
import {GroupToPostContent, GroupToPostContentRelations} from '../models';

export class GroupToPostContentRepository extends DefaultCrudRepository<
  GroupToPostContent,
  typeof GroupToPostContent.prototype.id,
  GroupToPostContentRelations
> {
  constructor(
    @inject('datasources.telegram_history_message') dataSource: TelegramHistoryMessageDataSource,
  ) {
    super(GroupToPostContent, dataSource);
  }
}

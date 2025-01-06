import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {TelegramHistoryMessageDataSource} from '../datasources';
import {Message, MessageRelations} from '../models';

export class MessageRepository extends DefaultCrudRepository<
  Message,
  typeof Message.prototype.id,
  MessageRelations
> {
  constructor(
    @inject('datasources.telegram_history_message') dataSource: TelegramHistoryMessageDataSource,
  ) {
    super(Message, dataSource);
  }
}

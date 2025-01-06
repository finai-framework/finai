import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {TelegramHistoryMessageDataSource} from '../datasources';
import {ContentTelegram, ContentTelegramRelations} from '../models';

export class ContentTelegramRepository extends DefaultCrudRepository<
  ContentTelegram,
  typeof ContentTelegram.prototype.id,
  ContentTelegramRelations
> {
  constructor(
    @inject('datasources.telegram_history_message') dataSource: TelegramHistoryMessageDataSource,
  ) {
    super(ContentTelegram, dataSource);
  }
}

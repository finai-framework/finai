import { DefaultCrudRepository } from '@loopback/repository';
import { TelegramHistoryMessageDataSource } from '../datasources';
import { ContentTelegram, ContentTelegramRelations } from '../models';
export declare class ContentTelegramRepository extends DefaultCrudRepository<ContentTelegram, typeof ContentTelegram.prototype.id, ContentTelegramRelations> {
    constructor(dataSource: TelegramHistoryMessageDataSource);
}

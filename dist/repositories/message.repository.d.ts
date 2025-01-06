import { DefaultCrudRepository } from '@loopback/repository';
import { TelegramHistoryMessageDataSource } from '../datasources';
import { Message, MessageRelations } from '../models';
export declare class MessageRepository extends DefaultCrudRepository<Message, typeof Message.prototype.id, MessageRelations> {
    constructor(dataSource: TelegramHistoryMessageDataSource);
}

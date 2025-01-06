import { DefaultCrudRepository } from '@loopback/repository';
import { TelegramHistoryMessageDataSource } from '../datasources';
import { GroupToPostContent, GroupToPostContentRelations } from '../models';
export declare class GroupToPostContentRepository extends DefaultCrudRepository<GroupToPostContent, typeof GroupToPostContent.prototype.id, GroupToPostContentRelations> {
    constructor(dataSource: TelegramHistoryMessageDataSource);
}

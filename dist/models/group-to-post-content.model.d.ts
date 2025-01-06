import { Entity } from '@loopback/repository';
export declare class GroupToPostContent extends Entity {
    id?: string;
    group_id?: string;
    constructor(data?: Partial<GroupToPostContent>);
}
export interface GroupToPostContentRelations {
}
export type GroupToPostContentWithRelations = GroupToPostContent & GroupToPostContentRelations;

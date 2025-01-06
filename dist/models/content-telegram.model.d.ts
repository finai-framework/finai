import { Entity } from '@loopback/repository';
export declare class ContentTelegram extends Entity {
    id?: string;
    content?: string;
    id_group?: string;
    create_at?: Date;
    constructor(data?: Partial<ContentTelegram>);
}
export interface ContentTelegramRelations {
}
export type ContentTelegramWithRelations = ContentTelegram & ContentTelegramRelations;

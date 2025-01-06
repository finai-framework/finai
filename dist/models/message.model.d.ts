import { Entity } from '@loopback/repository';
export declare class Message extends Entity {
    id?: string;
    sender_id: string;
    group_id: string;
    text: string;
    create_at?: Date;
    username: string;
    constructor(data?: Partial<Message>);
}
export interface MessageRelations {
}
export type MessageWithRelations = Message & MessageRelations;

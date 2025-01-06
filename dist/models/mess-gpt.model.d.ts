import { Model } from '@loopback/repository';
export declare class MessGpt extends Model {
    role?: string;
    content?: string;
    constructor(data?: Partial<MessGpt>);
}
export interface MessGptRelations {
}
export type MessGptWithRelations = MessGpt & MessGptRelations;

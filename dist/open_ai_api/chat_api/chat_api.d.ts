import { Readable } from 'stream';
import { ChatGptParam } from '../../models';
export declare const chatCompleteApiV2: (streamGPT: Readable, data: ChatGptParam) => Promise<void>;
export declare const chatResponseApi: (data: ChatGptParam) => Promise<JSON>;

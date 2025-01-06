"use strict";
// Uncomment these imports to begin using these cool features!
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const tslib_1 = require("tslib");
const rest_1 = require("@loopback/rest");
const stream_1 = require("stream");
const models_1 = require("../models");
const chat_api_1 = require("../open_ai_api/chat_api/chat_api");
class ChatController {
    constructor() { }
    async completionsChat(chatGptParam) {
        const stream = new stream_1.Readable({
            read() { }
        });
        (0, chat_api_1.chatCompleteApiV2)(stream, chatGptParam);
        return stream;
    }
    async responseChat(chatGptParam) {
        let a = await (0, chat_api_1.chatResponseApi)(chatGptParam);
        return a;
    }
}
exports.ChatController = ChatController;
tslib_1.__decorate([
    (0, rest_1.post)('/chat/completions'),
    (0, rest_1.response)(200, {
        description: 'Chat',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.ChatGptParam, { includeRelations: true }), } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ChatGptParam, {
                    title: 'NewChatGptParam',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.ChatGptParam]),
    tslib_1.__metadata("design:returntype", Promise)
], ChatController.prototype, "completionsChat", null);
tslib_1.__decorate([
    (0, rest_1.post)('/chat/response'),
    (0, rest_1.response)(200, {
        description: 'Chat',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.ChatGptParam, { includeRelations: true }), } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ChatGptParam, {
                    title: 'NewChatGptParam',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.ChatGptParam]),
    tslib_1.__metadata("design:returntype", Promise)
], ChatController.prototype, "responseChat", null);
//# sourceMappingURL=chat.controller.js.map
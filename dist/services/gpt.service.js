"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GptService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const chat_api_1 = require("../open_ai_api/chat_api/chat_api");
let GptService = class GptService {
    constructor( /* Add @inject to inject parameters */) { }
    async responseChat(chatGptParam) {
        let a = await (0, chat_api_1.chatResponseApi)(chatGptParam);
        return a;
    }
};
exports.GptService = GptService;
exports.GptService = GptService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__metadata("design:paramtypes", [])
], GptService);
//# sourceMappingURL=gpt.service.js.map
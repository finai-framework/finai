"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGptParam = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const mess_gpt_model_1 = require("./mess-gpt.model");
let ChatGptParam = class ChatGptParam extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
exports.ChatGptParam = ChatGptParam;
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: "gpt-3.5-turbo",
    }),
    tslib_1.__metadata("design:type", String)
], ChatGptParam.prototype, "model", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ChatGptParam.prototype, "frequency_penalty", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], ChatGptParam.prototype, "max_tokens", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'array',
        itemType: mess_gpt_model_1.MessGpt,
        required: true
    }),
    tslib_1.__metadata("design:type", Array)
], ChatGptParam.prototype, "messages", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], ChatGptParam.prototype, "n", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], ChatGptParam.prototype, "presence_penalty", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'object',
        default: null,
    }),
    tslib_1.__metadata("design:type", Object)
], ChatGptParam.prototype, "logit_bias", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'object',
        default: null,
    }),
    tslib_1.__metadata("design:type", Object)
], ChatGptParam.prototype, "response_format", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'array',
        itemType: 'string',
    }),
    tslib_1.__metadata("design:type", Array)
], ChatGptParam.prototype, "stop", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'boolean',
    }),
    tslib_1.__metadata("design:type", Boolean)
], ChatGptParam.prototype, "stream", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], ChatGptParam.prototype, "temperature", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], ChatGptParam.prototype, "top_p", void 0);
exports.ChatGptParam = ChatGptParam = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], ChatGptParam);
//# sourceMappingURL=chat-gpt-param.model.js.map
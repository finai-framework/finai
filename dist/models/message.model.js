"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let Message = class Message extends repository_1.Entity {
    constructor(data) {
        super(data);
        if ((data === null || data === void 0 ? void 0 : data.create_at) == null) {
            this.create_at = new Date();
        }
    }
};
exports.Message = Message;
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        id: true,
        generated: true,
    }),
    tslib_1.__metadata("design:type", String)
], Message.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Message.prototype, "sender_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Message.prototype, "group_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Message.prototype, "text", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        required: false,
    }),
    tslib_1.__metadata("design:type", Date)
], Message.prototype, "create_at", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Message.prototype, "username", void 0);
exports.Message = Message = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Message);
//# sourceMappingURL=message.model.js.map
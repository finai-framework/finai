"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentTelegram = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let ContentTelegram = class ContentTelegram extends repository_1.Entity {
    constructor(data) {
        super(data);
        if ((data === null || data === void 0 ? void 0 : data.create_at) == null) {
            this.create_at = new Date();
        }
    }
};
exports.ContentTelegram = ContentTelegram;
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        id: true,
        generated: true,
    }),
    tslib_1.__metadata("design:type", String)
], ContentTelegram.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: false,
    }),
    tslib_1.__metadata("design:type", String)
], ContentTelegram.prototype, "content", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: false,
    }),
    tslib_1.__metadata("design:type", String)
], ContentTelegram.prototype, "id_group", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        required: false,
    }),
    tslib_1.__metadata("design:type", Date)
], ContentTelegram.prototype, "create_at", void 0);
exports.ContentTelegram = ContentTelegram = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], ContentTelegram);
//# sourceMappingURL=content-telegram.model.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessGpt = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let MessGpt = class MessGpt extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
exports.MessGpt = MessGpt;
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], MessGpt.prototype, "role", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], MessGpt.prototype, "content", void 0);
exports.MessGpt = MessGpt = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], MessGpt);
//# sourceMappingURL=mess-gpt.model.js.map
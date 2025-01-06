"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupToPostContent = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let GroupToPostContent = class GroupToPostContent extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
exports.GroupToPostContent = GroupToPostContent;
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        id: true,
        generated: true,
    }),
    tslib_1.__metadata("design:type", String)
], GroupToPostContent.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], GroupToPostContent.prototype, "group_id", void 0);
exports.GroupToPostContent = GroupToPostContent = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], GroupToPostContent);
//# sourceMappingURL=group-to-post-content.model.js.map
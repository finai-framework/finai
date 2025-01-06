"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupToPostContentRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let GroupToPostContentRepository = class GroupToPostContentRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource) {
        super(models_1.GroupToPostContent, dataSource);
    }
};
exports.GroupToPostContentRepository = GroupToPostContentRepository;
exports.GroupToPostContentRepository = GroupToPostContentRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.telegram_history_message')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.TelegramHistoryMessageDataSource])
], GroupToPostContentRepository);
//# sourceMappingURL=group-to-post-content.repository.js.map
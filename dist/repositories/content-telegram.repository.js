"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentTelegramRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let ContentTelegramRepository = class ContentTelegramRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource) {
        super(models_1.ContentTelegram, dataSource);
    }
};
exports.ContentTelegramRepository = ContentTelegramRepository;
exports.ContentTelegramRepository = ContentTelegramRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.telegram_history_message')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.TelegramHistoryMessageDataSource])
], ContentTelegramRepository);
//# sourceMappingURL=content-telegram.repository.js.map
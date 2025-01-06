"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramHistoryMessageDataSource = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const config = {
    name: 'telegram_history_message',
    connector: 'mongodb',
    url: '',
    host: 'localhost',
    port: 27017,
    user: '',
    password: '',
    database: 'telegram_history_message',
    useNewUrlParser: true
};
// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
let TelegramHistoryMessageDataSource = class TelegramHistoryMessageDataSource extends repository_1.juggler.DataSource {
    constructor(dsConfig = config) {
        super(dsConfig);
    }
};
exports.TelegramHistoryMessageDataSource = TelegramHistoryMessageDataSource;
TelegramHistoryMessageDataSource.dataSourceName = 'telegram_history_message';
TelegramHistoryMessageDataSource.defaultConfig = config;
exports.TelegramHistoryMessageDataSource = TelegramHistoryMessageDataSource = tslib_1.__decorate([
    (0, core_1.lifeCycleObserver)('datasource'),
    tslib_1.__param(0, (0, core_1.inject)('datasources.config.telegram_history_message', { optional: true })),
    tslib_1.__metadata("design:paramtypes", [Object])
], TelegramHistoryMessageDataSource);
//# sourceMappingURL=telegram-history-message.datasource.js.map
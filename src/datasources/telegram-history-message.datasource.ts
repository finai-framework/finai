import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

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
@lifeCycleObserver('datasource')
export class TelegramHistoryMessageDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'telegram_history_message';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.telegram_history_message', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

import { environments, log, variables } from '@config'
import { logging } from '@messages'
import { Injectable, LoggerService } from '@nestjs/common'
import { getEnvironmentVariable } from '@utils/platform.util'
import _ from 'lodash'
import winston, { format, Logger, transport } from 'winston'
import winstonTimestampColorize from 'winston-timestamp-colorize'
import winstonCloudWatchTransport from 'winston-cloudwatch'

/*
Custom logger
Dual trasports => 1: File 2: Console
Multiple logging levels
*/
@Injectable()
export class appLogger implements LoggerService {
  private static logger: Logger

  private base_transports: transport[] = [
    new winston.transports.Console({
      level: _.eq(getEnvironmentVariable(variables.app_ENV.name), environments.production)
        ? log.levels.error.value
        : getEnvironmentVariable(variables.LOG_LEVEL.name),
      format: format.combine(
        format.timestamp(),
        format.colorize({ all: true }),
        format.simple(),
        winstonTimestampColorize({ color: 'green' }),
        format.printf((msg) => `${msg.level}: ${msg.message} - ${msg.timestamp}`),
      ),
    }),
    new winston.transports.File({
      filename: log.filename,
      level: log.levels.debug.value,
      format: format.combine(
        format.timestamp(),
        format.simple(),
        format.printf((msg) => `${msg.level}: ${msg.message} - ${msg.timestamp}`),
      ),
    }),
  ]

  private readonly options: winston.LoggerOptions = {
    levels: _.map(log.levels, (level) => {
      return { [level.value]: level.priority }
    }).reduce((levels: { [key: string]: number }, level: { [key: string]: number }) => Object.assign(levels, level), {}),
    transports: this.base_transports,
  }

  constructor() {
    if (_.isNil(appLogger.logger)) {
      winston.format.colorize().addColors(log.colors)
      if (_.includes([environments.development, environments.qa], getEnvironmentVariable(variables.app_ENV.name))) {
        this.base_transports.push(
          new winstonCloudWatchTransport({
            logGroupName: `rest-server/${getEnvironmentVariable(variables.app_ENV.name)}`,
            awsRegion: getEnvironmentVariable(variables.AWS_REGION.name),
            jsonMessage: true,
          }),
        )
      }
      appLogger.logger = winston.createLogger(this.options)
      if (!_.eq(getEnvironmentVariable(variables.app_ENV.name), environments.production)) {
        this.log(`${logging.initialised(getEnvironmentVariable(variables.LOG_LEVEL.name))}`)
      }
    }
  }

  log(message: string): void {
    if (!_.isNil(appLogger.logger)) {
      appLogger.logger.info(message)
    }
  }

  error(message: string): void {
    if (!_.isNil(appLogger.logger)) {
      appLogger.logger.error(message)
    }
  }

  warn(message: string): void {
    if (!_.isNil(appLogger.logger)) {
      appLogger.logger.warning(message)
    }
  }

  debug(message: string): void {
    if (!_.isNil(appLogger.logger)) {
      appLogger.logger.debug(message)
    }
  }

  emergency(message: string): void {
    if (!_.isNil(appLogger.logger)) {
      appLogger.logger.emerg(message)
    }
  }

  alert(message: string): void {
    if (!_.isNil(appLogger.logger)) {
      appLogger.logger.alert(message)
    }
  }

  critical(message: string): void {
    if (!_.isNil(appLogger.logger)) {
      appLogger.logger.crit(message)
    }
  }

  notice(message: string): void {
    if (!_.isNil(appLogger.logger)) {
      appLogger.logger.notice(message)
    }
  }
}

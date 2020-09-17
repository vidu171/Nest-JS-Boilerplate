import { variables, cache_client } from '@config'
import { caching } from '@messages'
import { appLogger } from '@services/logger.service'
import _ from 'lodash'
import redis, { RedisClient } from 'redis'
import { getEnvironmentVariable } from '@utils/platform.util'

export class RedisHandler {
  private static instances: { [key: string]: RedisHandler }[] = []

  private static _redisClients: { [key: string]: RedisClient }[] = []

  private logger = new appLogger()

  private constructor(client_config: cache_client = cache_client.DEFAULT) {
    if (_.isNil(RedisHandler._redisClients[client_config])) {
      const dynamic_config = this.switchConfiguration(client_config)
      const redis_options = {
        enable_offline_queue: true,
        host: dynamic_config.host,
        port: dynamic_config.port,
      }
      if (!_.eq(dynamic_config.password, 'no_password')) {
        _.set(redis_options, 'password', dynamic_config.password)
      }
      RedisHandler._redisClients[client_config] = redis.createClient(redis_options)
      RedisHandler._redisClients[client_config]
        .on('error', (error: any) => {
          this.logger.error(caching.error(error))
          process.exit()
        })
        .on('connect', () => {
          this.logger.log(
            caching.success(getEnvironmentVariable(variables.REDIS_PORT.name), getEnvironmentVariable(variables.REDIS_URL.name), client_config),
          )
        })
    }
  }

  static getInstance(client_config: cache_client = cache_client.DEFAULT): RedisClient {
    if (!_.isNil(RedisHandler.instances)) {
      const current_client = RedisHandler._redisClients[client_config]
      if (_.isNil(current_client)) {
        RedisHandler.instances[client_config] = new RedisHandler(client_config)
      }
    }
    return RedisHandler._redisClients[client_config]
  }

  getInstance(client_config: cache_client = cache_client.DEFAULT): RedisClient {
    if (!_.isNil(RedisHandler.instances)) {
      const current_client = RedisHandler._redisClients[client_config]
      if (_.isNil(current_client)) {
        RedisHandler.instances[client_config] = new RedisHandler(client_config)
      }
    }
    return RedisHandler._redisClients[client_config]
  }

  private switchConfiguration(client_config: cache_client = cache_client.DEFAULT) {
    let host: string
    let port: number
    let password: string
    switch (client_config) {
      case cache_client.DEFAULT:
        host = getEnvironmentVariable(variables.REDIS_URL.name)
        port = parseInt(getEnvironmentVariable(variables.REDIS_PORT.name), 10)
        password = getEnvironmentVariable(variables.REDIS_PASSWORD.name)
        break
      case cache_client.PUB_SUB:
        host = getEnvironmentVariable(variables.REDIS_PUB_SUB_URL.name)
        port = parseInt(getEnvironmentVariable(variables.REDIS_PUB_SUB_PORT.name), 10)
        password = getEnvironmentVariable(variables.REDIS_PUB_SUB_PASSWORD.name)
        break
    }
    return { host, port, password }
  }

  setKey(key: string, value: string, client_config: cache_client = cache_client.DEFAULT, time?: number) {
    return new Promise<boolean>((resolve: (value?: boolean | PromiseLike<boolean>) => void, reject: (reason?: any) => void) => {
      if (!_.isNil(RedisHandler._redisClients[client_config]) && RedisHandler._redisClients[client_config].connected) {
        RedisHandler._redisClients[client_config].set(key, value)
        if (!_.isNil(time)) {
          RedisHandler._redisClients[client_config].expire(key, time)
        }
        resolve(true)
      } else {
        resolve(false)
      }
    })
  }

  getKey(key: string, client_config: cache_client = cache_client.DEFAULT) {
    return new Promise<string>((resolve: (value?: string | PromiseLike<string>) => void, reject: (reason?: any) => void) => {
      if (!_.isNil(RedisHandler._redisClients[client_config]) && RedisHandler._redisClients[client_config].connected) {
        RedisHandler._redisClients[client_config].get(key, (error: Error | null, data: string) => {
          if (!_.isNil(error) && !_.isNil(data)) {
            resolve(data)
          }
          resolve(null)
        })
      } else {
        resolve(null)
      }
    })
  }
}

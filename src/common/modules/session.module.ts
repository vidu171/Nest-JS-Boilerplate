import ConnectRedis from 'connect-redis'
import session from 'express-session'
import { SessionModule as SessionHandlerModule, NestSessionOptions } from 'nestjs-session'
import { RedisHandler } from '@utils/redis.util'
import { getEnvironmentVariable } from '@utils/platform.util'
import { variables, cache_client, environments } from '@config'
import _ from 'lodash'

const RedisStore = ConnectRedis(session)

export const SessionModule = SessionHandlerModule.forRootAsync({
  useFactory: (): NestSessionOptions => {
    return {
      session: {
        store: new RedisStore({ client: RedisHandler.getInstance(cache_client.DEFAULT) }),
        secret: getEnvironmentVariable(variables.SESSION_SECRET.name),
        resave: true,
        saveUninitialized: true,
        cookie: {
          sameSite: 'none',
          secure: !_.eq(getEnvironmentVariable(variables.app_ENV.name), environments.local),
          maxAge: 86400000,
        },
      },
    }
  },
})

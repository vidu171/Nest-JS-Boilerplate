import { RateLimiterModule as RateLimitHandlerModule, RateLimiterModuleOptions } from 'nestjs-rate-limiter'
import { RedisHandler } from '@utils/redis.util'
import _ from 'lodash'

export const RateLimiterModule = RateLimitHandlerModule.registerAsync({
  useFactory: async (): Promise<RateLimiterModuleOptions> => {
    const redisClient = RedisHandler.getInstance()
    return {
      points: 100,
      type: 'Redis',
      storeClient: redisClient,
    }
  },
})

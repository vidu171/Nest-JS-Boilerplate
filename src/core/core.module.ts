import { Module, NestModule, MiddlewareConsumer, ValidationPipe } from '@nestjs/common'
import { TraceMiddleware } from '@middlewares/trace.middleware'
import { APP_INTERCEPTOR, APP_PIPE, APP_FILTER } from '@nestjs/core'
import { TimingMiddleware } from '@middlewares/timing.middleware'
import { RateLimiterModule } from '@modules/rate-limiter.module'
import { SessionModule } from '@modules/session.module'
import { RateLimiterInterceptor } from 'nestjs-fastify-rate-limiter'
import { SystemModule } from '@app/system/system.module'
import { UserModule } from '@app/user/user.module'
import { MongooseHandlerModule } from '@modules/mongoose.module'
import { ExceptionsFilter } from '@filters/exceptions.filter'
import { appLogger } from '@services/logger.service'

@Module({
  imports: [RateLimiterModule, SessionModule, MongooseHandlerModule, TimingMiddleware.forRoot({}), SystemModule, SystemModule, UserModule],
  providers: [
    appLogger,
    // { provide: APP_INTERCEPTOR, useClass: APIInterceptor },
    { provide: APP_PIPE, useClass: ValidationPipe },
    // { provide: APP_GUARD, useClass: SessionEnhancerGuard },
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: RateLimiterInterceptor },
  ],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TraceMiddleware).forRoutes('*')
  }
}

import { BasicAuthenticationMiddleware } from '@middlewares/basic.auth.middleware'
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { SystemController } from './system.controller'
import { SystemService } from './system.service'

@Module({
  controllers: [SystemController],
  providers: [SystemService],
})
export class SystemModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(BasicAuthenticationMiddleware()).forRoutes('routes')
  }
}

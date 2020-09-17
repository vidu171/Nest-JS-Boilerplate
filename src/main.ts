import { NestFactory } from '@nestjs/core'
import { CoreModule } from '@core/core.module'
import { consortium } from '@messages'
import { appLogger } from '@services/logger.service'
import { getEnvironmentVariable } from '@utils/platform.util'
import { NestExpressApplication } from '@nestjs/platform-express'
import _ from 'lodash'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { variables } from '@config'


const bootstrap = () => {
  dotenv.config()
  const logger = new appLogger()
  return new Promise<boolean>((resolve: (value?: boolean | PromiseLike<boolean>) => void, reject: (reason?: unknown) => void) => {
    const port: number = _.toNumber(getEnvironmentVariable(variables.PORT.name))
    const address: string = getEnvironmentVariable(variables.ADDRESS.name)
    NestFactory.create<NestExpressApplication>(
      CoreModule,
    ).then((app: NestExpressApplication) => {
      app.set('trust proxy', 1)
      app.use(cookieParser())
      app.enableCors({
        origin: '*',
        credentials: true
      })
      app.setGlobalPrefix(getEnvironmentVariable(variables.API_PREFIX.name))
      app.useLogger(logger)
      app.listen(port, address).then(() => {
        app.getUrl().then((url: string) => {
          logger.log(`${consortium.initialised(url, port)}`)
          resolve(true)
        }).catch((error: Error) => {
          logger.emergency(error.message)
          reject()
          process.exit(0)
        })
      })
    }).catch((error: Error) => {
      logger.emergency(error.message)
      reject()
      process.exit(0)
    })
  })
}

bootstrap()

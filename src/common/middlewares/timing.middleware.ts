import { createModule } from 'create-nestjs-middleware-module'
import { Request, Response, NextFunction } from 'express'
import { appLogger } from '@services/logger.service'
import _ from 'lodash'

export const TimingMiddleware = createModule((options = {}) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const now = Date.now()
    const logger = new appLogger()
    logger.log(
      `Request init: path => ${request.app_CONTEXT.url}, method => ${request.app_CONTEXT.method}, trace id => ${
        request.app_CONTEXT.traceID
      }, ip => ${request.app_CONTEXT.ip}, browser => ${request.app_CONTEXT.specs.browser}, version => ${
        request.app_CONTEXT.specs.version
      }, session id => ${!_.isNil(request.sessionID) ? request.sessionID : 'N/A'}`,
    )
    response.on('finish', () => {
      logger.log(
        `Request finished: path => ${request.app_CONTEXT.url}, method => ${request.app_CONTEXT.method}, elapsed time => ${Date.now() -
          now}ms, trace id => ${request.app_CONTEXT.traceID}, ip => ${request.app_CONTEXT.ip}, browser => ${
          request.app_CONTEXT.specs.browser
        }, version => ${request.app_CONTEXT.specs.version}, session id => ${!_.isNil(request.sessionID) ? request.sessionID : 'N/A'}`,
      )
    })
    next()
  }
})

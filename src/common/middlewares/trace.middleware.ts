import { APIResponse } from '@interfaces/response'
import { appContext } from '@interfaces/trace'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { createappContext } from '@utils/platform.util'
import { Response, Request } from 'express'

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  use(request: Request, response: Response<APIResponse>, next: () => void): void {
    request.app_CONTEXT = <appContext>createappContext(request)
    next()
  }
}

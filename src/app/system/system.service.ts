import _ from 'lodash'
import { Injectable, Scope, Inject, HttpStatus } from '@nestjs/common'
import listEndpoints from 'express-list-endpoints'
import { Request } from 'express'
import { ServiceResponse } from '@interfaces/response'
import { getAPIResponse } from '@utils/platform.util'
import { REQUEST } from '@nestjs/core'
import { messages } from '@messages'

@Injectable({ scope: Scope.REQUEST })
export class SystemService {
  private traceID: string

  constructor(@Inject(REQUEST) private request: Request) {
    this.traceID = request.app_CONTEXT.traceID
  }

  getEndpoints = () => {
    return new Promise<ServiceResponse>(
      (resolve: (value?: ServiceResponse | PromiseLike<ServiceResponse>) => void, reject: (reason?: unknown) => void) => {
        resolve(<ServiceResponse>getAPIResponse(messages.SYS001.code, this.traceID, HttpStatus.OK, listEndpoints(this.request.app as any)))
      },
    )
  }
}

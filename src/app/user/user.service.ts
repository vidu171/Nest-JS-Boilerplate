import { Injectable, Scope, Inject, HttpStatus } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ServiceResponse } from '@interfaces/response'
import { getAPIResponse, getTokenSignOptions, switchUserAudience } from '@utils/platform.util'
import { messages } from '@messages'
import { Request } from 'express'
import _ from 'lodash'
import { RedisHandler } from '@utils/redis.util'
import { redisKeys, audience } from '@config'
import { findOperations } from '@utils/crud.util'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import AuthHandler from '@utils/auth.util'
import { User } from './user.schema'
import { AuthenticateUserDTO } from './dto/authenticate-user.dto'

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  private traceID: string

  constructor(@Inject(REQUEST) private request: Request, @InjectModel(User.name) private userModel: Model<User>) {
    this.traceID = request.app_CONTEXT.traceID
  }

  findOne = (userID: string) =>
    new Promise<ServiceResponse>((resolve: (value?: ServiceResponse | PromiseLike<ServiceResponse>) => void, reject: (reason?: unknown) => void) => {
        resolve(<ServiceResponse>getAPIResponse(messages.COM002.code, this.traceID, HttpStatus.FORBIDDEN))
    })

  authenticate = (user: AuthenticateUserDTO) =>
    new Promise<ServiceResponse>((resolve: (value?: ServiceResponse | PromiseLike<ServiceResponse>) => void, reject: (reason?: unknown) => void) => {
        resolve(<ServiceResponse>getAPIResponse(messages.COM001.code, this.traceID, HttpStatus.INTERNAL_SERVER_ERROR))
    })
}

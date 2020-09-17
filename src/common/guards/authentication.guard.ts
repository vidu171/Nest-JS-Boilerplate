import { CanActivate, ExecutionContext, Injectable, HttpStatus } from '@nestjs/common'
import _ from 'lodash'
import parse from 'parse-bearer-token'
import { Observable } from 'rxjs'
import { Request } from 'express'
import jwt, { VerifyErrors, JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken'
import { getEnvironmentVariable, getAPIResponse } from '@utils/platform.util'
import { variables, audience } from '@config'
import { messages } from '@messages'
import { JWTException } from '@exceptions/jwt.exception'
import { Reflector } from '@nestjs/core'
import { User } from '@app/user/user.schema'

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = <Request>context.switchToHttp().getRequest()
    const jwt_token = parse(request)
    const audience = this.reflector.get<audience[]>('audience', context.getHandler())
    if (!_.isNil(audience) && !_.isEmpty(audience)) {
      if (!_.isNil(jwt_token)) {
        if (!request.session.verified || !request.session.expTime || request.session.expTime - Date.now() / 1000 < 0) {
          jwt.verify(
            jwt_token,
            getEnvironmentVariable(variables.JWT_PRIVATE_SECRET.name),
            { audience, issuer: getEnvironmentVariable(variables.JWT_ISSUER.name) },
            (error: VerifyErrors, user: Record<any, any>) => {
              if (!_.isNil(error)) {
                request.session.verified = false
                if (_.eq(error.name, JsonWebTokenError.name)) {
                  throw new JWTException(
                    getAPIResponse(messages.JWT001.code, request.app_CONTEXT.traceID, HttpStatus.UNAUTHORIZED, { error: JsonWebTokenError.name }),
                  )
                } else if (_.eq(error.name, NotBeforeError.name)) {
                  throw new JWTException(
                    getAPIResponse(messages.JWT002.code, request.app_CONTEXT.traceID, HttpStatus.FORBIDDEN, { error: NotBeforeError.name }),
                  )
                } else if (_.eq(error.name, TokenExpiredError.name)) {
                  throw new JWTException(
                    getAPIResponse(messages.JWT003.code, request.app_CONTEXT.traceID, HttpStatus.UNAUTHORIZED, { error: TokenExpiredError.name }),
                  )
                } else {
                  throw new JWTException(getAPIResponse(messages.COM001.code, request.app_CONTEXT.traceID, HttpStatus.FORBIDDEN))
                }
              }
              request.user = user as User
            },
          )
          request.session.verified = true
          return true
        }
        return true
      }
      throw new JWTException(getAPIResponse(messages.JWT004.code, request.app_CONTEXT.traceID, HttpStatus.UNAUTHORIZED))
    } else {
      throw new JWTException(getAPIResponse(messages.COM001.code, request.app_CONTEXT.traceID, HttpStatus.INTERNAL_SERVER_ERROR))
    }
  }
}

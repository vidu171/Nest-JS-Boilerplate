import { ServiceResponse } from '@interfaces/response'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { messages } from '@messages'
import _ from 'lodash'
import { Request, Response } from 'express'
import { createappContext } from '@utils/platform.util'
import { appLogger } from '@services/logger.service'
import { SessionException } from '@exceptions/session.exception'

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    private logger = new appLogger()

    catch(exception: any, host: ArgumentsHost) {
        const now = Date.now()
        const ctx = host.switchToHttp()
        const response = <Response>ctx.getResponse()
        const request = <Request>ctx.getRequest()
        if (_.isNil(request.app_CONTEXT)) {
            request.app_CONTEXT = createappContext(request)
        }
        const status = exception instanceof HttpException
            ? exception.getStatus()
            : exception instanceof SessionException ? 408 : HttpStatus.INTERNAL_SERVER_ERROR
        const payload = this.switchResponseStatus(status)
        response
            .status(status)
            .send(<ServiceResponse>{
                traceID: request.app_CONTEXT.traceID,
                code: _.isNil(exception.response.code) ? payload.code : exception.response.code,
                message: _.isNil(exception.response.message) ? payload.message : exception.response.message,
                data: _.isNil(exception.response.data) ? {} : exception.response.data,
                status: _.isNil(exception.response.status) ? status : exception.response.status
            })
        this.logger.log(`Request finished: path => ${request.app_CONTEXT.url}, method => ${request.app_CONTEXT.method}, elapsed time => ${Date.now() - now}ms, trace id => ${request.app_CONTEXT.traceID}, ip => ${request.app_CONTEXT.ip}, browser => ${request.app_CONTEXT.specs.browser}, version => ${request.app_CONTEXT.specs.version}, session id => ${!_.isNil(request.sessionID) ? request.sessionID : 'N/A'}`)
    }

    private switchResponseStatus = (status: number) => {
        const payload = <{ message: string, code: string }>{
            message: messages.COM001.message,
            code: messages.COM001.code
        }
        switch (status) {
            case HttpStatus.FORBIDDEN:
                payload.message = messages.COM002.message
                payload.code = messages.COM002.code
                break
            case 408:
                payload.message = messages.COM005.message
                payload.code = messages.COM005.code
                break
            case HttpStatus.TOO_MANY_REQUESTS:
                payload.message = messages.COM006.message
                payload.code = messages.COM006.code
                break
            case HttpStatus.NOT_FOUND:
                payload.message = messages.COM007.message
                payload.code = messages.COM007.code
                break
        }
        return payload
    }
}
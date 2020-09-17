import { messages } from '@messages'
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, Inject, HttpStatus, Scope, mixin, Type } from '@nestjs/common'
import { getAPIResponse } from '@utils/platform.util'
import { APIResponse } from '@interfaces/response'
import { REQUEST } from '@nestjs/core'
import { plainToClass } from 'class-transformer'
import { Request } from 'express'
import { validate } from 'class-validator'

/*
validation => valid string, boolean, array or object
*/
export const ValidationPipe = () => {
  class ValidationPipe implements PipeTransform<any> {
    private traceID: string

    constructor(@Inject(REQUEST) private readonly request: Request) {
      this.traceID = this.request.app_CONTEXT.traceID
    }

    async transform(value: string, metadata: ArgumentMetadata) {
      const { metatype } = metadata
      if (!metatype || !this.toValidate(metatype)) {
        return value
      }
      const object = plainToClass(metatype, value)
      const errors = await validate(object)
      if (errors.length > 0) {
        const { type, data } = metadata
        throw new BadRequestException(<APIResponse>getAPIResponse(messages.VAL003.code, this.traceID, HttpStatus.BAD_REQUEST, { type, data }))
      }
      return value
    }

    private toValidate(metatype: Type<any>): boolean {
      const types = [String, Boolean, Number, Array, Object]
      return !types.find((type) => metatype === type)
    }
  }
  return mixin(ValidationPipe)
}

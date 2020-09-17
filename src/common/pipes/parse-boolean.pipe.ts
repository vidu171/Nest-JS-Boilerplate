import { messages } from '@messages'
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, Inject, HttpStatus, mixin } from '@nestjs/common'
import { getAPIResponse } from '@utils/platform.util'
import { APIResponse } from '@interfaces/response'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import _ from 'lodash'

/*
validation => valid number (decimal)
*/
export const ParseBooleanPipe = () => {
  class ParseBooleanPipe implements PipeTransform {
    private traceID: string

    constructor(@Inject(REQUEST) private readonly request: Request) {
      this.traceID = this.request.app_CONTEXT.traceID
    }

    async transform(value: string, metadata: ArgumentMetadata) {
      if (_.eq(value, 'true')) {
        return true
      }
      if (_.eq(value, 'false')) {
        return false
      }

      const { type, data } = metadata
      throw new BadRequestException(<APIResponse>getAPIResponse(messages.VAL002.code, this.traceID, HttpStatus.BAD_REQUEST, { type, data }))
    }
  }
  return mixin(ParseBooleanPipe)
}

import { messages } from '@messages'
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, Inject, HttpStatus, Scope, mixin } from '@nestjs/common'
import { getAPIResponse } from '@utils/platform.util'
import { APIResponse } from '@interfaces/response'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'

/*
validation => valid number (decimal)
*/
export const ParseIntPipe = () => {
  class ParseIntPipe implements PipeTransform {
    private traceID: string

    constructor(@Inject(REQUEST) private readonly request: Request) {
      this.traceID = this.request.app_CONTEXT.traceID
    }

    async transform(value: string, metadata: ArgumentMetadata) {
      const val = parseInt(value, 10)
      if (isNaN(val)) {
        const { type, data } = metadata
        throw new BadRequestException(<APIResponse>getAPIResponse(messages.VAL001.code, this.traceID, HttpStatus.BAD_REQUEST, { type, data }))
      }
      return val
    }
  }
  return mixin(ParseIntPipe)
}

import { messages } from '@messages'
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, Inject, HttpStatus, mixin } from '@nestjs/common'
import { getAPIResponse } from '@utils/platform.util'
import { APIResponse } from '@interfaces/response'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import _ from 'lodash'

/*
validation => valid string
*/
export const ParseStringPipe = () => {
  class ParseStringPipe implements PipeTransform {
    private traceID: string

    constructor(@Inject(REQUEST) private readonly request: Request) {
      this.traceID = this.request.app_CONTEXT.traceID
    }

    async transform(value: string, metadata: ArgumentMetadata) {
      if (!_.isNil(value)) {
        return value
      }

      const { type, data } = metadata
      throw new BadRequestException(<APIResponse>getAPIResponse(messages.VAL004.code, this.traceID, HttpStatus.BAD_REQUEST, { type, data }))
    }
  }
  return mixin(ParseStringPipe)
}

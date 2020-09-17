import { HttpException, HttpStatus } from '@nestjs/common'
import { ServiceResponse } from '@interfaces/response'

export class JWTException extends HttpException {
  constructor(exception: ServiceResponse) {
    super(exception, exception.status)
  }
}

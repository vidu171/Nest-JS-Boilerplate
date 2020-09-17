import { APIResponse, ServiceResponse } from '@interfaces/response'
import { Controller, Res, Get, UseGuards } from '@nestjs/common'
import _ from 'lodash'
import { Response } from 'express'
import { SystemService } from './system.service'

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('routes')
  getEndpoints(@Res() response: Response) {
    this.systemService.getEndpoints().then((service_response: ServiceResponse) => {
      return response.status(service_response.status).send(<APIResponse>service_response)
    })
  }
}

import { Controller, Get, Res, UseGuards, Req, Body, Post } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ServiceResponse, APIResponse } from '@interfaces/response'
import { Response, Request } from 'express'
import { Audience } from '@decorators/audience.decorator'
import { audience } from '@config'
import { AuthenticationGuard } from '@guards/authentication.guard'
import { UserService } from './user.service'
import { User } from './user.schema'
import { AuthenticateUserDTO } from './dto/authenticate-user.dto'

@Controller('user')
export class UserController {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private userService: UserService) {}

  @Audience([audience.ADMIN, audience.CLIENT])
  @UseGuards(AuthenticationGuard)
  @Get('fetch')
  fetchUser(@Res() response: Response, @Req() request: Request) {
    this.userService.findOne(request.user._id).then((service_response: ServiceResponse) => {
      return response.status(service_response.status).send(<APIResponse>service_response)
    })
  }

  @Post('authenticate')
  authenticate(@Res() response: Response, @Body() user: AuthenticateUserDTO) {
    this.userService.authenticate(user).then((service_response: ServiceResponse) => {
      return response.status(service_response.status).send(<APIResponse>service_response)
    })
  }
}

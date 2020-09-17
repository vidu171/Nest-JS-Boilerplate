import { IsString, IsDefined } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AuthenticateUserDTO {
    @ApiProperty({ required: true })
    @IsString()
    @IsDefined()
    readonly email: string;

    @ApiProperty({ required: true })
    @IsString()
    @IsDefined()
    readonly password: string;
}
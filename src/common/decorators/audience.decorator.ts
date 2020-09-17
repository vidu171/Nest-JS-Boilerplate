import { SetMetadata } from '@nestjs/common'
import { audience } from '@config'

export const Audience = (audience: audience[]) => SetMetadata('audience', audience)

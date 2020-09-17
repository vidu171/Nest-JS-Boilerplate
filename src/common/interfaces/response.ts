import { GenericObject } from '@interfaces/generic'

export interface APIResponse {
  code: string
  message: string
  data?: GenericObject
  traceID: string
}

export interface ServiceResponse extends APIResponse {
  status: number
}

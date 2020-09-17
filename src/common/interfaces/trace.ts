import { GenericObject } from '@interfaces/generic';

export interface appContext extends Request {
  traceID: string
  userAgent: string
  specs: {
    browser: string
    version: number
  }
  data: GenericObject
  ip: string
  method: string
  url: string
}

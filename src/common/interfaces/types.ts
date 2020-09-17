import { appContext } from '@interfaces/trace'
import { User } from '@app/user/user.schema'

declare global {
  namespace Express {
    export interface Request {
      app_CONTEXT: appContext
      user: User
    }
  }
}

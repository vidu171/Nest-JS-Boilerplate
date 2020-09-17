import _ from 'lodash'
import { variables } from '@config'
import basicAuth from 'express-basic-auth'
import { getEnvironmentVariable } from '@utils/platform.util'

export const BasicAuthenticationMiddleware = () => {
  const credentials = {}
  credentials[`${getEnvironmentVariable(variables.SYSTEM_USERNAME.name)}`] = getEnvironmentVariable(variables.SYSTEM_PASSWORD.name)
  return basicAuth({
    challenge: true,
    users: credentials,
  })
}

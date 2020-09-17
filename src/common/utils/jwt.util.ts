import jwt from 'jsonwebtoken'
import { getEnvironmentVariable } from '@utils/platform.util'
import { variables } from '@config'
import { GenericObject } from '@interfaces/generic'

export default class JWTHandler {
  secretOrPrivateKey: string

  secretOrPublicKey: string

  options: GenericObject

  constructor(options: GenericObject = {}) {
    this.secretOrPrivateKey = getEnvironmentVariable(variables.JWT_PRIVATE_SECRET.name)
    this.secretOrPublicKey = getEnvironmentVariable(variables.JWT_PUBLIC_SECRET.name)
    this.options = options // algorithm + keyid + noTimestamp + expiresIn + notBefore
  }

  sign(payload: any, signOptions: any) {
    const jwtSignOptions = { ...signOptions, ...this.options }
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions)
  }

  // refreshOptions.verify = options you would use with verify function
  // refreshOptions.jwtid = contains the id for the new token
  refresh = function(token: string, refreshOptions: any) {
    const payload: any = jwt.verify(token, this.secretOrPublicKey, refreshOptions.verify)
    delete payload.iat
    delete payload.exp
    delete payload.nbf
    delete payload.jti // We are generating a new token, if you are using jwtid during signing, pass it in refreshOptions
    const jwtSignOptions = { ...this.options, jwtid: refreshOptions.jwtid }
    // The first signing converted all needed options into claims, they are already in the payload
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions)
  }
}

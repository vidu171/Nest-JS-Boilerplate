import _ from 'lodash'
import cryptr from 'cryptr'
import { variables, constants } from '@config'
import JWTHandler from './jwt.util'
import { getEnvironmentVariable, getTokenOptions } from './platform.util'

export default class AuthHandler {
    private static instance: AuthHandler

    private static _tokenHandler: JWTHandler

    private static _encryptionHandler: cryptr

    private constructor() {
        AuthHandler._tokenHandler = new JWTHandler(getTokenOptions(constants.TOKEN.login))
        AuthHandler._encryptionHandler = new cryptr(getEnvironmentVariable(variables.PASSWORD_HASH.name))
    }

    static getInstance(): AuthHandler {
        if (_.isNil(AuthHandler.instance)) {
            AuthHandler.instance = new AuthHandler()
        }
        return AuthHandler.instance
    }

    tokenHandler = (): JWTHandler => AuthHandler._tokenHandler

    encryptionHandler = (): cryptr => AuthHandler._encryptionHandler
}
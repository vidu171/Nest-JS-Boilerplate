import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import parse from 'parse-bearer-token'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import ms from 'ms'
import fs from 'fs'
import path from 'path'
import basicAuth from 'express-basic-auth'
import uniqid from 'uniqid'
import { NextFunction, Request, Response } from 'express'
import cryptr from 'cryptr'
import atob from 'atob'
import { variables, constants, audience } from '@config'
import { messages } from '@messages'
import { ServiceResponse } from '@interfaces/response'
import { Message } from '@interfaces/message'
import { HttpStatus } from '@nestjs/common'
import { appContext } from '@interfaces/trace'
import mongoose from 'mongoose'
import { TokenOptions, TokenSignOptions } from '@interfaces/token'

// get environment variable from .env file or return default
export const getEnvironmentVariable = (variable: number | string) => (process.env[variable] ? process.env[variable] : _.get(variables, `${variable}.value`))

export const getServerAPIRevision = () => (_.isEmpty(getEnvironmentVariable(variables.SERVER_API_REVISION.name)) ? '' : `${getEnvironmentVariable(variables.SERVER_API_REVISION.name)}/`)

// get db connection string
export const getMongoConnectionString = () =>
  !!getEnvironmentVariable(variables.DB_USERNAME.name) && !_.isEmpty(getEnvironmentVariable(variables.DB_USERNAME.name)) && getEnvironmentVariable(variables.DB_PASSWORD.name) && !_.isEmpty(getEnvironmentVariable(variables.DB_PASSWORD.name))
    ? `mongodb://${getEnvironmentVariable(variables.DB_USERNAME.name)}:${encodeURIComponent(getEnvironmentVariable(variables.DB_PASSWORD.name))}@${getEnvironmentVariable(variables.DB_URL.name)}:${getEnvironmentVariable(variables.DB_PORT.name)}/${getEnvironmentVariable(variables.DB_NAME.name)}${!_.isEmpty(getEnvironmentVariable(variables.DB_REPLICA_SET.name)) ? `?replicaSet=${getEnvironmentVariable(variables.DB_REPLICA_SET.name)}` : ''}`
    : `mongodb://${getEnvironmentVariable(variables.DB_URL.name)}:${getEnvironmentVariable(variables.DB_PORT.name)}/${getEnvironmentVariable(variables.DB_NAME.name)}${!_.isEmpty(getEnvironmentVariable(variables.DB_REPLICA_SET.name)) ? `?replicaSet=${getEnvironmentVariable(variables.DB_REPLICA_SET.name)}` : ''}`

// extract parameter from url by name
export const extractParameterFromURL = (name: string, url: string) => {
  name = name.replace(/[[\]]/g, '\\$&')
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}
/*
get cookie domain
*/
// export const getCookieDomain = (): string => {
//   const app_environment = getEnvironmentVariable(variables.app_ENV.name)
//   if (!_.isNil(app_environment)) {
//     return constants.ALLOWED_ORIGINS.find((_originObject) => {
//       return _originObject.environment.includes(app_environment)
//     }).cookie
//   }
//   return ''
// }

/*
get success or error response for request
*/
export const getAPIResponse = (value: string, traceID: string = undefined, status: number, data: unknown = {}): ServiceResponse => {
  const message_object: Message = _.get(messages, `${value}`)
  const response_object = <ServiceResponse>{
    message: !_.isNil(message_object) ? message_object.message : 'N/A',
    traceID,
    code: !_.isNil(message_object) ? message_object.code : 'N/A',
    data,
  }
  if (status) {
    response_object.status = status
  }
  return response_object
}

/*
get success or error log
*/
export const getLog = (method: string, payload: unknown = {}, message = 'an error occurred'): string => `method: ${method}, payload: ${JSON.stringify(payload)}, error: ${message}`

// get error log
export const getErrorLog = (method: string, payload: any = {}, message = 'an error occurred'): string => `method: ${method}, payload: ${JSON.stringify(payload)}, error: ${message}`

// get days in month
export const daysInMonth = (month: number, year: number) => new Date(year, month, 0).getDate()

// check user token is valid or not
// export const isUserAuthenticated = (audience: string | string[]) => (request: Request, response: Response, next: NextFunction) => {
//   const jwtToken = parse(request as any)
//   if (!jwtToken) {
//     return response.status(codes.unauthorized).json(getErrorResponse(errors.JWT004.code))
//   }
//   jwt.verify(jwtToken, getEnvironmentVariable(variables.JWT_PRIVATE_SECRET.name),
//  { audience, issuer: getEnvironmentVariable(variables.JWT_ISSUER.name) }, (error: VerifyErrors, user: object) => {
//     if (!_.isNil(error)) {
//       if (error.name === 'JsonWebTokenError') {
//         return response.status(codes.unauthorized).json(getErrorResponse(errors.JWT001.code))
//       } if (error.name === 'NotBeforeError') {
//         return response.status(codes.unauthorized).json(getErrorResponse(errors.JWT002.code))
//       } if (error.name === 'TokenExpiredError') {
//         return response.status(codes.unauthorized).json(getErrorResponse(errors.JWT003.code))
//       }
//       return response.status(codes.unauthorized).json(getErrorResponse(errors.COM001.code))
//     }

//     request.user = user as User
//     return next()
//   })
// }

// return basic auth handler
export const basicAuthHandler = () => {
  const credentials = {}
  credentials[`${getEnvironmentVariable(variables.SYSTEM_USERNAME.name)}`] = getEnvironmentVariable(variables.SYSTEM_PASSWORD.name)
  return basicAuth({
    challenge: true,
    users: credentials,
  })
}

export const getObjectID = () => mongoose.Types.ObjectId()

// token handler initializing options
export const getTokenOptions = (epiresIn: string): TokenOptions =>
  ({
    algorithm: 'HS256',
    noTimestamp: false,
    expiresIn: epiresIn,
    notBefore: '0s',
  } as TokenOptions)

// token handler signing options
export const getTokenSignOptions = (subject: string, audience: string): TokenSignOptions =>
  ({
    audience,
    issuer: getEnvironmentVariable(variables.JWT_ISSUER.name),
    jwtid: uuidv4(),
    subject,
  } as TokenSignOptions)

// chunk an array
export const chunkArray = (inputArray: any[], chunkLimit: number) => {
  let index = 0
  const arrayLength = inputArray.length
  const tempArray = []
  for (index = 0; index < arrayLength; index += chunkLimit) {
    const subChunk = inputArray.slice(index, index + chunkLimit)
    tempArray.push(subChunk)
  }
  return tempArray
}

// encrypt password using cryptr
export const encryptPassword = (value: string) => new cryptr(getEnvironmentVariable(variables.PASSWORD_HASH.name)).encrypt(value)

// decrypt password using cryptr
export const decryptPassword = (value: string) => new cryptr(getEnvironmentVariable(variables.PASSWORD_HASH.name)).decrypt(value)

// sanatise full name
export const getSanatisedName = (firstName: string, middleName: string, lastName: string) => {
  const value = `${middleName}`
  if (!value || value.trim().length <= 0) {
    return `${firstName} ${middleName} ${lastName}`
  }
  return `${firstName} ${lastName}`
}

// positive number check
export const isNumberPositive = (value: string) => /^[+]?\d*\.?\d+$/.test(value)

// valid sms cost check
export const isValidSMSCost = (value: string) => /^[+]?[0-9]{1,9}(?:\.[0-9]{1,2})?$/.test(value)

// valid month check
export const isValidMonth = (value: number) => /^([1-9]|1[012])$/.test(String(value))

// valid year check
export const isValidYear = (value: number) => /^19[5-9]\d|20[0-4]\d|2050$/.test(String(value))

// valid url check
export const isValidURl = (value: string) =>
  // eslint-disable-next-line max-len
  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(value)

// valid phone check
export const isValidPhone = (value: number | string) => /^\d{10}$/.test(String(value))

// valid distance check
export const isValidDistance = (value: string) => /^[-+]?\d*\.?\d+$/.test(value)

// valid number check
export const isValidNumber = (value: string | number) => /^[0-9]*$/.test(String(value))

// valid decimal number check
export const isValidDecimalNumber = (value: string | number) => /^-?\d*(\.\d+)?$/.test(String(value))

// valid object check
export const isObjectValid = (query: any): boolean => {
  try {
    JSON.parse(JSON.stringify(query))
    return true
  } catch (e) {
    return false
  }
}

// generate unique uid
export const generateUID = (): string => uuidv4()

// generate short unique uid
export const generateShortUID = (): string => uniqid.time()

// get milliseconds from string
export const getMilliseconds = (time: string) => {
  if (_.eq(typeof time, 'string')) {
    const milliseconds = ms(time)
    if (_.eq(typeof milliseconds, 'undefined')) {
      return
    }
    return milliseconds
  }
}

// get seconds from string
export const getSeconds = (time: string) => {
  if (_.eq(typeof time, 'string')) {
    const milliseconds = ms(time)
    if (_.eq(typeof milliseconds, 'undefined')) {
      return
    }
    return milliseconds / 1000
  }
}

// get token expiration timestamp
export const getExpirationTimestamp = (token: string) => {
  try {
    const jwtTokenObject = JSON.parse(atob(token.split('.')[1]))
    return jwtTokenObject.exp
  } catch (error) {
    return 0
  }
}

// token handler initializing options
export const switchUserAudience = (userType: number): audience => {
  let audience_val: audience = audience.PUBLIC
  switch (userType) {
    case constants.USER_TYPES.client:
      audience_val = audience.CLIENT
      break
    case constants.USER_TYPES.admin:
      audience_val = audience.ADMIN
      break
  }
  return audience_val
}

// // token handler signing options
// export const getTokenSignOptions = (subject: string, audience: string): TokenSignOptions => ({
//   audience,
//   issuer: getEnvironmentVariable(variables.JWT_ISSUER.name),
//   jwtid: uuidv4(),
//   subject
// } as TokenSignOptions)

// delete a file using file path
export const deleteFile = (filePath: string) => {
  try {
    fs.unlinkSync(filePath)
  } catch (error) {
    console.log(error)
  }
}

// create server static directories
export const createStaticDirectories = () => {
  if (!fs.existsSync(path.join(process.cwd(), `${getEnvironmentVariable(variables.UPLOAD_DIRECTORY.name)}/`))) {
    fs.mkdirSync(path.join(process.cwd(), `${getEnvironmentVariable(variables.UPLOAD_DIRECTORY.name)}/`))
  }
  if (!fs.existsSync(path.join(process.cwd(), `${getEnvironmentVariable(variables.UPLOAD_DIRECTORY.name)}/${getEnvironmentVariable(variables.STATIC_DIRECTORY.name)}`))) {
    fs.mkdirSync(path.join(process.cwd(), `${getEnvironmentVariable(variables.UPLOAD_DIRECTORY.name)}/${getEnvironmentVariable(variables.STATIC_DIRECTORY.name)}`))
  }
}

/*
get brower name & version
*/
export const getBrowserAndVersion = (userAgent: string): RegExpMatchArray => {
  let tem: RegExpMatchArray
  let M = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(userAgent) || []
    return ['IE', tem[1] || '']
  }
  if (M[1] === 'Chrome') {
    tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/)
    if (!_.isNil(tem))
      return tem
        .slice(1)
        .join(' ')
        .replace('OPR', 'Opera')
        .split(' ')
  }
  M = M[2] ? [M[1], M[2]] : ['unknown', '00', '-?']
  if (!_.isNil((tem = userAgent.match(/version\/(\d+)/i)))) M.splice(1, 1, tem[1])
  return M
}

export const createappContext = (request: Request) => {
  const userAgent = <string>(request.headers['user-agent'] || request.headers['User-Agent'])
  const { ip, originalUrl, method } = request
  const userAgentSpecs = getBrowserAndVersion(userAgent)
  return <appContext>{
    traceID: generateUID(),
    userAgent,
    specs: {
      browser: userAgentSpecs[0],
      version: parseInt(userAgentSpecs[1], 10),
    },
    ip,
    url: originalUrl.replace(/\?.*$/, ''),
    method,
  }
}

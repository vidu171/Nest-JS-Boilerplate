import { GenericObject } from '@interfaces/generic'
import { application, cache_client } from './config.shared'
/*
  logging initilization messages
*/
export const logging = {
  initialised: (level: string): string => `Logging initialized at ${level} level`,
}

/*
  redis caching messages
*/
export const caching = {
  error: (error: unknown | string) => `Redis connection error. ${error}`,
  success: (URL: string, port: number | string, config: cache_client) =>
    `Redis Server connected succesfully. Host: ${URL} Port: ${port} Config: ${config}`,
}

/*
  application initilization messages
*/
export const consortium = {
  initialised: (url: string, port: string | number): string => `${application.name} API server listening on url => ${url}, port => ${port}`,
  welcome: `${application.name} Mainframe API`,
}

/*
  mongo initilization messages
*/
export const mongo = {
  error: (error: GenericObject | string) => `MongoDB connection error. ${error}`,
  success: (dbURL: string, dbName: string, port: number | string) =>
    `MongoDB connected succesfully. Host: ${dbURL} Database: ${dbName} Port: ${port}`,
}

// Websocket (Scoket.IO)
export const websocketIO = {
  error: (error: GenericObject | string) => `Socket.IO connection error. ${error}`,
  success: (URL: string, port: number | string) => `Socket.IO Server connected succesfully. Host: ${URL} Port: ${port}`,
  connect: (clientID: string) => `New client connected to socket. ClientID: ${clientID}`,
  disconnect: (clientID: string) => `Client disconnected from socket. ClientID: ${clientID}`,
}

export const messages = {
  // Common
  COM001: { message: 'server error occured', code: 'COM001' },
  COM002: { message: 'operation forbidden', code: 'COM002' },
  COM003: { message: 'authentication failure', code: 'COM003' },
  COM004: { message: 'invalid content-type, accepted content types: ', code: 'COM004' },
  COM005: { message: 'unable to validate session: ', code: 'COM005' },
  COM006: { message: 'too many requests: ', code: 'COM006' },
  COM007: { message: 'route not found: ', code: 'COM007' },

  // System
  SYS001: { message: 'system routes fetched successfully', code: 'SYS001' },

  // JWT
  JWT001: { message: 'jwt verification failed', code: 'JWT001' },
  JWT002: { message: 'jwt not active yet', code: 'JWT002' },
  JWT003: { message: 'jwt token expired', code: 'JWT003' },
  JWT004: { message: 'jwt token missing', code: 'JWT004' },

  // Mongo Common Errors
  MON001: { message: 'object id cannot be blank', code: 'MON001' },
  MON002: { message: 'query object is invalid', code: 'MON002' },
  MON003: { message: 'update object is invalid', code: 'MON003' },
  MON004: { message: 'sort object is invalid', code: 'MON004' },

  
  // User
  USER001: { message: 'first name cannot be empty', code: 'USER001' },
  
  /*
 validations
 */
  VAL001: { message: 'invalid number', code: 'VAL001' },
  VAL002: { message: 'invalid boolean', code: 'VAL002' },
  VAL003: { message: 'invalid type', code: 'VAL003' },
  VAL004: { message: 'invalid string', code: 'VAL004' },
}

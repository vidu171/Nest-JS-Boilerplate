import { getSeconds } from '@utils/platform.util'

/*
logs configuration
priority => 0: highest 7: lowest
*/
export const log = {
  colors: {
    emergency: 'brightRed',
    alert: 'brightBlue',
    crit: 'brightRed',
    error: 'brightRed',
    warning: 'brightYellow',
    notice: 'brightMagenta',
    info: 'brightCyan',
    debug: 'brightWhite',
  },
  filename: 'debug.log',
  levels: {
    emerg: {
      value: 'emerg',
      priority: 0,
    },
    alert: {
      value: 'alert',
      priority: 1,
    },
    critical: {
      value: 'crit',
      priority: 2,
    },
    error: {
      value: 'error',
      priority: 3,
    },
    warning: {
      value: 'warning',
      priority: 4,
    },
    notice: {
      value: 'notice',
      priority: 5,
    },
    info: {
      value: 'info',
      priority: 6,
    },
    debug: {
      value: 'debug',
      priority: 7,
    },
  },
}

/*
 environment names
 */
export const environments = {
  local: 'local',
  qa: 'qa',
  staging: 'staging',
  development: 'dev',
  production: 'production',
}

// environment variables file path
export const env = '../../.env'

// environment variables mapping
export const variables = {
  PORT: { name: 'PORT', value: 3003 },
  ADDRESS: { name: 'ADDRESS', value: '0.0.0.0' },
  LOG_LEVEL: { name: 'LOG_LEVEL', value: 'debug' },
  NODE_ENV: { name: 'NODE_ENV', value: 'development' },
  app_ENV: { name: 'app_ENV', value: 'local' },
  DB_NAME: { name: 'DB_NAME', value: 'app' },
  DB_URL: { name: 'DB_URL', value: 'localhost' },
  DB_PORT: { name: 'DB_PORT', value: '27017' },
  DB_USERNAME: { name: 'DB_USERNAME', value: '' },
  DB_PASSWORD: { name: 'DB_PASSWORD', value: '' },
  DB_REPLICA_SET: { name: 'DB_REPLICA_SET', value: '' },
  API_PREFIX: { name: 'API_PREFIX', value: 'api' },
  AWS_REGION: { name: 'AWS_REGION', value: 'ap-south-1' },
  JWT_PUBLIC_SECRET: { name: 'JWT_PUBLIC_SECRET', value: '0383726f4e24438bf9dd869c173357c1c89fa66a8f94a88bf51270e10c340a97' },
  JWT_PRIVATE_SECRET: { name: 'JWT_PRIVATE_SECRET', value: '0383726f4e24438bf9dd869c173357c1c89fa66a8f94a88bf51270e10c340a97' },
  JWT_ISSUER: { name: 'JWT_ISSUER', value: 'localhost' },
  PASSWORD_HASH: { name: 'PASSWORD_HASH', value: '052794d1b84f0d8db24c31834d4d5fd148dd14f324968814324f1178d2f081eb' },
  SERVER_API_REVISION: { name: 'SERVER_API_REVISION', value: '' },
  UPLOAD_DIRECTORY: { name: 'UPLOAD_DIRECTORY', value: 'uploads' },
  STATIC_DIRECTORY: { name: 'STATIC_DIRECTORY', value: 'static' },
  /* Session */
  SESSION_SECRET: { name: 'SESSION_SECRET', value: 'AfXOPQ0RymqJxrbeOpDi0Y4JJB7CBq7GZRcUME' },
  /* Redis */
  REDIS_PORT: { name: 'REDIS_PORT', value: 6379 },
  REDIS_URL: { name: 'REDIS_URL', value: 'localhost' },
  REDIS_PASSWORD: { name: 'REDIS_PASSWORD', value: 'no_password' },
  REDIS_PUB_SUB_PORT: { name: 'REDIS_PUB_SUB_PORT', value: 6379 },
  REDIS_PUB_SUB_URL: { name: 'REDIS_PUB_SUB_URL', value: 'localhost' },
  REDIS_PUB_SUB_PASSWORD: { name: 'REDIS_PUB_SUB_PASSWORD', value: 'no_password' },
  SYSTEM_USERNAME: { name: 'SYSTEM_USERNAME', value: '' },
  SYSTEM_PASSWORD: { name: 'SYSTEM_PASSWORD', value: '' },
  SERVER_PRIVATE_KEY: { name: 'SERVER_PRIVATE_KEY', value: '' },
  SERVER_FULLCHAIN_KEY: { name: 'SERVER_FULLCHAIN_KEY', value: '' }
}

/*
  cache client configuration
*/
export enum cache_client {
  DEFAULT = 'DEFAULT',
  PUB_SUB = 'PUB_SUB',
}

// application default values
export const application: any = {
  name: 'app',
}

// database tables
export const tables = {
  USER: { name: 'users', collection: 'users' },
}

export enum audience {
  CLIENT = 'client',
  ADMIN = 'admin',
  PUBLIC = 'public',
}
// defined constants
export const constants = {
  USER_TYPES: {
    client: 2,
    admin: 3
  },
  TOKEN: {
    login: '5d',
    campaign_sms: '48h',
  },
  MONTHS: [
    {
      short: 'Jan',
      long: 'January',
      index: 1,
    },
    {
      short: 'Feb',
      long: 'February',
      index: 2,
    },
    {
      short: 'Mar',
      long: 'March',
      index: 3,
    },
    {
      short: 'Apr',
      long: 'April',
      index: 4,
    },
    {
      short: 'May',
      long: 'May',
      index: 5,
    },
    {
      short: 'Jun',
      long: 'June',
      index: 6,
    },
    {
      short: 'Jul',
      long: 'July',
      index: 7,
    },
    {
      short: 'Aug',
      long: 'August',
      index: 8,
    },
    {
      short: 'Sep',
      long: 'September',
      index: 9,
    },
    {
      short: 'Oct',
      long: 'October',
      index: 10,
    },
    {
      short: 'Nov',
      long: 'November',
      index: 11,
    },
    {
      short: 'Dec',
      long: 'December',
      index: 12,
    },
  ],
}


export const redisKeys = {
  USER: { timeout: () => getSeconds('1hr'), value: (userID: string) => `user_${userID}` },
}

// default canonical method names
export const canonicalMethods = {
  // User
  FIND_CLIENT_USER: 'FIND_CLIENT_USER',
  AUTHENTICATE_CLIENT_USER: 'AUTHENTICATE_CLIENT_USER',
  
  // Bootstrap
  BOOTSTRAP_SERVER: 'BOOTSTRAP_SERVER',
}

// content types header
export const contentTypes = {
  APPLICATION: {
    JAVA_ARCHIVE: 'application/java-archive',
    EXI_X12: 'application/EDI-X12',
    EDIFACT: 'application/EDIFACT',
    JAVASCRIPT: 'application/javascript',
    OCTET_STREAM: 'application/octet-stream',
    OGG: 'application/ogg',
    PDF: 'application/pdf',
    XHTML_xml: 'application/xhtml+xml',
    SHOCKWAVE: 'application/x-shockwave-flash',
    JSON: 'application/json',
    LD_JSON: 'application/ld+json',
    XML: 'application/xml',
    ZIP: 'application/zip',
    URL_ENCODED: 'application/x-www-form-urlencoded',
  },
  AUDIO: {
    MPEG: 'audio/mpeg',
    WMA: 'audio/x-ms-wma',
    REAL_AUDIO: 'audio/vnd.rn-realaudio',
    WAV: 'audio/x-wav',
  },
  IMAGE: {
    GIF: 'image/gif',
    JPEG: 'image/jpeg',
    PNG: 'image/png',
    TIFF: 'image/tiff',
    VND_ICON: 'image/vnd.microsoft.icon',
    X_ICON: 'image/x-icon',
    DJVU: 'image/vnd.djvu',
    SVG_XML: 'image/svg+xml',
  },
  MULTIPART: {
    MIXED: 'multipart/mixed',
    ALTERNATIVE: 'multipart/alternative',
    RELATED: 'multipart/related',
    FORM_DATA: 'multipart/form-data',
  },
  TEXT: {
    CSS: 'text/css',
    CSV: 'text/csv',
    HTML: 'text/html',
    JAVASCRIPT: 'text/javascript',
    PLAIN: 'text/plain',
    XML: 'text/xml',
  },
  VIDEO: {
    MPEG: 'video/mpeg',
    MP4: 'video/mp4',
    QUICKTIME: 'video/quicktime',
    WMV: 'video/x-ms-wmv',
    MSVIDEO: 'video/x-msvideo',
    FLV: 'video/x-flv',
    WEBM: 'video/webm',
  },
}

export interface TokenOptions {
    algorithm: string
    noTimestamp: boolean
    expiresIn: string
    notBefore: string
}

export interface TokenSignOptions {
    audience: string
    issuer: boolean
    jwtid: string
    subject: string
}

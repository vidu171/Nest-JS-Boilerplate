import { HttpException, HttpStatus } from "@nestjs/common"

export class SessionException extends HttpException {
    constructor() {
        super('Forbidden', 408)
    }
}
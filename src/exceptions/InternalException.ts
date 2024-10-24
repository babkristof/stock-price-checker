import { HttpException } from "./HttpException";

export class InternalException extends HttpException {
    constructor(message: string, errors: any, errorCode: number) {
        super(message, errorCode, 500, errors)
    }
}
import { HttpException } from "./httpException";

export class NotFoundException extends HttpException {
    constructor(message: string, errorCode: number) {
        super(message, errorCode, 404);
    }
}
export class HttpException extends Error {
    public statusCode: number;
    public errorCode: number;
    public errors: any;

    constructor(message: string, errorCode: number, statusCode: number, errors: any = null) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.errors = errors;
    }
}
import { ErrorCode } from "./ErrorCode";
import { HttpException } from "./httpException";

export class JobAlreadyRunningException extends HttpException {
    constructor(symbol: string) {
        super(`Price check for ${symbol} is already running.`, ErrorCode.JOB_ALREADY_RUNNING, 400);
    }
}
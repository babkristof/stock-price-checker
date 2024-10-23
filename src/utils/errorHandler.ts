import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpException } from "../exceptions/httpException";
import { InternalException } from "../exceptions/InternalException";
import { ErrorCode } from "../exceptions/ErrorCode";
import { BadRequestException } from "../exceptions/BadRequestException";

export const errorHandler = (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next);
        } catch (error: any) {
            let exception: HttpException;
            if (error instanceof HttpException) {
                exception = error;
            } else if (error instanceof ZodError) {
                exception = new BadRequestException('Unprocessable entity', ErrorCode.UNPROCESSABLE_ENTITY);
            } else {
                exception = new InternalException('Something went wrong', error, ErrorCode.INTERNAL_EXCEPTION);
            }
            next(exception);
        }
    };
};
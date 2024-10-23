import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/httpException";


export const errorMiddleware = (error: HttpException, request: Request, response: Response, next: NextFunction) => {
    response.status(error.statusCode || 500).json({
        message: error.message,
        errorCode: error.errorCode,
        errors: error.errors || null,
    });
};
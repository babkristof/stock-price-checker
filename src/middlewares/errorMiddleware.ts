import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/httpException";
import logger from '../config/logger';
import config from "../config/config";


export const errorMiddleware = (error: HttpException, request: Request, response: Response, next: NextFunction) => {
    const statusCode = error.statusCode || 500;
    logger.error(`[${request.method}] ${request.url} - ${statusCode} - ${error.message}`);
    if (config.env === 'development') {
        logger.debug(`Stack trace: ${error.stack}`);
    }
    response.status(statusCode).json({
        message: error.message,
        errorCode: error.errorCode,
        errors: error.errors || null,
    });
};
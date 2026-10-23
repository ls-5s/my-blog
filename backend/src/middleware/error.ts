import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const notFound = (_request: Request, _response: Response, next: NextFunction): void => {
  next(new AppError(404, 'NOT_FOUND', '请求的资源不存在'));
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ error: { code: error.code, message: error.message, details: error.details } });
    return;
  }
  if (error instanceof ZodError) {
    response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: '请求参数无效', details: error.flatten() } });
    return;
  }
  if (error?.code === 'ERR_SQLITE_ERROR' && [1555, 2067].includes(error.errcode)) {
    response.status(409).json({ error: { code: 'CONFLICT', message: 'slug 已存在' } });
    return;
  }
  console.error(error);
  response.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' } });
};

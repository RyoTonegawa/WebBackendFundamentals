import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { uuidv7 } from 'uuidv7';
import winston, { format, transports } from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()],
});

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const start = process.hrtime.bigint();
    const requestId = (req.headers['x-request-id'] as string | undefined) ?? uuidv7();

    (req as Request & { requestId: string }).requestId = requestId;
    res.setHeader('x-request-id', requestId);

    logger.info('http_request', {
      requestId,
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      body: req.body,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    res.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
      logger.info('http_response', {
        requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        contentLength: res.getHeader('content-length'),
        durationMs: Number(durationMs.toFixed(2)),
      });
    });

    next();
  }
}

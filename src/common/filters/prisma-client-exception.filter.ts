import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Here we catch specific Prisma codes and convert them to HTTP Errors
    switch (exception.code) {
      case 'P2002': {
        // Unique constraint error (e.g. personId already exists)
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: 'A record with this unique identifier already exists.',
          error: 'Conflict',
        });
        break;
      }
      case 'P2025': {
        // Prisma Record not found error
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          statusCode: status,
          message: 'The requested record was not found.',
          error: 'Not Found',
        });
        break;
      }
      default:
        // For all other DB errors, we use the default behavior (500)
        super.catch(exception, host);
        break;
    }
  }
}

import {
  ArgumentsHost,
  BadRequestException,
  ConflictException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaExceptionFilter } from './exception.filter';

describe('PrismaExceptionFilter', () => {
  let filter: PrismaExceptionFilter;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    filter = new PrismaExceptionFilter();
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
  });

  function createHost(): ArgumentsHost {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ url: '/account-holder' }),
        getResponse: () => ({ status }),
      }),
    } as unknown as ArgumentsHost;
  }

  it('maps Prisma unique constraint errors to HTTP 409', () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: 'test',
      },
    );

    filter.catch(error, createHost());

    expect(status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.CONFLICT,
        path: '/account-holder',
        message: 'A record with the provided value already exists',
      }),
    );
  });

  it('preserves Nest HTTP exception status and message', () => {
    filter.catch(new BadRequestException('Invalid name'), createHost());

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid name',
      }),
    );
  });

  it('maps Prisma missing-record errors to HTTP 404', () => {
    const error = new Prisma.PrismaClientKnownRequestError('Record not found', {
      code: 'P2025',
      clientVersion: 'test',
    });

    filter.catch(error, createHost());

    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'The requested record was not found',
      }),
    );
  });

  it('maps Prisma foreign key errors to HTTP 409', () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      'Foreign key constraint failed',
      {
        code: 'P2003',
        clientVersion: 'test',
      },
    );

    filter.catch(error, createHost());

    expect(status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.CONFLICT,
        message: 'The record cannot be deleted because related records exist',
      }),
    );
  });
});

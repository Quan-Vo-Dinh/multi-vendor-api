import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

import { isUniqueConstraintPrismaError } from 'src/shared/helpers'

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    let httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    let responseBody: Record<string, unknown>

    if (exception instanceof HttpException) {
      const response = exception.getResponse()
      // Nếu response đã có cấu trúc chuẩn, sử dụng trực tiếp
      if (typeof response === 'object' && response !== null) {
        responseBody = {
          statusCode: httpStatus,
          ...response,
        }
      } else {
        // Nếu response là string, wrap lại
        responseBody = {
          statusCode: httpStatus,
          message: response,
        }
      }
    } else if (isUniqueConstraintPrismaError(exception)) {
      httpStatus = HttpStatus.CONFLICT
      responseBody = {
        statusCode: httpStatus,
        message: 'Conflict error: Record already exists',
      }
    } else {
      responseBody = {
        statusCode: httpStatus,
        message: 'Internal server error',
      }
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}

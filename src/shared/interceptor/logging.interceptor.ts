import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // chạy trước handler:
    const req = context.switchToHttp().getRequest()
    const { method, originalUrl } = req
    const now = Date.now()

    // next.handle() trả về Observable => có thể pipe các operator
    return next.handle().pipe(
      tap(() => {
        this.logger.log(`${method} ${originalUrl} - ${Date.now() - now}ms`)
      }),
    )
  }
}

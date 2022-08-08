import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject, CACHE_MANAGER, BadRequestException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Cache } from 'cache-manager';

@Injectable()
export class RateInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER)
    protected readonly cache: Cache,
  ) { }
  // 防止频繁请求
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const { user, url } = context.switchToHttp().getRequest();
    const key = this._makeKey(user.address, url);
    // this.logger.debug(`key: ${key}`)
    const cache = await this.cache.get(key);
    if (!cache) {
      await this.cache.set(key, true, { ttl: 5 });
    } else {
      throw new BadRequestException();
    }

    return next
      .handle()
      .pipe(
        tap(() => this.cache.del(key)),
        catchError((err) => {
          this.cache.del(key);
          return throwError(() => err);
        })
      );
  }

  _makeKey(address: string, handleName: string) {
    return address + handleName;
  }
}

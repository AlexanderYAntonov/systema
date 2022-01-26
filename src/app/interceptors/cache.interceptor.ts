import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { share, tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache: Map<string, HttpResponse<any>> = new Map()
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    if (!req.url.includes('.json')) {
      return next.handle(req);
    }

    const cachedResponse: HttpResponse<any> = this.cache.get(req.url)
    if(cachedResponse) {
        return of(cachedResponse.clone())
    }else {
        return next.handle(req).pipe(
            tap(stateEvent => {
                if(stateEvent instanceof HttpResponse) {
                    this.cache.set(req.url, stateEvent.clone());
                }
            }),
            share()
        )
    }
  }
}

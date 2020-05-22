import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {AuthenticationService, LastSeenTapesService, TvShowService} from '../_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private lastSeenTapesService: LastSeenTapesService,
    private tvShowService: TvShowService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (this.isOwnApi(request) && err.status === 401) {
        // auto logout if 401 response returned from api
        this.authenticationService.logout();
        this.tvShowService.delete();
        this.lastSeenTapesService.delete();
        location.reload();
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }

  isOwnApi(request: HttpRequest<any>): boolean {
    if (request.url.indexOf('cinema') !== -1) {
      return true;
    }
    return request.url.indexOf('localhost') !== -1;
  }
}

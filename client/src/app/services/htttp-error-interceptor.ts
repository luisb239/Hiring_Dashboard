import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AlertService} from './alert/alert.service';
import {Injectable} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {ErrorType} from './common-error';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private alert: AlertService, private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.alert.error('Your session has expired. Please log in.');
            this.authService.resetUserInfo();
            this.router.navigate(['/home']);
          } else {
            let errorMessage;
            let errorType: ErrorType;
            if (error.error instanceof ErrorEvent) {
              // client-side error
              errorMessage = `Error: ${error.error.message}`;
            } else {
              // server-side error
              errorMessage = `Error Code: ${error.status}\nTitle: ${error.error.title}\nDetail: ${error.error.detail}`;
              switch (error.status) {
                case 404:
                  errorType = ErrorType.NOT_FOUND;
                  break;
                case 409:
                  errorType = ErrorType.CONFLICT;
                  break;
                default:
                  errorType = ErrorType.INTERNAL_SERVER;
                  this.alert.error('Unexpected error. Refresh and try again.');
                  break;
              }
            }
            console.log(errorMessage);
            return throwError(errorType);
          }
        })
      );
  }

}

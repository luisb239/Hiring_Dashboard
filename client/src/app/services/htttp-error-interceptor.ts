import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AlertService} from './alert/alert.service';
import {Injectable} from '@angular/core';
import {AuthService} from './auth/auth.service';

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
            this.authService.clearSessionFromStorage();
            this.router.navigate(['/home']);
          } else {
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) {
              // client-side error
              errorMessage = `Error: ${error.error.message}`;
            } else {
              // server-side error
              errorMessage = `Error Code: ${error.status}\nTitle: ${error.error.title}\nDetail: ${error.error.detail}`;
            }
            // window.alert(errorMessage);
            return throwError(errorMessage);
          }
        })
      );
  }

}

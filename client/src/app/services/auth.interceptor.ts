import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
         HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = localStorage.getItem('token'); // Get token and asssign to variable to be used elsewhere
        if (authToken) {
            const cloned = req.clone({
               headers: req.headers.set('authorization', authToken)
            });

            return next.handle(cloned).pipe(tap((err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        console.log('redirect to the login route');
                    }
                }
            }));
        } else {
            return next.handle(req).pipe(tap((err: any) => {
                if (err instanceof HttpErrorResponse) {
                    return throwError(err);
                }
            }));
        }
    }
}

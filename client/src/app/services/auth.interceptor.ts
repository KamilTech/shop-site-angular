import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = localStorage.getItem('token'); // Get token and asssign to variable to be used elsewhere
        if (authToken) {
            const cloned = req.clone({
               headers: req.headers.set('authorization', authToken)
            });

            return next.handle(cloned);
        } else {
            return next.handle(req);
        }
    }
}

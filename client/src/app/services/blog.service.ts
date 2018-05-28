import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
    
    domain = 'http://localhost:8080/'; // Development Domain - Not Needed in Production

    constructor(
        private http: HttpClient
    ) { }
    
    
    newBlog(blog) {
        return this.http.post(this.domain + 'blogs/newBlog', blog).pipe(map(res => res));
    }
}

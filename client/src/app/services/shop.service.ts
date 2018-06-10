import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

    domain = 'http://localhost:8080'; // Development Domain - Not Needed in Production

    constructor(
        private http: HttpClient
    ) { }

    // Function to create new blog post
    newItem(item) {
        return this.http.post(this.domain + '/shop/newItem', item).pipe(map(res => res));
    }

}

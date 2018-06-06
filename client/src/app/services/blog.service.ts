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

    // Function to create new blog post
    newBlog(blog) {
        return this.http.post(this.domain + 'blogs/newBlog', blog).pipe(map(res => res));
    }

    // Function to like a blog post
    likePost(id) {
        const postData = { id: id };
        return this.http.put(this.domain + 'blogs/likePost/', postData).pipe(map(res => res));
    }

    // Function to dislike a blog post
    dislikePost(id) {
        const postData = { id: id };
        return this.http.put(this.domain + 'blogs/dislikePost/', postData).pipe(map(res => res));
    }

    // Function to update a blog post
    editBlog(blog) {
        return this.http.put(this.domain + 'blogs/updatePost/', blog).pipe(map(res => res));
    }
    // Function to confirm a blog post
    confirmBlog(id) {
        const postData = { id: id };
        return this.http.put(this.domain + 'blogs/confirm/', postData).pipe(map(res => res));
    }

}

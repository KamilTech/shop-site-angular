import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

    domain = 'http://localhost:8080/'; // Development Domain - Not Needed in Production

    constructor(
        private http: HttpClient,
        private sanitizer: DomSanitizer
    ) { }

    // Function to create new blog post
    newBlog(blog) {
        return this.http.post(this.domain + 'blogs/post', blog).pipe(map(res => res));
    }

    // Function to delete blog
    deletePost(id) {
        return this.http.delete(this.domain + 'blogs/post/' + id).pipe(map(res => res));
    }

    // Function to update a blog post
    editBlog(blog) {
        return this.http.put(this.domain + 'blogs/post/', blog).pipe(map(res => res));
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

    // Function to confirm a blog post
    confirmBlog(id) {
        const postData = { id: id };
        return this.http.put(this.domain + 'blogs/confirm/', postData).pipe(map(res => res));
    }
    // Function to post new comment
    postComment(id, comment) {
        const postComment = {
            id: id,
            comment: comment
        };
        return this.http.post(this.domain + 'blogs/comment', postComment).pipe(map(res => res));
    }
    // Function to like comment
    likeComment(id, commentId) {
        const postLike = {
            id: id,
            commentId: commentId
        };
        return this.http.put(this.domain + 'blogs/likeComment', postLike).pipe(map(res => res));
    }
    // Function to get user post
    getUserPost() {
        return this.http.get(this.domain + 'blogs/getUserPost').pipe(map(res => res));
    }

    // Function to upload image
    uploadImage(formData) {
        return this.http.post(this.domain + 'blogs/image', formData).pipe(map(res => res));
    }
    // Function to get image
    getImage() {
        return this.http.get(this.domain + 'blogs/image', {responseType: 'blob'}).pipe(map(blob => {
          let urlCreator = window.URL;
          return this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(blob));
        }));
    }
}

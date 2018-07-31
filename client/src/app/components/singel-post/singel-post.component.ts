import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { Observable } from 'rxjs';
import { SnotifyService } from 'ng-snotify';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-singel-post',
  templateUrl: './singel-post.component.html',
  styleUrls: ['./singel-post.component.css']
})
export class SingelPostComponent implements OnInit {

    messageClass: string = '';
    message: string = '';
    currentUrl: any = '';
    blog;
    isLike: boolean;
    isOwn: boolean;
    form;
    processing: boolean = false;
    blogPosts: Array<any> = [];
    userImage: Array<any> = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private blogService: BlogService,
        private formBuilder: FormBuilder,
        private snotifyService: SnotifyService,
        private sanitizer: DomSanitizer
    ) {
            this.createNewCommentForm(); // Create new comment form on start up
        }

      // Function to create new comment form
    createNewCommentForm() {
        this.form = this.formBuilder.group({
            body: [{value: '', disabled: !this.authService.loggedIn()}, Validators.compose([
                Validators.required,
                Validators.maxLength(200),
                Validators.minLength(2)
            ])]
        });
    }

    // Function to like a blog post
    likePost(event: any, id: any) {
        // Service to like a blog post
        event.target.classList.toggle('is-active');
        this.blogService.likePost(id).subscribe(data => {
            this.getPost(false); // Refresh blogs after like
        });
    }

    checkLike(): void {
        const user = JSON.parse(localStorage.getItem('user'));
        this.isLike = this.blog.likedBy.includes(user.username);
    }
    // Checking if comment belong to the user
    ifLike(data) {
         const user = JSON.parse(localStorage.getItem('user'));
         if (user) {
             if (data.commentator === user.username) {
                 return 'own';
             } else {
                return data.commentLikedBy.includes(user.username) ? 'like' : 'nolike';
             }
         } else {
             return null;
         }
     }
    
    checkWho(): void {
        const user = JSON.parse(localStorage.getItem('user'));
        this.isOwn = user.username === this.blog.createdBy;
    }

    // Function to disliked a blog post
    dislikePost(event: any, id: any): void {
        // Service to dislike a blog post
        event.target.classList.toggle('is-active');
        this.blogService.dislikePost(id).subscribe(data => {
            this.getPost(false); // Refresh blogs after dislike
        });
    }

    // Function to submit a new comment
    postComment(id): void {
        this.processing = true;
        this.form.get('body').disable(); // Disable body field
        const comment = this.form.get('body').value; // Comment field

        // Create observable for notification
        const sendData = Observable.create(observer => {
            // Function to save comment into database
            this.blogService.postComment(id, comment).subscribe(data => {
               // Check if GET request was success or not
                setTimeout(() => { // SetTimeout only for test
                    if (!data['success']) {
                        this.processing = false;
                        this.form.get('body').enable(); // Enable body field
                        // If false return error notification
                        observer.error({
                            title: 'Error',
                            body: data['message'],
                            config: { closeOnClick: true, timeout: 2000, showProgressBar: true }
                        });
                    } else {
                        // If true return success notification
                        observer.next({
                            title: 'Success',
                            body: data['message'],
                            config: { closeOnClick: true, timeout: 2000, showProgressBar: true }
                        });
                        observer.complete();
                        this.form.get('body').enable();
                        this.processing = false;
                        this.form.reset(); // Reset all form fields
                        this.getPost(true);
                    }
                }, 1000);
            });
        });
        // Snotify Notifications
        this.snotifyService.async('Loading', sendData);
    }

    // Function to like comment
    likeComment(id, commentId): void {
        // Create observable for notification
        const sendData = Observable.create(observer => {
            // Function to save like into database
            this.blogService.likeComment(id, commentId).subscribe(data => {
                // Check if GET request was success or not
                setTimeout(() => { // SetTimeout only for test
                    if (!data['success']) {
                        // If false return error notification
                        observer.error({
                            title: 'Error',
                            body: data['message'],
                            config: { closeOnClick: true, timeout: 2000, showProgressBar: true }
                        });
                   } else {
                        this.getPost(false);
                        // If true return success notification
                        observer.next({
                            title: 'Success',
                            body: data['message'],
                            config: { closeOnClick: true, timeout: 2000, showProgressBar: true }
                        });
                        observer.complete();
                   }
                }, 500);
            });
        });
        
        if (this.authService.loggedIn()) {
            // Snotify Notifications
            this.snotifyService.async('Loading', sendData);
        } else {
            this.snotifyService.warning('Login to like', {
                timeout: 2000,
                showProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true
            });
        }
    }

    getPost(checkAll) {
        this.authService.getSingelPost(this.currentUrl.id).subscribe(data => {
            // Check if GET request was success or not
            if (!data['success']) {
                this.messageClass = 'alert alert-danger'; // Set bootstrap error class
                this.message = 'Blog not found.'; // Set error message
            } else {
                if (checkAll === true) {
                    this.blog = data['blog']; // Save blog object for use in HTML
                    console.log(this.blog);
                    this.blog.comments.map((com) => {
                        this.getImage(com.commentator).then(img => {
                            com.img = { img };
                        });
                    });
                    if (this.authService.loggedIn() === true) {
                        this.checkLike();
                        this.checkWho();
                    }
                } else {
                    this.blog.comments.map((item) => {
                        for (let i = 0; i < data['blog'].comments.length; i++) { 
                            if (item._id ===  data['blog'].comments[i]._id) {
                                item.commentlikes = data['blog'].comments[i].commentlikes;
                                item.commentLikedBy = data['blog'].comments[i].commentLikedBy;
                            }
                        }
                    }); // Save blog object for use in HTML
                }
            }
        });
    }

    getImage(username) {
        return new Promise(resolve => {
            this.authService.getImage(username).subscribe(data => {
                resolve(data);
            });
        });        
    }

    getBlog() {
        this.authService.getAllBlogs(true).subscribe(data => {
            if (!data['success']) {
                this.messageClass = 'alert alert-danger'; // Set bootstrap error class
                this.message = 'Blog not found.'; // Set error message
            } else {
                for (let i = 0; i < 3; i++) { this.blogPosts.push(data['blogs'][i]) };
                this.messageClass = null;
                this.message = null;
            }
        });
    }

    ngOnInit() {
        this.currentUrl = this.activatedRoute.snapshot.params; // When component loads, grab the id
        // Function to GET current blog with id in params
        this.getPost(true);
        this.getBlog();
    }

}

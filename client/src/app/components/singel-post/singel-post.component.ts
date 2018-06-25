import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';

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

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private blogService: BlogService,
        private formBuilder: FormBuilder
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
            this.getPost(); // Refresh blogs after like
        });
    }

    checkLike() {
        const user = JSON.parse(localStorage.getItem('user'));
        this.isLike = this.blog.likedBy.includes(user.username);
    }

    checkWho() {
        const user = JSON.parse(localStorage.getItem('user'));
        this.isOwn = user.username === this.blog.createdBy;
    }

    // Function to disliked a blog post
    dislikePost(event: any, id: any) {
        // Service to dislike a blog post
        event.target.classList.toggle('is-active');
        this.blogService.dislikePost(id).subscribe(data => {
            this.getPost(); // Refresh blogs after dislike
        });
    }

    // Function to submit a new comment
    postComment(id) {
        this.processing = true;
        const comment = this.form.get('body').value; // Comment field

        this.blogService.postComment(id, comment).subscribe(data => {
           // Check if GET request was success or not
           if (!data['success']) {
                this.processing = false;
                this.messageClass = 'alert alert-danger'; // Set bootstrap error class
                this.message = data['message']; // Set error message
           } else {
                this.processing = false;
                this.form.reset(); // Reset all form fields
                this.getPost();
                this.messageClass = 'alert alert-success'; // Return success class
                this.message = data['message']; // Return success message
           }
        });
    }

    // Function to like comment
    likeComment(id, commentId) {
        this.blogService.likeComment(id, commentId).subscribe(data => {
            // Check if GET request was success or not
           if (!data['success']) {
                this.messageClass = 'alert alert-danger'; // Set bootstrap error class
                this.message = data['message']; // Set error message
           } else {
                this.getPost();
                this.messageClass = 'alert alert-success'; // Return success class
                this.message = data['message']; // Return success message
           }
        });
    }

    getPost() {
        this.authService.getSingelPost(this.currentUrl.id).subscribe(data => {
            // Check if GET request was success or not
            if (!data['success']) {
                this.messageClass = 'alert alert-danger'; // Set bootstrap error class
                this.message = 'Blog not found.'; // Set error message
            } else {
                this.blog = data['blog']; // Save blog object for use in HTML
                if (this.authService.loggedIn() === true) {
                    this.checkLike();
                    this.checkWho();
                }
            }
        });
    }

    ngOnInit() {
        this.currentUrl = this.activatedRoute.snapshot.params; // When component loads, grab the id
        // Function to GET current blog with id in params
        this.getPost();
    }

}

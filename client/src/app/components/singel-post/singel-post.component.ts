import { Component, OnInit } from '@angular/core';
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
    
    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private blogService: BlogService
    ) { }
    
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

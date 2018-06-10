import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-admin-post',
  templateUrl: './admin-post.component.html',
  styleUrls: ['./admin-post.component.css']
})
export class AdminPostComponent implements OnInit {

    blogPosts: Array<any> = [];
    messageClass;
    message;
    loading = true;

    constructor(
        private authService: AuthService,
        private blogService: BlogService
    ) {

    }

    // Function to get all blogs from the database
    getAllBlogs() {
    this.blogPosts = [];
    // Function to GET all blogs from database
        this.authService.getAllBlogs().subscribe(data => {
          data['blogs'].map(e => e.isApproved === false && this.blogPosts.push(e));
        });
    }

    toConfirm(blogId) {
        this.loading = true;
        this.blogService.confirmBlog(blogId).subscribe(data => {
          // Check if GET request was success or not
          if (!data['success']) {
            this.messageClass = 'alert alert-danger'; // Set bootstrap error class
            this.message = data['message']; // Set error message
          } else {
            this.messageClass = 'alert alert-success'; // Set success bootstrap class
            this.message = data['message']; // Set success message
            this.loading = false; // Allow loading of blog form
            this.blogPosts = [];
            this.getAllBlogs();
          }
        });
    }

    ngOnInit() {
        this.getAllBlogs();
    }

}

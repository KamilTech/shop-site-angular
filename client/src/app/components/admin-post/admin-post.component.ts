import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { Observable } from 'rxjs';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-admin-post',
  templateUrl: './admin-post.component.html',
  styleUrls: ['./admin-post.component.css']
})
export class AdminPostComponent implements OnInit {

    blogPosts: Array<any> = [];
    loading = true;

    constructor(
        private authService: AuthService,
        private blogService: BlogService,
        private snotifyService: SnotifyService
    ) {}

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

        // Create observable for notification
        const sendData = Observable.create(observer => {
            setTimeout(() => { // SetTimeout only for test
                this.blogService.confirmBlog(blogId).subscribe(data => {
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
                        // If true return success notification
                        observer.next({
                            title: 'Success',
                            body: data['message'],
                            config: { closeOnClick: true, timeout: 2000, showProgressBar: true }
                        });
                        observer.complete();
                        this.loading = false; // Allow loading of blog form
                        this.blogPosts = [];
                        this.getAllBlogs();
                      }
                  }, 500);
                });
            });
        });
        // Snotify Notifications
        this.snotifyService.async('Loading', sendData);
    }

    ngOnInit() {
        this.getAllBlogs();
    }

}

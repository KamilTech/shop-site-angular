import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { Observable } from 'rxjs';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username = '';
  email = '';
  p: number = 1;
  posts: Array<any> = [];
  message;

  constructor(
   private authService: AuthService,
   private blogService: BlogService,
   private snotifyService: SnotifyService
  ) { }

  getUserPost() {
      this.blogService.getUserPost().subscribe(data => {
          if (!data['success']) {
              this.posts = [];
              this.message = data['message'];
          } else {
              this.posts = [];
              this.posts = data['posts'];
          }
      });
  }

  deletePost(id) {
    // Create observable for notification
    const sendData = Observable.create(observer => {
        this.blogService.deletePost(id).subscribe(data => {
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
                    this.getUserPost();
                }
            }, 500);
        });
    });
    // Snotify Notifications
    this.snotifyService.async('Loading', sendData);
  }

  ngOnInit() {
    // Once component loads, get user's data to display on profile
    this.authService.getProfile().subscribe(profile => {
      this.username = profile['user'].username; // Set username
      this.email = profile['user'].email; // Set e-mail
    });
    this.getUserPost();
  }

}

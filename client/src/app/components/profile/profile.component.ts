import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';

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
   private blogService: BlogService
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

  ngOnInit() {
    // Once component loads, get user's data to display on profile
    this.authService.getProfile().subscribe(profile => {
      this.username = profile['user'].username; // Set username
      this.email = profile['user'].email; // Set e-mail
    });
    this.getUserPost();
  }

}

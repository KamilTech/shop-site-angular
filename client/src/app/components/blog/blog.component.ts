import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})

export class BlogComponent implements OnInit {

    blogPosts: Array<any> = [];
    page: number = 1;
    biggest: any;

  constructor(
    private authService: AuthService,
    private snotifyService: SnotifyService
  ) { }

    // Function to get all blogs from the database
    getAllBlogs() {
        this.authService.getAllBlogs(true).subscribe(data => {
          this.blogPosts = data['blogs'];
          this.biggest = 0;
          this.blogPosts.map((e) => {
              if (e.likes > this.biggest) { this.biggest = e; }
          });
        }, err => {
            this.snotifyService.error("Can't get item... :(", {
                timeout: 10000,
                showProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true
            });
        });
    }

  ngOnInit() {
      this.getAllBlogs();
  }

}

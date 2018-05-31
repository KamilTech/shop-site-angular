import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})

export class BlogComponent implements OnInit {

    blogPosts: Array<any> = [];

  constructor(
    private authService: AuthService
  ) { }

    // Function to get all blogs from the database
    getAllBlogs() {
    // Function to GET all blogs from database
        this.authService.getAllBlogs().subscribe(data => {
          data['blogs'].map(e => e.isApproved === false && this.blogPosts.push(e));
          console.log(this.blogPosts);
        });
    }

  ngOnInit() {
      this.getAllBlogs();
  }

}

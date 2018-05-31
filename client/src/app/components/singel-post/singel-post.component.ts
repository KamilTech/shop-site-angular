import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
    
    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService
    ) { }

    likebtn(event: any) {
        event.target.classList.toggle('is-active');
    }

    ngOnInit() {
        this.currentUrl = this.activatedRoute.snapshot.params; // When component loads, grab the id
        // Function to GET current blog with id in params
        this.authService.getSingelPost(this.currentUrl.id).subscribe(data => {
            // Check if GET request was success or not
            if (!data['success']) {
                this.messageClass = 'alert alert-danger'; // Set bootstrap error class
                this.message = 'Blog not found.'; // Set error message
            } else {
                this.blog = data['blog']; // Save blog object for use in HTML
                console.log(this.blog);
            }
        });
    }

}

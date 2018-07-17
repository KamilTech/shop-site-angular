import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { SnotifyService } from 'ng-snotify';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  messageClass;
  message;
  form;
  processing = false;
  currentUrl;
  blog;
  loading: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snotifyService: SnotifyService
  ) {
    this.createNewBlogForm(); // Create new blog form on start up
  }

  // Function to create new blog form
  createNewBlogForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(10000),
        Validators.minLength(5)
      ])],
      tag: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3),
        this.tagValidation
      ])]
    });
  }

  // Enable new blog form
  enableFormNewBlogForm() {
    this.form.get('title').enable(); // Enable title field
    this.form.get('body').enable(); // Enable body field
    this.form.get('tag').enable(); // Enable body field
  }

  // Disable new blog form
  disableFormNewBlogForm() {
    this.form.get('title').disable(); // Disable title field
    this.form.get('body').disable(); // Disable body field
    this.form.get('tag').disable(); // Disable body field
  }

  // Validation for title
  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
      return null; // Return valid
    } else {
      return { 'alphaNumericValidation': true }; // Return error in validation
    }
  }

  tagValidation(controls) {
    const regExp = new RegExp(/^(?!.*?\s{2})[A-Za-z ]{1,50}$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
      return null; // Return valid
    } else {
      return { 'tagValidation': true }; // Return error in validation
    }
  }

  // Function to Submit Update
  updateBlogSubmit() {
    this.processing = true; // Lock form fields
    // Function to send blog object to backend
    const blog = {
      _id: this.currentUrl.id,
      title: this.form.get('title').value, // Title field
      body: this.form.get('body').value, // Body field
      tags: ((val) => {
          const tags = val.split(' ');
          return tags;
      })(this.form.get('tag').value)
    };

    // Create observable for notification
    const sendData = Observable.create(observer => {
        this.blogService.editBlog(blog).subscribe(data => {
          // Check if PUT request was a success or not
            setTimeout(() => { // SetTimeout only for test
                if (!data['success']) {
                    // If false return error notification
                    observer.error({
                        title: 'Error',
                        body: data['message'],
                        config: { closeOnClick: true, timeout: 2000, showProgressBar: true }
                    });
                    this.processing = false; // Unlock form fields
                } else {
                    // If true return success notification
                    observer.next({
                        title: 'Success',
                        body: data['message'],
                        config: { closeOnClick: true, timeout: 2000, showProgressBar: true }
                    });
                    observer.complete();
                    // After two seconds, navigate back to blog page
                    setTimeout(() => {
                      this.router.navigate(['/blog']); // Navigate back to route page
                    }, 2000);
                }
            }, 500);
        }, err => {
            this.messageClass = 'alert alert-danger'; // Set bootstrap error class
            this.message = 'Something went wrong.'; // Set error message
        });
    });
    // Snotify Notifications
    this.snotifyService.async('Loading', sendData);
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
        this.form.controls['title'].setValue(this.blog.title);
        this.form.controls['body'].setValue(this.blog.body);
        this.form.controls['tag'].setValue(this.blog.tags.join().replace(/,/g , " "));
        this.loading = false; // Allow loading of blog form
      }
    }, err => {
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = 'Something went wrong.'; // Set error message
    });
  }

}

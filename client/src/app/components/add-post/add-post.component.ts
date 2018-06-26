import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { Observable } from 'rxjs';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  form;
  processing = false;
  username;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService,
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

  // Function to submit a new blog post
    onBlogSubmit() {
        this.processing = true; // Disable submit button
        this.disableFormNewBlogForm(); // Lock form
        // Create blog object from form fields
        const blog = {
          title: this.form.get('title').value, // Title field
          body: this.form.get('body').value, // Body field
          createdBy: this.username, // CreatedBy field
          tags: ((val) => {
              let tags = val.split(" ");
              return tags;
          })(this.form.get('tag').value)
        };
        // Create observable for notification
        const sendData = Observable.create(observer => {
            // Function to save blog into database
            this.blogService.newBlog(blog).subscribe(data => {
                // Check if blog was saved to database or not
                setTimeout(() => { // SetTimeout only for test
                    if (!data['success']) {
                        // If false return error notification
                        observer.error({
                            title: 'Error',
                            body: data['message'],
                            config: { closeOnClick: true, timeout: 2000, showProgressBar: true }
                        });
                        this.processing = false; // Enable submit button
                        this.enableFormNewBlogForm(); // Enable form
                    } else {
                        // If true return success notification
                        observer.next({
                            title: 'Success',
                            body: data['message'],
                            config: { closeOnClick: true, timeout: 2000, showProgressBar: true }
                        });
                        observer.complete();
                        this.processing = false; // Enable submit button
                        this.form.reset(); // Reset all form fields
                        this.enableFormNewBlogForm(); // Enable the form fields
                    }
                }, 1000);
            });
        });
        // Snotify Notifications
        this.snotifyService.async('Loading', sendData);
    }

  ngOnInit() {
    // Get profile username on page load
    this.authService.getProfile().subscribe(profile => {
      this.username = profile['user'].username; // Used when creating new blog posts and comments
    });
  }
    
}

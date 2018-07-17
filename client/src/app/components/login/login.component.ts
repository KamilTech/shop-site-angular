import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { Observable } from 'rxjs';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  messageClass;
  message;
  processing = false;
  form: FormGroup;
  previousUrl;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard,
    private snotifyService: SnotifyService
  ) {
    this.createForm(); // Create Login Form when component is constructed
  }

  // Function to create login form
  createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required], // Username field
      password: ['', Validators.required] // Password field
    });
  }

  // Function to disable form
  disableForm() {
    this.form.controls['username'].disable(); // Disable username field
    this.form.controls['password'].disable(); // Disable password field
  }

  // Function to enable form
  enableForm() {
    this.form.controls['username'].enable(); // Enable username field
    this.form.controls['password'].enable(); // Enable password field
  }

  onLoginSubmit() {
    this.processing = true; // Used to submit button while is being processed
    this.disableForm(); // Disable form while being process
    // Create user object from user's input
    const user = {
      username: this.form.get('username').value,
      password: this.form.get('password').value
    };
    // Create observable for notification
    const sendData = Observable.create(observer => {
        // Function to send login data to API
        this.authService.login(user).subscribe(data => {
          // Check if response was a success or error
            setTimeout(() => { // SetTimeout only for test
                if (!data['success']) {
                    // If false return error notification
                    observer.error({
                        title: 'Error',
                        body: data['message'],
                        config: { closeOnClick: true, timeout: 5000, showProgressBar: true }
                    });
                    this.processing = false; // Enable submit button
                    this.enableForm(); // Enable form for editting
                } else {
                    // If true return success notification
                    observer.next({
                        title: 'Success',
                        body: data['message'],
                        config: { closeOnClick: true, timeout: 1000, showProgressBar: true }
                    });
                    observer.complete();
                    // Function to store user's token in client local storage
                    this.authService.storeUserData(data['token'], data['user']);
                    // After 2 seconds, redirect to dashboard page
                    setTimeout(() => {
                        // Check if user was redirected or logging in for first time
                        if (this.previousUrl) {
                            this.router.navigate([this.previousUrl]); // Redirect to page they were trying to view before
                        } else {
                            this.router.navigate(['/dashboard']); // Navigate to dashboard view
                        }
                    }, 1000);
                }
            }, 1000);
        }, err => {
            this.snotifyService.error("Something went wrong :(", {
                timeout: 10000,
                showProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true
            });
        });
    });
    // Snotify Notifications
    this.snotifyService.async('Loading', sendData);
  }

  ngOnInit() {
    // On page load, check if user was redirected to login
    if (this.authGuard.redirectUrl) {
      this.messageClass = 'alert alert-danger'; // Set error message: need to login
      this.message = 'You must be logged in to view that page.'; // Set message
      this.previousUrl = this.authGuard.redirectUrl; // Set the previous URL user was redirected from
      this.authGuard.redirectUrl = undefined; // Erase previous URL
    }
  }

}

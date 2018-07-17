import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  message;
  messageClass;
  processing = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm(); // Create Angular 2 Form when component loads
  }

  // Function to create registration form
  createForm() {
    this.form = this.formBuilder.group({
      // Email Input
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail // Custom validation
      ])],
      // Username Input
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUsername // Custom validation
      ])],
      // Password Input
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword // Custom validation
      ])],
      // Confirm Password Input
      confirm: ['', Validators.required] // Field is required
    }, { validator: this.matchingPasswords('password', 'confirm') }); // Add custom validator to form for matching passwords
  }

  // Function to disable the registration form
  disableForm() {
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }

  // Function to enable the registration form
  enableForm() {
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }

  validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateEmail': true };
    }
  }

  validateUsername(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateUsername': true };
    }
  }

  validatePassword(controls) {
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validatePassword': true };
    }
  }

  // Funciton to ensure passwords match
  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value) {
        return null;
      } else {
        return { 'matchingPasswords': true };
      }
    };
  }

    onRegisterSubmit() {
        this.processing = true; // Used to notify HTML that form is in processing, so that it can be disabled
        this.disableForm(); // Disable the form
        // Create user object form user's inputs
        const user = {
            email: this.form.get('email').value,
            username: this.form.get('username').value,
            password: this.form.get('password').value
        };

        // Function from authentication service to register user
        this.authService.registerUser(user).subscribe(data => {
        // Resposne from registration attempt
            if (!data['success']) {
                this.messageClass = 'alert alert-danger'; // Set an error class
                this.message = data['message']; // Set an error message
                this.processing = false; // Re-enable submit button
                this.enableForm(); // Re-enable form
            } else {
                this.messageClass = 'alert alert-success'; // Set a success class
                this.message = data['message']; // Set a success message
                // After 2 second timeout, navigate to the login page
                setTimeout(() => {
                    this.router.navigate(['/login']); // Redirect to login view
                }, 2000);
            }
        }, err => {
            this.messageClass = 'alert alert-success'; // Set a success class
            this.message = 'Something went wrong :('; // Set a success message
        });
    }

      // Function to check if e-mail is taken
      checkEmail() {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (regExp.test(this.form.value['email'])) {
            // Function from authentication file to check if e-mail is taken
            this.authService.checkEmail(this.form.get('email').value).subscribe(data => {
                // Check if success true or false was returned from API
                if (!data['success']) {
                    this.emailValid = false;
                    this.emailMessage = data['message'];
                } else {
                    this.emailValid = true;
                    this.emailMessage = data['message'];
                }
            });
        } else {
            this.emailMessage = null;
        }
      }

    // Function to check if username is available
    checkUsername() {
        if (this.form.value['username'].length > 2) {
             // Function from authentication file to check if username is taken
            this.authService.checkUsername(this.form.get('username').value).subscribe(data => {
              // Check if success true or success false was returned from API
              if (!data['success']) {
                this.usernameValid = false; // Return username as invalid
                this.usernameMessage = data['message']; // Return error message
              } else {
                this.usernameValid = true; // Return username as valid
                this.usernameMessage = data['message']; // Return success message
              }
            });
        } else {
            this.usernameMessage = null;
        }
    }
  ngOnInit() {
  }

}

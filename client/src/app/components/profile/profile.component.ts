import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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
  form: FormGroup;
  info;
  imageToShow: any;
  isImageLoading;

  constructor(
   private authService: AuthService,
   private blogService: BlogService,
   private snotifyService: SnotifyService,
   private formBuilder: FormBuilder
  ) { 
    this.createForm();
  }

    // Function to create login form
    createForm() {
        this.form = this.formBuilder.group({
            file: ['', Validators.required], // Username field
        });
    }

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

    getImageFromService() {
        this.isImageLoading = true;
        this.blogService.getImage().subscribe(data => {
            this.imageToShow = data;
        });
    }

    onSubmit() {
        this.blogService.uploadImage(this.info).subscribe(data => {
            console.log(data);
            this.getImageFromService();
        });
    }

    fileChangeEvent(event) {
        const fileList: FileList = event.target.files,
              file: File = fileList[0],
              formData: FormData = new FormData();
        formData.append('avatar', file, file.name);
        this.info = formData;
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
    this.getImageFromService();
  }

}

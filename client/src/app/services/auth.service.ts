import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import isEmpty from 'lodash/isEmpty';

@Injectable({
  providedIn: 'root'
})
export class AuthService  {

    domain = 'http://localhost:8080'; // Development Domain - Not Needed in Production
    authToken;
    user;
    options;
    storageItem;
    private messageSource = new BehaviorSubject(null);
    currentMessage = this.messageSource.asObservable();

  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService,
    private sanitizer: DomSanitizer
  ) { }

    @Output() change: EventEmitter<boolean> = new EventEmitter();

    getItem() {
        this.storageItem = JSON.parse(localStorage.getItem("items"));
        this.change.emit(this.storageItem);
    }

    changeMessage(message: string) {
        this.messageSource.next(message);
    }

    // Function to get token from client local storage
    loadToken() {
        this.authToken = localStorage.getItem('token'); // Get token and asssign to variable to be used elsewhere
    }

    registerUser(user) {
        return this.http.post(this.domain + '/authentication/register', user).pipe(map(res => res));
    }
    // Function to check if e-mail is taken
    checkEmail(email) {
        return this.http.get(this.domain + '/authentication/checkEmail/' + email).pipe(map(res => res));
    }
    // Function to check if username is taken
    checkUsername(username) {
        return this.http.get(this.domain + '/authentication/checkUsername/' + username).pipe(map(res => res));
    }
    // Function to login user
    login(user) {
        return this.http.post(this.domain + '/authentication/login', user).pipe(map(res => res));
    }

    // Function to store user's data in client local storage
    storeUserData(token, user) {
        localStorage.setItem('token', token); // Set token in local storage
        localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage as string
        this.authToken = token; // Assign token to be used elsewhere
        this.user = user; // Set user to be used elsewhere
    }

    // Function to get data about user
    getProfile() {
        return this.http.get(this.domain + '/authentication/profile').pipe(map(res => res));
    }

    // Function to logout
    logout() {
        this.authToken = null; // Set token to null
        this.user = null; // Set user to null
        localStorage.clear(); // Clear local storage
    }
    loggedIn() {
        const token: string = this.jwtHelperService.tokenGetter();

        if (!token) {
          return false;
        }
        const tokenExpired: boolean = this.jwtHelperService.isTokenExpired(token);
        return !tokenExpired;
    }

    isAdmin() {
        const code = this.jwtHelperService.decodeToken(this.authToken);
        return code.admin;
    }
    // Function to get all blogs from the database
    getAllBlogs(info) {
        return this.http.get(this.domain + '/authentication/allBlogs/' + info).pipe(map(res => res));
    }

    // Function to get all blogs from the database
    getSingelPost(id) {
        return this.http.get(this.domain + '/authentication/singlePost/' + id).pipe(map(res => res));
    }

    // Function to get all items from the databse
    getAllItems(parameters) {
        // Initialize params Object
        let Params = new HttpParams();
        // Begin assigning parameters
        if (!isEmpty(parameters)) {
             for (let i = 0; i < parameters.length; i++) {
                Params = (isUndefined(parameters[i].name) || isNull(parameters[i].info)) ? Params : Params.append(`${parameters[i].name}`, parameters[i].info);
             }
        }
        // Begin assigning parameters
        return this.http.get(this.domain + '/authentication/allItems', {
            params: Params
        }).pipe(map(res => res));
    }

    // Function to get image
    getImage(user) {
        return this.http.get(this.domain + '/authentication/image/' + user, {responseType: 'blob'}).pipe(map(blob => {
          const urlCreator = window.URL,
                img64: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(blob));
          return img64;
        }));
    }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'

@Injectable({
  providedIn: 'root'
})
export class AuthService  {

    domain = 'http://localhost:8080'; // Development Domain - Not Needed in Production
    authToken;
    user;
    options;

  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService
  ) { }

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
          return false
        }
        const tokenExpired: boolean = this.jwtHelperService.isTokenExpired(token);
        return !tokenExpired
    }

    isAdmin() {
        const code = this.jwtHelperService.decodeToken(this.authToken);
        return code.admin;
    }

}

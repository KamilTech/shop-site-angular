import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
        private authService: AuthService,
        private router: Router,
        private snotifyService: SnotifyService
    ) { }

    smallCard(info) {
        const cart = document.getElementsByClassName('header-cart fixed-top ml-auto cart')[0],
              user = document.getElementsByClassName('header-cart fixed-top ml-auto user')[0];

          if (info === 'cart') {
              user.classList.remove('cart-active');
              cart.classList.toggle('cart-active');
          } else if (info === 'user') {
              cart.classList.remove('cart-active');
              user.classList.toggle('cart-active');
          }
    }

  // Function to logout user
  onLogoutClick() {
    this.authService.logout(); // Logout user
     this.snotifyService.success('Logout success', {
        timeout: 2000,
        showProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true
    });
    this.router.navigate(['/']); // Navigate back to home page
  }

  ngOnInit() {
  }

}

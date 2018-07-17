import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    storageItems: Array<any> = [];
    p: number = 1;
    totalPrice: number;

  constructor(
        private authService: AuthService,
        private router: Router,
        private snotifyService: SnotifyService,
        private e: ElementRef
    ) { }

    smallCard(info) {
        const cart = this.e.nativeElement.getElementsByClassName('header-cart fixed-top ml-auto cart')[0],
              user = this.e.nativeElement.getElementsByClassName('header-cart fixed-top ml-auto user')[0];

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

    sumPrice() {
        if (this.storageItems !== null && this.storageItems.length > 0) {
            this.storageItems.map(e => this.totalPrice += (parseInt(e.price) * parseInt(e.quantity)));
        }
    }

    getItems() {
        this.storageItems = JSON.parse(localStorage.getItem('items'));
        this.sumPrice();
    }

    checkEmmit() {
        this.authService.change.subscribe(data => {
            this.storageItems = data;
            this.totalPrice = 0;
            this.sumPrice();
        });
    }

    ngOnInit() {
        this.getItems();
        this.checkEmmit();
    }
}

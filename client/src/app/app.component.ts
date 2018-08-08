import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
    constructor(private router: Router) { }

    onClickedOutside() {
        const cart = document.getElementsByClassName('header-cart fixed-top ml-auto cart')[0],
              user = document.getElementsByClassName('header-cart fixed-top ml-auto user')[0];

              user.classList.remove('cart-active');
              cart.classList.remove('cart-active');
    }

    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
            return;
        }
            if (!(evt.url === "/post")) window.scrollTo(0, 0)
        });
    }
}

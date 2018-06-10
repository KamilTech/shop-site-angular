import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
    
    shop;
    modalItem;
    shopStatic;
    quantity: number = 1;

  constructor(
    private authService: AuthService
  ) { }

    galleryStart() {
        function modaGallery() {
            'use strict';
            const current: HTMLImageElement = document.querySelector('.modal-image-main img'),
            imgs = Array.from(document.querySelectorAll('.modal-image-side img') as HTMLCollectionOf<HTMLImageElement>),
            opacity = '0.6',
            leftArrow = document.querySelector('.modal-image-main-arrow-left'),
            rightArrow = document.querySelector('.modal-image-main-arrow-right');

            // Checking functions and animation
            function checkIndex() {
                const tab = new Array();
                imgs.forEach(img => tab.push(img.src));
                return tab.indexOf(current.src);
            }

            function checkOpacity() {
                imgs.forEach(img => {
                    img.style.opacity = '1';
                    if (img.src === current.src) img.style.opacity = opacity;
                });
            }

            function animation() {
                current.classList.add('fade-in');
                setTimeout(() => current.classList.remove('fade-in'), 500);
            }

            // Arrows
            leftArrow.addEventListener('click', function(evt) {
                let currentIndex = checkIndex();
                if (currentIndex > 0) {
                    currentIndex--;
                    current.src = imgs[currentIndex].src;
                    animation();
                    checkOpacity();
                }
            });

            rightArrow.addEventListener('click', function(evt) {
                let currentIndex = checkIndex();
                if (currentIndex < imgs.length -1) {
                    currentIndex++;
                    current.src = imgs[currentIndex].src;
                    animation();
                    checkOpacity();
                }
            });

            // Adding click event to each imgs
            imgs.forEach(img => {
                img.addEventListener('click', imgClick);
                checkOpacity();        
            });

            function imgClick(e) {
                imgs.forEach(img => (img.style.opacity = '1'));
                current.src = e.target.src;
                animation();
                e.target.style.opacity = opacity;
            }
        }
        modaGallery();
    }

    likebtn(event: any) {
        event.target.classList.toggle('is-active');
    }

    checkItem(id) {
        this.quantity = 1;
        this.shop.map(e => {
            if (id === e._id) {
                this.modalItem = e;
                return;
            }
        });
    }
    
    sortPrice(start: number, end, ifAll?: boolean) {
        this.shop = this.shopStatic;
        if (ifAll === true) {
            this.getItems();
        } else {
            let shopArray = [];
            if (end === 'end') {
                this.shop.map(e => if (e.price >= start) shopArray.push(e));
            } else {
                if (start && end) {
                    this.shop.map(e => if (e.price >= start && e.price <= end) shopArray.push(e));
                }
            }
            this.shop = shopArray;
        }
    }

    getItems() {
        this.authService.getAllItems().subscribe(data => {
            if (data['success']) {
                this.shop = data['items'];
                this.shopStatic = data['items'];
            }
        });
    }
    
    quantityChange(value) {
       if (value === true) {
           this.quantity++
       } else {
           if (this.quantity !== 0) this.quantity--;
       }
    }

    ngOnInit() {
        this.getItems();
        this.galleryStart();
    }

}

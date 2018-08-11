import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

    shop;
    modalItem;
    shopStatic;
    quantity = 1;
    messageClass;
    message;
    sortBy = 1;
    pageShop = 1;
    selectedSize;
    selectedColor;
    paginate = {};
    site;
    search = [];
    category = 1;

  constructor(
    private authService: AuthService,
    private snotifyService: SnotifyService
  ) { }

    onChangeSize(value) {
        this.selectedSize = value;
    }

    onChangeColor(value) {
        this.selectedColor = value;
    }

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
    
    convertString(value: string, add) {
        return add ? (parseFloat(value) + parseFloat(add)).toFixed(2) : parseFloat(value).toFixed(2);
    }

    checkItem(id) {
        this.quantity = 1;
        this.shop.map(e => {
            if (id === e._id) {
                this.modalItem = e;
                return;
            }
        });
        this.selectedSize = this.modalItem.size[0];
        this.selectedColor = this.modalItem.color[0];
    }

    addItem() {
        const object = {
                itemId: this.modalItem._id,
                name: this.modalItem.name,
                price: parseInt(this.modalItem.price),
                quantity: this.quantity,
                selectSize: this.selectedSize,
                selectColor: this.selectedColor
            },
            items = JSON.parse(localStorage.getItem('items'));

        if (items) {
            if (items.find((items) => items.itemId === object.itemId)) {
                this.snotifyService.error('Currently you have this item in cart', 'Error');
                this.authService.getItem();
            } else {
                items.push(object);
                localStorage.setItem('items', JSON.stringify(items));
                this.snotifyService.success('Item was added', 'Success');
                this.authService.getItem();
            }
        } else {
            const array = [];
            array[0] = object;
            localStorage.setItem('items', JSON.stringify(array));
            this.snotifyService.success('Item was added', 'Success');
            this.authService.getItem();
        }
    }

    getItems(pagi? ) {
        // Here we will create query string and convey to service as array of object
        if (pagi && typeof pagi === 'object') {
            for (let j = 0; j < Object.keys(pagi).length; j++) {
                if (this.search.length === 0) {
                    this.search.push(pagi[j]);
                } else {
                    for (let i = 0; i < this.search.length; i++) {
                        if (this.search[i].name === pagi[j].name) {
                            this.search.splice(i, 1);
                            this.search.push(pagi[j]);
                        } else {
                            if (i === this.search.length - 1) {
                                this.search.push(pagi[j]);
                            }
                        }
                    }
                }
            }
        }
        this.authService.getAllItems(this.search).subscribe(data => {
            if (data['success']) {
                this.site = [];
                this.site = ((a, b) => {
                    const array = [];
                    let countSite = Math.floor(a / b);
                    if ((a % b) > 0) countSite++;
                    for (let i = 0; i < countSite; i++) {
                        array.push({
                            name: 'offset',
                            data: 9 * i
                        });
                    }
                    return array;
                })(data['count'], data['per_page']);
                this.shop = data['message'];
                this.shopStatic = data['message'];
            } else {
                this.snotifyService.error(data['message'], {
                    timeout: 10000,
                    showProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true
                });
            }
        }, err => {
            this.snotifyService.error("Can't get item... :(", {
                timeout: 10000,
                showProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true
            });
        });
    }

    quantityChange(value) {
       if (value === true) {
           this.quantity++;
       } else {
           if (this.quantity !== 1) { this.quantity--; }
       }
    }

    ngOnInit() {
        this.getItems();
        this.galleryStart();
    }

}

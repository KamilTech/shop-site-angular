import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { AuthService } from '../../services/auth.service';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    shop: Array<any> = [];
    blogs: Array<any> = [];
    timer = {};
    messageClass;
    message;
    counterEnd;
    public index = 5;
    public config: SwiperConfigInterface = {
        a11y: true,
        direction: 'horizontal',
        slidesPerView: 3,
        keyboard: true,
        mousewheel: true,
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets'
        },
        navigation: true,
        spaceBetween: 15,
        centeredSlides: true,
        breakpoints: {
            // when window width is <= 480px
            480: {
                slidesPerView: 1
            },
            640: {
                slidesPerView: 2
            },
            1024: {
                slidesPerView: 2
            }
        }
    };

    constructor(
        private authService: AuthService
    ) {}

    header() {
        $('.sd').click(function () {
            $('.hero, .content').addClass('scrolled');
        });

        $('.hero').mousewheel(function (e) {
            if (e.deltaY < 0) {
                $('.hero, .content').addClass('scrolled');
                return false;
            }
        });
        $(window).mousewheel(function (e) {
            if ($('.hero.scrolled').length) {
                if ($(window).scrollTop() == 0 && e.deltaY > 0) {
                    $('.hero, .content').removeClass('scrolled');
                }
            }
        });
    }

    getItems() {
        this.shop = [];
        this.authService.getAllItems().subscribe(data => {
            if (data['success']) {
                for (let i = 0; i < 12; i++) {
                    this.shop.push(data['items'][i]);
                }
            } else {
                this.messageClass = 'alert alert-danger'; // Return error class
                this.message = data['message']; // Return error message
            }
        }, (err) => {
                this.messageClass = 'alert alert-danger'; // Return error class
                this.message = err.message; // Return error message
        });
        this.authService.getAllBlogs(true).subscribe(data => {
            console.log(data);
            if (data['success']) {
                for (let i = 0; i < 3; i++) {
                    this.blogs.push(data['blogs'][i]);
                }
            } else {
                this.messageClass = 'alert alert-danger'; // Return error class
                this.message = data['message']; // Return error message
            }
        }, (err) => {
                this.messageClass = 'alert alert-danger'; // Return error class
                this.message = err.message; // Return error message
        });
    }

    getCounter() {
        const endDate = new Date(),
            currentDate = new Date();
        let diff;
        endDate.setDate(endDate.getDate() + 1);

        interval(1000).pipe(
            map(() => { diff = Date.parse(endDate.toString()) - Date.parse(new Date().toString())})).subscribe(() => {
            this.timer['hours'] = getHours(diff);
            this.timer['minutes'] = getMinutes(diff);
            this.timer['seconds'] = getSeconds(diff);
        });

        function getHours(t) {
            return Math.floor( (t / (1000 * 60 * 60)) % 24 );
        }

        function getMinutes(t) {
            return Math.floor( (t / 1000 / 60) % 60 );
        }

        function getSeconds(t) {
            return Math.floor( (t / 1000) % 60 );
        }
    }

  ngOnInit() {
      this.header();
      this.getItems();
      this.getCounter();
  }

}

import { Component, OnInit } from '@angular/core';
declare var jquery:any;
declare var $:any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { 
  }
    
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
    
    slick() {
        $('.slider').slick({
          dots: true,
          infinite: true,
          speed: 300,
          slidesToShow: 3,
          slidesToScroll: 1,
          centerMode: true,
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ]
        });
    }
//    
//    countTimer() {
//        let day = new Date(),
//            countDownDate = new Date(day);
//        countDownDate.setDate(day.getDate()+1);
//
//        let x = setInterval(function() {
//            let now = new Date().getTime(),
//                distance = countDownDate - now,
//                days = Math.floor(distance / (1000 * 60 * 60 * 24)),
//                hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
//                minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
//                seconds = Math.floor((distance % (1000 * 60)) / 1000);
//
//            document.getElementById("demo").innerHTML = days + "d " + hours + "h "
//            + minutes + "m " + seconds + "s ";
//            if (distance < 0) {
//                clearInterval(x);
//                document.getElementById("demo").innerHTML = "EXPIRED";
//            }
//        }, 1000);
//    }

  ngOnInit() {
      this.header();
      this.slick();
  }

}

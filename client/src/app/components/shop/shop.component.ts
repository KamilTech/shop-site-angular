import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  constructor() { }

    filterSelection(c) {
      let x, i;
      x = document.getElementsByClassName('column');
      if (c == 'all') c = '';
      for (i = 0; i < x.length; i++) {
        this.w3RemoveClass(x[i], 'show');
        if (x[i].className.indexOf(c) > -1) this.w3AddClass(x[i], "show");
      }
    }

    w3AddClass(element, name) {
      let i, arr1, arr2;
      arr1 = element.className.split(' ');
      arr2 = name.split(' ');
      for (i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {element.className += ' ' + arr2[i];}
      }
    }

    w3RemoveClass(element, name) {
      var i, arr1, arr2;
      arr1 = element.className.split(" ");
      arr2 = name.split(" ");
      for (i = 0; i < arr2.length; i++) {
        while (arr1.indexOf(arr2[i]) > -1) {
          arr1.splice(arr1.indexOf(arr2[i]), 1);     
        }
      }
      element.className = arr1.join(" ");
    }

    galleryStart() {
//        const btnContainer = document.getElementById('myBtnContainer'),
//              btns = btnContainer.getElementsByClassName('btn');
//        for (let i = 0; i < btns.length; i++) {
//            btns[i].addEventListener('click', function() {
//            const current = document.getElementsByClassName('active');
//            current[0].className = current[0].className.replace(' active', '');
//            this.className += ' active';
//          });
//        }
        
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
                    if (img.src === current.src) img.style.opacity = opacity   
                }
                );
            }
            
            function animation() {
                current.classList.add("fade-in");
                setTimeout(() => current.classList.remove("fade-in"), 500);
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
                    img.addEventListener("click", imgClick);
                    checkOpacity();                       
                }
            );

            function imgClick(e) {
              imgs.forEach(img => (img.style.opacity = '1'));
              current.src = e.target.src;
              animation();
              e.target.style.opacity = opacity;
            }
        }
        modaGallery();
    }
    
    modal(open) {
        const modal = document.querySelector('.modal'),
              modal2 = document.querySelector('.modal-overlay');
        if (open === true) {
            modal.classList.add("active");
            modal2.classList.add("active");
        } else {
            modal.classList.remove("active");
            modal2.classList.remove("active");
        }
    }

    likebtn(event: any) {
        event.target.classList.toggle('is-active');
    }

  ngOnInit() {
      this.filterSelection('all');
      this.galleryStart();
  }

}

import { Component, OnInit } from '@angular/core';
import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';
import { Router, NavigationEnd } from '@angular/router';

const slideLeft = [
    query(':leave', style({ position: 'absolute', left: 0, right: 0 ,transform: 'translate3d(0%,0,0)' }), {optional:true}),
    query(':enter', style({ position: 'absolute', left: 0, right: 0, transform: 'translate3d(-100%,0,0)' }), {optional:true}),
    group([
      query(':leave', group([
        animate('500ms cubic-bezier(.35,0,.25,1)', style({ transform: 'translate3d(100%,0,0)' })), // y: '-100%'
      ]), {optional:true}),
      query(':enter', group([
        animate('500ms cubic-bezier(.35,0,.25,1)', style({ transform: 'translate3d(0%,0,0)' })),
      ]), {optional:true})
    ])
  ]

const slideRight = [
    query(':leave', style({ position: 'absolute', left: 0, right: 0 , transform: 'translate3d(0%,0,0)'}), {optional:true}),
    query(':enter', style({ position: 'absolute', left: 0, right: 0, transform: 'translate3d(100%,0,0)'}), {optional:true}),

    group([
      query(':leave', group([
        animate('500ms cubic-bezier(.35,0,.25,1)', style({ transform: 'translate3d(-100%,0,0)' })), // y: '-100%'
      ]), {optional:true}),
      query(':enter', group([
        animate('500ms cubic-bezier(.35,0,.25,1)', style({ transform: 'translate3d(0%,0,0)' })),
      ]), {optional:true})
    ])
  ]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routerAnimations', 
    [
      transition('products => product-detail', slideRight),
      transition('product-detail => products', slideLeft),
    ])
  ]
})

export class AppComponent {
    prepareRouteTransition(outlet) {
        const animation = outlet.activatedRouteData['animation'] || {};
        return animation['value'] || null;
    }
    
    constructor(private router: Router) { }

    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            console.log(evt);
            if (!(evt.url === "/post")) window.scrollTo(0, 0)
        });
    }
}

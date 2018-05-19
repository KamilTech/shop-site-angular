import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-singel-post',
  templateUrl: './singel-post.component.html',
  styleUrls: ['./singel-post.component.css']
})
export class SingelPostComponent implements OnInit {

  constructor() { }

    likebtn(event: any) {
        event.target.classList.toggle('is-active');
    }

  ngOnInit() {
  }

}

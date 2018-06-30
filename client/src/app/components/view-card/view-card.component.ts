import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-view-card',
  templateUrl: './view-card.component.html',
  styleUrls: ['./view-card.component.css']
})
export class ViewCardComponent implements OnInit {

    storageItems: Array<any> = [];
    totalPrice: number;

    constructor(
        private authService: AuthService
    ) { }

    getItems() {
        this.totalPrice = 0;
        this.storageItems = JSON.parse(localStorage.getItem('items'));
        if (this.storageItems !== null && this.storageItems.length > 0) {
            this.storageItems.map(e => this.totalPrice += (parseInt(e.price) * parseInt(e.quantity)));
        }
    }

    quantityChange(id, value: number) {
        this.storageItems.map(e => {
            if (e.itemId == id) {
                if (value > 0) e.quantity = value;
            }
        });
        localStorage.setItem('items', JSON.stringify(this.storageItems));
        this.authService.getItem();
        this.getItems();
    }

    deleteItem(id) {
        const newArray = this.storageItems.filter(el => el.itemId !== id);
        localStorage.setItem('items', JSON.stringify(newArray));
        this.authService.getItem();
        this.getItems();
    }

  ngOnInit() {
      this.getItems();
  }

}

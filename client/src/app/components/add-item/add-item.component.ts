import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ShopService } from '../../services/shop.service';
import { Observable } from 'rxjs';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {

    form;
    processing = false;
    size;
    color;
    category;
    dropdownSettings = {};
    username;
    messageClass;
    message;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private shopService: ShopService,
    private snotifyService: SnotifyService
  ) {
    this.createNewBlogForm(); // Create new blog form on start up
  }

  // Function to create new blog form
  createNewBlogForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      price: ['', Validators.compose([
        Validators.required,
        this.priceValidation
      ])],
      describe: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(1000),
        Validators.minLength(5),
        this.describeValidation
      ])],
      smallDescribe: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(75),
        Validators.minLength(5),
        this.smallDescribeValidation
      ])],
      quantity: ['', Validators.compose([
        Validators.required,
        this.quantityValidation
      ])],
      tags: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(200),
        this.tagValidation
      ])],
      category: ['', Validators.compose([
        Validators.required
      ])],
      color: [],
      size: []
    });
  }

  // Enable new blog form
  enableFormNewItemForm() {
    this.form.get('name').enable();
    this.form.get('price').enable();
    this.form.get('describe').enable();
    this.form.get('tags').enable();
    this.form.get('size').enable();
    this.form.get('color').enable();
    this.form.get('quantity').enable();
    this.form.get('smallDescribe').enable();
  }

  // Disable new blog form
  disableFormNewItemForm() {
    this.form.get('name').disable();
    this.form.get('price').disable();
    this.form.get('describe').disable();
    this.form.get('tags').disable();
    this.form.get('size').disable();
    this.form.get('color').disable();
    this.form.get('quantity').disable();
    this.form.get('smallDescribe').disable();
  }

  quantityValidation(controls) {
    const regExp = new RegExp(/^[0-9]*$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
        return null; // Return valid
    } else {
        return { 'quantityValidation': true }; // Return error in validation
    } 
  }

  // Validation for name
  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
      return null; // Return valid
    } else {
      return { 'alphaNumericValidation': true }; // Return error in validation
    }
  }

  tagValidation(controls) {
    const regExp = new RegExp(/^(?!.*?\s{2})[A-Za-z ]{1,200}\S$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
      return null; // Return valid
    } else {
      return { 'tagValidation': true }; // Return error in validation
    }
  }

  priceValidation(controls) {
    const regExp = new RegExp(/^[0-9]{1,4}([,.][0-9]{1,2})?$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
      return null; // Return valid
    } else {
      return { 'priceValidation': true }; // Return error in validation
    }
  }

  describeValidation(controls) {
    const regExp = new RegExp(/^[^-\s][a-zA-Z0-9\s!?,.'-]+$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
      return null; // Return valid
    } else {
      return { 'describeValidation': true }; // Return error in validation
    }
  }

  smallDescribeValidation(controls) {
    const regExp = new RegExp(/^[^-\s][a-zA-Z0-9\s!?,.'-]+$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
      return null; // Return valid
    } else {
      return { 'smallDescribeValidation': true }; // Return error in validation
    }
  }

  onBlogSubmit() {
    this.processing = true; // Disable submit button
    this.disableFormNewItemForm(); // Lock form

    function returnArray(val) {
        const targetArray = val.split(" ");
        if (typeof targetArray !== 'undefined' && targetArray !== null) {
            return 0 < targetArray.length ? targetArray : false;
        } else {
            return false;
        }
    }

    function returnSelect(val) {
        const array = [];
        val.map(e => array.push(e.item_text));
        if (typeof array !== 'undefined' && array !== null) {
            return 0 < array.length ? array : false;
        } else {
            return false;
        }
    }
    // Create item object from form fields
    const item = {
        name: this.form.get('name').value, // Name field
        price: parseFloat(this.form.get('price').value), // Price field
        describe: this.form.get('describe').value, // Describe field
        quantity: this.form.get('quantity').value, // Quantity field
        smallDescribe: this.form.get('smallDescribe').value, // SmallDescribe field
        createdBy: this.username,
        tags: returnArray(this.form.get('tags').value), // Tags field
        size: returnSelect(this.form.get('size').value), // Size field
        color: returnSelect(this.form.get('color').value), // Color field
        category: returnSelect(this.form.get('category').value) // Category field
    };

    // Create observable for notification
    const sendData = Observable.create(observer => {
        // Function to save item into database
        this.shopService.newItem(item).subscribe(data => {
            // Check if item was saved to database or not
            setTimeout(() => { // SetTimeout only for test
                if (!data['success']) {
                    // If false return error notification
                    observer.error({
                        title: 'Error',
                        body: data['message'],
                        config: { closeOnClick: true, timeout: 5000, showProgressBar: true }
                    });
                    this.processing = false; // Enable submit button
                    this.enableFormNewItemForm(); // Enable form
                } else {
                    // If true return success notification
                    observer.next({
                        title: 'Success',
                        body: data['message'],
                        config: { closeOnClick: true, timeout: 2000, showProgressBar: true }
                    });
                    observer.complete();
                    // Clear form
                    this.processing = false; // Enable submit button
                    this.form.reset(); // Reset all form fields
                    this.enableFormNewItemForm(); // Enable the form fields
                }
            }, 1000);
        }, err => {
            this.snotifyService.error("Can't get item... :(", {
                timeout: 10000,
                showProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true
            });
        });
    });
    // Snotify Notifications
    this.snotifyService.async('Loading', sendData);
  }

  ngOnInit() {
    // Get profile username on page load
    this.authService.getProfile().subscribe(profile => {
      this.username = profile['user'].username;
    });

    this.size = [
        { item_id: 1, item_text: 'XS' },
        { item_id: 2, item_text: 'S' },
        { item_id: 3, item_text: 'M' },
        { item_id: 4, item_text: 'L' },
        { item_id: 5, item_text: 'XL' },
        { item_id: 6, item_text: 'XXL' },
        { item_id: 7, item_text: 'XXXL' },
        { item_id: 8, item_text: '4XL' }
    ];
    this.color = [
        { item_id: 1, item_text: 'red' },
        { item_id: 2, item_text: 'blue' },
        { item_id: 3, item_text: 'yellow' },
        { item_id: 4, item_text: 'green' },
        { item_id: 5, item_text: 'orange' },
        { item_id: 6, item_text: 'brown' },
        { item_id: 7, item_text: 'white' },
        { item_id: 9, item_text: 'black' },
        { item_id: 10, item_text: 'gold' },
        { item_id: 11, item_text: 'grey' }
    ];
    this.category = [
        { item_id: 1, item_text: 'women' },
        { item_id: 2, item_text: 'men' },
        { item_id: 3, item_text: 'accesories' }
    ];
    this.dropdownSettings = {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 4,
        allowSearchFilter: false
    };

  }

}

const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose

// Validate Function to check name length
let nameLengthChecker = (name) => {
  // Check if name exists
  if (!name) {
    return false; // Return error
  } else {
    // Check the length of name
    if (name.length < 5 || name.length > 50) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid name
    }
  }
};

// Validate Function to check if valid name format
let alphaNumericNameChecker = (name) => {
  // Check if title exists
  if (!name) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid name
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    return regExp.test(name); // Return regular expression test results (true or false)
  }
};

// Array of Title Validators
const nameValidators = [
  // First name Validator
  {
    validator: nameLengthChecker,
    message: 'Name must be more than 2 characters but no more than 50'
  },
  // Second name Validator
  {
    validator: alphaNumericNameChecker,
    message: 'Name must be alphanumeric'
  }
];


// Validate Function to check if valid price format
let alphaNumericPriceChecker = (price) => {
  // Check if price exists
  if (!price) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid price
    const regExp = new RegExp(/^[0-9]{1,4}([,.][0-9]{1,2})?$/);
    return regExp.test(price); // Return regular expression test results (true or false)
  }
};

// Array of price Validators
const priceValidators = [
  // Second price Validator
  {
    validator: alphaNumericPriceChecker,
    message: 'Invalid characters in the price field'
  }
];

// Validate Function to check describe length
let describeLengthChecker = (describe) => {
  // Check if describe exists
  if (!describe) {
    return false; // Return error
  } else {
    // Check the length of describe
    if (describe.length < 5 || describe.length > 1000) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid describe
    }
  }
};

// Validate Function to check if valid describe format
let alphaNumericDescribeChecker = (describe) => {
  // Check if describe exists
  if (!describe) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid describe
    const regExp = new RegExp(/^[^-\s][a-zA-Z0-9\s!?,.'-]+$/);
    return regExp.test(describe); // Return regular expression test results (true or false)
  }
};

// Array of describe Validators
const describeValidators = [
  // First describe Validator
  {
    validator: describeLengthChecker,
    message: 'Describe must be more than 5 characters but no more than 1000'
  },
  // Second describe Validator
  {
    validator: alphaNumericDescribeChecker,
    message: 'Describe must be alphanumeric'
  }
];

// Validate Function to check if valid size format
let sizeChecker = (size) => {
  // Check if size exists
  if (!size) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid size
    let flag = true;
    const regExp = new RegExp(/\b(XS|S|M|L|XL|XXL|XXXL|4XL)\b/);
    size.map(e => {
        if (regExp.test(e) === false) flag = false;
    }); // Return regular expression test results (true or false)
    return flag;
  }
};

// Array of size Validators
const sizeValidators = [
  {
    validator: sizeChecker,
    message: 'Invalid characters in the size field'
  }
];

// Validate Function to check if valid color format
let colorChecker = (color) => {
  // Check if color exists
  if (!color) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid color
    let flag = true;
    const regExp = new RegExp(/\b(red|blue|green|yellow|black|grey|orange|gold|brown|white)\b/);
    color.map(e => {
        if (regExp.test(e) === false) flag = false;
    }); // Return regular expression test results (true or false)
    return flag;
  }
};

// Array of size Validators
const colorValidators = [
  {
    validator: colorChecker,
    message: 'Invalid characters in the color field'
  }
];

// Validate Function to check small describe length
let smallDescribeLengthChecker = (smallDescribe) => {
  // Check if small describe exists
  if (!smallDescribe) {
    return false; // Return error
  } else {
    // Check the length of small describe
    if (smallDescribe.length < 5 || smallDescribe.length > 75) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid small describe
    }
  }
};

// Validate Function to check if valid small describe format
let alphaNumericSmallDescribeChecker = (smallDescribe) => {
  // Check if small describe exists
  if (!smallDescribe) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid small describe
    const regExp = new RegExp(/^[^-\s][a-zA-Z0-9\s!?,.'-]+$/);
    return regExp.test(smallDescribe); // Return regular expression test results (true or false)
  }
};

// Array of small describe Validators
const smallDescribeValidators = [
  // First small describe Validator
  {
    validator: smallDescribeLengthChecker,
    message: 'Small describe must be more than 5 characters but no more than 75'
  },
  // Second small describe Validator
  {
    validator: alphaNumericSmallDescribeChecker,
    message: 'Small describe must be alphanumeric'
  }
];

// Validate Function to check if category has valid format
let categoryChecker = (category) => {
  // Check if category exists
  if (!category) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid category
    let flag = true;
    const regExp = new RegExp(/\b(women|man|accesories)\b/);
    category.map(e => {
        if (regExp.test(e) === false) flag = false;
    }); // Return regular expression test results (true or false)
    return flag;
  }
};

// Array of size category
const categoryValidators = [
  {
    validator: categoryChecker,
    message: 'Invalid characters in the category field'
  }
];

const shopItem = new Schema({
    name: { type: String, required: true, validate: nameValidators },
    price: { type: String, required: true, validate: priceValidators },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    describe: { type: String, required: true, validate: describeValidators },
    smallDescribe: { type: String, required: true, validate: smallDescribeValidators },
    category: { type: Array, required: true, validate: categoryValidators },
    size: { type: Array, validate: sizeValidators },
    color: { type: Array, validate: colorValidators },
    likes: { type: Number, default: 0 },
    likedBy: { type: Array },
    sales: { type: String, default: 0 },
    tags: { type: Array },
    quantity: { type: Number, default: 0 },
    lastPurchase: { type: Date }
});

// Export Module/Schema
module.exports = mongoose.model('Shop', shopItem);
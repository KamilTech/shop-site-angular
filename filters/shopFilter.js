const Shop = require('../models/shop'); // Import Shop Model Schema
const qs = require('qs'); // A querystring parsing and stringifying library with some added security.
const _ = require('lodash'); // Lodash makes JavaScript easier by taking the hassle out of working with arrays, numbers, objects, strings, etc.

module.exports = function getFilters(req, res, next) {
    const availableFilters = Object.keys(Shop.schema.paths);
    const filters = qs.parse(req.query);
    
    req.filters = _.pickBy(filters, (value, key) => availableFilters.indexOf(key) > -1);
    next();
}
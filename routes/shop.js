const User = require('../models/user'); // Import User Model Schema
const Shop = require('../models/shop'); // Import Blog Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration

module.exports = (router) => {
    
    /* ===========================================================
    MIDDLEWARE - Used to check if the user is logged in as an administrator
    =========================================================== */
    router.use((req, res, next) => {
        // Get data of user who is logged in
        User.findOne({ _id: req.decoded.userId }, (err, user) => {
            // Check if error was found
            if (err) {
                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
            } else {
                if (!user) {
                    res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                    // Check if the user is admin
                    if (user.isAdmin === false) {
                        res.json({ success: false, message: 'You are not authorized to add new item.' }); // Return error message
                    } else {
                        if (user.isAdmin === true) {
                            next(); // Exit middleware
                        } else {
                            res.json({ success: false, message: 'You are not authorized to add new item.' }); // Return error message
                        }
                    }
                }
            }
        });
    });
    
    /* ===============================================================
        CREATE NEW ITEM
    =============================================================== */ 
    router.post('/newItem', (req, res) => {
        if (!req.body.name) {
            res.json({ success: false, message: 'Name item is required' });
        } else {
            if (!req.body.price) {
                res.json({ success: false, message: 'Price item is required' });
            } else {
                if (!req.body.createdBy) {
                    res.json({ success: false, message: 'Blog creator is required.' });
                } else {
                    if (!req.body.describe) {
                        res.json({ success: false, message: 'Describe is required' });
                    } else {
                        if (!req.body.smallDescribe) {
                            res.json({ success: false, message: 'Small describe is required' });
                        } else {
                            // Create item object for insertion into database
                            const item = new Shop({
                                name: req.body.name,
                                price: req.body.price,
                                createdBy: req.body.createdBy,
                                describe: req.body.describe,
                                quantity: req.body.quantity,
                                smallDescribe: req.body.smallDescribe
                            });
                            const size = req.body.size,
                                  color = req.body.color,
                                  tags = req.body.tags;
                            // Function that will be checking if req is array and if return is true then "req" will be inserting into array
                            if (typeof size !== 'undefined' && size !== null) {
                                0 < size.length && size.map(e => item.size.push(e));
                            }
                            if (typeof color !== 'undefined' && color !== null) {
                                0 < color.length && color.map(e => item.color.push(e));
                            }
                            if (typeof tags !== 'undefined' && tags !== null) {
                                0 < tags.length && tags.map(e => item.tags.push(e));
                            }
                            // Save item into database
                            item.save((err) => {
                                if (err) {
                                    // Check if error is a validation error
                                    if (err.errors) {
                                        // Check if validation error is in the name field
                                        if (err.errors.name) {
                                            res.json({ success: false, message: err.errors.name.message });
                                        } else {
                                            // Check if validation error is in the price field
                                            if (err.errors.price) {
                                                res.json({ success: false, message: err.errors.price.message });
                                            } else {
                                                if (err.errors.createdBy) {
                                                    res.json({ success: false, message: err.errors.createdBy.message });
                                                } else {
                                                    if (err.errors.describe) {
                                                        res.json({ success: false, message: err.errors.describe.message });
                                                    } else {
                                                        if (err.errors.quantity) {
                                                            res.json({ success: false, message: err.errors.quantity.message });
                                                        } else {
                                                            if (err.errors.color) {
                                                                res.json({ success: false, message: err.errors.color.message });
                                                            } else {
                                                                if (err.errors.size) {
                                                                    res.json({ success: false, message: err.errors.size.message });
                                                                } else {
                                                                    res.json({ success: false, message: err });
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        res.json({ success: false, message: err }); // Return error
                                    }
                                } else {
                                    res.json({ success: true, message: 'Item saved!' }); // Return success message
                                }
                            });
                        }
                    }
                }
            }
        }
    });
    
    
    return router;
};

const User = require('../models/user'); // Import User Model Schema
const Blog = require('../models/blog'); // Import Blog Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration

module.exports = (router) => {

    /* ===============================================================
       CREATE NEW BLOG
    =============================================================== */
    router.post('/newBlog', (req, res) => {
        // Check if blog title was provided
        if (!req.body.title) {
            res.json({
                success: false,
                message: 'Blog title is required.'
            }); // Return error message
        } else {
            // Check if blog body was provided
            if (!req.body.body) {
                res.json({
                    success: false,
                    message: 'Blog body is required.'
                }); // Return error message
            } else {
                // Check if blog's creator was provided
                if (!req.body.createdBy) {
                    res.json({
                        success: false,
                        message: 'Blog creator is required.'
                    }); // Return error
                } else {
                    if (!req.body.tags) {
                        res.json({
                            success: false,
                            message: 'Tags are required'
                        });
                    } else {
                        // Create the blog object for insertion into database
                        const blog = new Blog({
                            title: req.body.title, // Title field
                            body: req.body.body, // Body field
                            createdBy: req.body.createdBy, // CreatedBy field
                        });
                        // Function that will be checking if req is array and if return true then "req" will be inserting into array
                        if (typeof req.body.tags !== 'undefined' && req.body.tags !== null) {
                            0 < req.body.tags.length && req.body.tags.map(e => blog.tags.push(e));
                        }
                        // Save blog into database
                        blog.save((err) => {
                            // Check if error
                            if (err) {
                                // Check if error is a validation error
                                if (err.errors) {
                                    // Check if validation error is in the title field
                                    if (err.errors.title) {
                                        res.json({
                                            success: false,
                                            message: err.errors.title.message
                                        }); // Return error message
                                    } else {
                                        // Check if validation error is in the body field
                                        if (err.errors.body) {
                                            res.json({
                                                success: false,
                                                message: err.errors.body.message
                                            }); // Return error message
                                        } else {
                                            if (err.errors.tags) {
                                                res.json({
                                                    success: false,
                                                    message: err.errors.tags.message
                                                })
                                            } else {
                                                res.json({
                                                    success: false,
                                                    message: err
                                                }); // Return general error message
                                            }
                                        }
                                    }
                                } else {
                                    res.json({
                                        success: false,
                                        message: err
                                    }); // Return general error message
                                }
                            } else {
                                res.json({
                                    success: true,
                                    message: 'Post saved!'
                                }); // Return success message
                            }
                        });
                    }
                }
            }
        }
    });

    return router;
};

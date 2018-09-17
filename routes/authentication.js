const User = require('../models/user'); // Import User Model Schema
const Blog = require('../models/blog'); // Import Blog Model Schema
const Shop = require('../models/shop'); // Import Shop Model Schema
const getFilters = require('../filters/shopFilter'); // // Import filters
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration
const mongoose = require('mongoose'); // Node Tool for MongoDB
const GridFsStorage = require('multer-gridfs-storage'); // GridFS storage engine for Multer to store uploaded files directly to MongoDb.
const Grid = require('gridfs-stream'); // Easily stream files to and from MongoDB GridFS.

module.exports = (router) => {
    /* ==============
       Register Route
    ============== */
    router.post('/register', (req, res) => {
        // Check if email was provided
        if (!req.body.email) {
            res.json({
                success: false,
                message: 'You must provide an e-mail'
            }); // Return error
        } else {
            // Check if username was provided
            if (!req.body.username) {
                res.json({
                    success: false,
                    message: 'You must provide a username'
                }); // Return error
            } else {
                // Check if password was provided
                if (!req.body.password) {
                    res.json({
                        success: false,
                        message: 'You must provide a password'
                    }); // Return error
                } else {
                    // Create new user object and apply user input
                    let user = new User({
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        password: req.body.password
                    });
                    // Save user to database
                    user.save((err) => {
                        // Check if error occured
                        if (err) {
                            // Check if error is an error indicating duplicate account
                            if (err.code === 11000) {
                                res.json({
                                    success: false,
                                    message: 'Username or e-mail already exists'
                                }); // Return error
                            } else {
                                // Check if error is a validation rror
                                if (err.errors) {
                                    // Check if validation error is in the email field
                                    if (err.errors.email) {
                                        res.json({
                                            success: false,
                                            message: err.errors.email.message
                                        }); // Return error
                                    } else {
                                        // Check if validation error is in the username field
                                        if (err.errors.username) {
                                            res.json({
                                                success: false,
                                                message: err.errors.username.message
                                            }); // Return error
                                        } else {
                                            // Check if validation error is in the password field
                                            if (err.errors.password) {
                                                res.json({
                                                    success: false,
                                                    message: err.errors.password.message
                                                }); // Return error
                                            } else {
                                                res.json({
                                                    success: false,
                                                    message: err
                                                }); // Return any other error not already covered
                                            }
                                        }
                                    }
                                } else {
                                    res.json({
                                        success: false,
                                        message: 'Could not save user. Error: ',
                                        err
                                    }); // Return error if not related to validation
                                }
                            }
                        } else {
                            res.json({
                                success: true,
                                message: 'Acount registered!'
                            }); // Return success
                        }
                    });
                }
            }
        }
    });

    /* ============================================================
    Route to check if user's email is available for registration
    ============================================================ */
    router.get('/checkEmail/:email', (req, res) => {
        // Check if email was provided in paramaters
        if (!req.params.email) {
            res.json({
                success: false,
                message: 'E-mail was not provided'
            }); // Return error
        } else {
            // Search for user's e-mail in database;
            User.findOne({
                email: req.params.email
            }, (err, user) => {
                if (err) {
                    res.json({
                        success: false,
                        message: err
                    }); // Return connection error
                } else {
                    // Check if user's e-mail is taken
                    if (user) {
                        res.json({
                            success: false,
                            message: 'E-mail is already taken'
                        }); // Return as taken e-mail
                    } else {
                        res.json({
                            success: true,
                            message: 'E-mail is available'
                        }); // Return as available e-mail
                    }
                }
            });
        }
    });


    /* ===============================================================
     Route to check if user's username is available for registration
  =============================================================== */
    router.get('/checkUsername/:username', (req, res) => {
        // Check if username was provided in paramaters
        if (!req.params.username) {
            res.json({
                success: false,
                message: 'Username was not provided'
            }); // Return error
        } else {
            // Look for username in database
            User.findOne({
                username: req.params.username
            }, (err, user) => {
                // Check if connection error was found
                if (err) {
                    res.json({
                        success: false,
                        message: err
                    }); // Return connection error
                } else {
                    // Check if user's username was found
                    if (user) {
                        res.json({
                            success: false,
                            message: 'Username is already taken'
                        }); // Return as taken username
                    } else {
                        res.json({
                            success: true,
                            message: 'Username is available'
                        }); // Return as vailable username
                    }
                }
            });
        }
    });

    /* ========
    LOGIN ROUTE
    ======== */
    router.post('/login', (req, res) => {
        // Check if username was provided
        if (!req.body.username) {
            res.json({
                success: false,
                message: 'No username was provided'
            }); // Return error
        } else {
            // Check if password was provided
            if (!req.body.password) {
                res.json({
                    success: false,
                    message: 'No password was provided.'
                }); // Return error
            } else {
                // Check if username exists in database
                User.findOne({
                    username: req.body.username.toLowerCase().replace(/\s/g, '')
                }, (err, user) => {
                    // Check if error was found
                    if (err) {
                        res.json({
                            success: false,
                            message: err
                        }); // Return error
                    } else {
                        // Check if username was found
                        if (!user) {
                            res.json({
                                success: false,
                                message: 'Username not found.'
                            }); // Return error
                        } else {
                            const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
                            // Check if password is a match
                            if (!validPassword) {
                                res.json({
                                    success: false,
                                    message: 'Password invalid'
                                }); // Return error
                            } else {
                                const token = jwt.sign({
                                    userId: user._id,
                                    admin: user.isAdmin
                                }, config.secret, {
                                    expiresIn: '24h'
                                }); // Create a token for client
                                res.json({
                                    success: true,
                                    message: 'Success!',
                                    token: token,
                                    user: {
                                        username: user.username
                                    }
                                }); // Return success and token to frontend
                            }
                        }
                    }
                });
            }
        }
    });


    /* ===============================================================
     GET ALL BLOGS
  =============================================================== */
    router.get('/allBlogs/:check', (req, res) => {
        // Search database for all blog posts
        Blog.find({ isApproved: req.params.check }, (err, blogs) => {
            // Check if error was found or not
            if (err) {
                res.json({
                    success: false,
                    message: err
                }); // Return error message
            } else {
                // Check if blogs were found in database
                if (!blogs) {
                    res.json({
                        success: false,
                        message: 'No blogs found.'
                    }); // Return error of no blogs found
                } else {
                    res.json({
                        success: true,
                        blogs: blogs
                    }); // Return success and blogs array
                }
            }
        }).sort({
            '_id': -1
        }); // Sort blogs from newest to oldest
    });

    router.get('/singlePost/:id', (req, res) => {
        // Check if id is present in parametrs
        if (!req.params.id) {
            res.json({
                success: false,
                message: 'No blog ID was provided.'
            });
        } else {
            //Check if the blog is found in database
            Blog.findOne({
                _id: req.params.id
            }, (err, blog) => {
                // Check if the id is a valid ID
                if (err) {
                    res.json({
                        success: false,
                        message: 'Not a valid blog id'
                    });
                } else {
                    // Check if blog was found by id
                    if (!blog) {
                        res.json({
                            success: false,
                            message: 'Blog not found.'
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            blog: blog
                        }); // Return success
                    }
                }
            });
        }
    });
    
    /* ===============================================================
        Find all items in shop
    =============================================================== */
    router.get('/allItems', getFilters, async (req, res) => {
        try {
            const regExpNumber = new RegExp(/^\d+$/),
                  reqExpWord = new RegExp(/\b(asc|desc)\b/),
                  availableFilters = Object.keys(Shop.schema.paths);
            
            if (((typeof req.query.offset !== 'undefined' && req.query.offset !== null) && !regExpNumber.test(req.query.offset))) {
                return res.json({ success: false, message: 'offset must be number' });
            } else if ((typeof req.query.per_page !== 'undefined' && req.query.per_page !== null) && !regExpNumber.test(req.query.per_page)) {
                return res.json({ success: false, message: 'per_page must be number' });
            } else if ((typeof req.query.sort_by !== 'undefined' && req.query.sort_by !== null) && !availableFilters.includes(req.query.sort_by)) {
                return res.json({ success: false, message: 'Wrong name in sort_by' });
            } else if ((typeof req.query.order_by !== 'undefined' && req.query.order_by !== null) && !reqExpWord.test(req.query.order_by)) {
                return res.json({ success: false, message: 'Wrong name in order_by' }); 
            } else {
                const sort_by = {};
                sort_by[ req.query.sort_by || 'quantity' ] = req.query.order_by || 'desc';
                const offset = parseInt(req.query.offset) || 0;
                const per_page = parseInt(req.query.per_page) || 9;
                const shopPromise = 
                      Shop.find(req.filters)
                        .skip(offset)
                        .limit(per_page)
                        .sort(sort_by);

                const countPromise = Shop.count(req.filters);
                const [items, count] = await Promise.all([ shopPromise, countPromise ]);
                return res.json({ success: true, message: items, count, per_page, offset });           
            }
        } catch(err) {
            return res.json({ success: false, message: err });
        }

    });
    
    /* ===============================================================
        Find and display Image
    =============================================================== */
    // I know it's not the best way to do this... if I will have more time I will do it in better way :)
    router.get('/image/:user', (req, res) => {
        User.findOne({ username: req.params.user }, async (err, user) => {
            if (err) {
                res.json({ success: false, message: 'Something went wrong.' });
            } else {
                if (!user) {
                    res.json({ success: false, message: 'Could not authenticate user.' });
                } else {
                    const conn = mongoose.createConnection(config.uri); // Create mongo connection
                    let gfs;
                    try {
                        await conn.once('open', () => {
                            // Init stream
                            gfs = Grid(conn.db, mongoose.mongo);
                        });
                    } catch(error) {
                        res.json({ success: false, message: 'Error in init stream' });
                    }
                    gfs.files.findOne({ filename: user.username }, (err, file) => {
                        // Check if file
                        if (!file || file.length === 0) {
                                gfs.files.findOne({ filename: 'defaultImage' }, (err, file) => {
                                // Read output to browser
                                const readstream = gfs.createReadStream(file.filename);
                                readstream.pipe(res);
                                });
                        } else {
                            // Check if image
                            if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                                // Read output to browser
                                const readstream = gfs.createReadStream(file.filename);
                                readstream.pipe(res);
                            } else {
                                res.json({ success: false, message: 'Not an image' });
                            }   
                        }
                    });   
                }    
            }
        });
    });

    /* ================================================
    MIDDLEWARE - Used to grab user's token from headers
    ================================================ */
    router.use((req, res, next) => {
        const token = req.headers['authorization']; // Create token found in headers
        // Check if token was found in headers
        if (!token) {
            res.json({
                success: false,
                message: token
            }); // Return error
        } else {
            // Verify the token is valid
            jwt.verify(token, config.secret, (err, decoded) => {
                // Check if error is expired or invalid
                if (err) {
                    res.json({
                        success: false,
                        message: 'Token invalid'
                    }); // Return error for token validation
                } else {
                    req.decoded = decoded; // Create global variable to use in any request beyond
                    next(); // Exit middleware
                }
            });
        }
    });

    /* ===============================================================
       Route to get user's profile data
    =============================================================== */
    router.get('/profile', (req, res) => {
        // Search for user in database
        User.findOne({
            _id: req.decoded.userId
        }).select('username email').exec((err, user) => {
            // Check if error connecting
            if (err) {
                res.json({
                    success: false,
                    message: err
                }); // Return error
            } else {
                // Check if user was found in database
                if (!user) {
                    res.json({
                        success: false,
                        message: 'User not found'
                    }); // Return error, user was not found in db
                } else {
                    res.json({
                        success: true,
                        user: user
                    }); // Return success, send user object to frontend for profile
                }
            }
        });
    });

    return router; // Return router object to main index.js
}

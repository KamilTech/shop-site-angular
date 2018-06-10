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
                        // Function that will be checking if req is array and if return is true then "req" will be inserting into array
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
    
    /* ===============================================================
        LIKE BLOG POST
    =============================================================== */
    router.put('/likePost', (req, res) => {
        // Check if id was passed provided in request body
        if (!req.body.id) {
            res.json({ success: false, message: 'No id was provided.' });
        } else {
            //Search the database with id
            Blog.findOne({ _id: req.body.id }, (err, blog) => {
               // Check if error has occurred
                if (err) {
                    res.json({ success: false, message: 'Invalid blog id' });
                } else {
                    // Check if id matched the id of a blog post in the databas
                    if (!blog) {
                        res.json({ success: false, message: 'That blog was not found.' });
                    } else {
                        // Get data from user that is signed in
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            // Check if error has occurred
                            if (err) {
                                res.json({ success: false, message: 'Something went wrong.' });
                            } else {
                                // Check if id of user in session was found in the database
                                if (!user) {
                                    res.json({ success: false, message: 'Could not authenticate user.' });
                                } else {
                                    // Check if user who liked post is the same user that originally created the blog post
                                    if (user.username === blog.createdBy) {
                                        res.json({ success: false, message: 'Cannot like your own post...' });
                                    } else {
                                        // Check if the user who liked the post has already liked the blog post before
                                        if (blog.likedBy.includes(user.username)) {
                                            res.json({ success: false, message: 'You already liked this post.' });
                                        } else {
                                            // Check if user who liked post has previously disliked a post
                                            if (blog.dislikedBy.includes(user.username)) {
                                                blog.dislikes--; // Reduce the total number of dislikes
                                                const arrayIndex = blog.dislikedBy.indexOf(user.username); // Get the index of the username in the array for removal
                                                blog.dislikedBy.splice(arrayIndex, 1); // Remove user from array
                                                blog.likes++; // Increment likes
                                                blog.likedBy.push(user.username); // Add username to the array of likedBy array
                                                // Save blog post data
                                                blog.save((err) => {
                                                   // Check if error was found
                                                    if (err) {
                                                        res.json({ success: false, message: 'Something went wrong.' });
                                                    } else {
                                                        res.json({ success: false, message: 'Blog liked!' });
                                                    }
                                                });
                                            } else {
                                                blog.likes++; // Incriment likes
                                                blog.likedBy.push(user.username); // Add liker's username into array of likedBy
                                                // Save blog post
                                                blog.save((err) => {
                                                  if (err) {
                                                    res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                                                  } else {
                                                    res.json({ success: true, message: 'Blog liked!' }); // Return success message
                                                  }
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    });
    
    /* ===============================================================
     DISLIKE BLOG POST
    =============================================================== */
    router.put('/dislikePost', (req, res) => {
    // Check if id was provided inside the request body
        if (!req.body.id) {
          res.json({ success: false, message: 'No id was provided.' }); // Return error message
        } else {
          // Search database for blog post using the id
          Blog.findOne({ _id: req.body.id }, (err, blog) => {
            // Check if error was found
            if (err) {
              res.json({ success: false, message: 'Invalid blog id' }); // Return error message
            } else {
              // Check if blog post with the id was found in the database
              if (!blog) {
                res.json({ success: false, message: 'That blog was not found.' }); // Return error message
              } else {
                // Get data of user who is logged in
                User.findOne({ _id: req.decoded.userId }, (err, user) => {
                  // Check if error was found
                  if (err) {
                    res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                  } else {
                    // Check if user was found in the database
                    if (!user) {
                      res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
                    } else {
                      // Check if user who disliekd post is the same person who originated the blog post
                      if (user.username === blog.createdBy) {
                        res.json({ success: false, messagse: 'Cannot dislike your own post.' }); // Return error message
                      } else {
                          // Check if user has previous disliked this post
                          if (blog.likedBy.includes(user.username)) {
                            blog.likes--; // Decrease likes by one
                            const arrayIndex = blog.likedBy.indexOf(user.username); // Check where username is inside of the array
                            blog.likedBy.splice(arrayIndex, 1); // Remove username from index
                            // Save blog data
                            blog.save((err) => {
                              // Check if error was found
                              if (err) {
                                res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                              } else {
                                res.json({ success: true, message: 'Blog disliked!' }); // Return success message
                              }
                            });
                          } else {
                              res.json({ success: false, message: "You don't like this post" });
                          }
                      }
                    }
                  }
                });
              }
            }
          });
        }
    });
    
  router.put('/updatePost', (req, res) => {
    // Check if id was provided
    if (!req.body._id) {
      res.json({ success: false, message: 'No blog id provided' }); // Return error message
    } else {
      // Check if id exists in database
      Blog.findOne({ _id: req.body._id }, (err, blog) => {
        // Check if id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid blog id' }); // Return error message
        } else {
          // Check if id was found in the database
          if (!blog) {
            res.json({ success: false, message: 'Blog id was not found.' }); // Return error message
          } else {
            // Check who user is that is requesting blog update
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                  // Check if user logged in the the one requesting to update blog post
                  if (user.username !== blog.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this blog post.' }); // Return error message
                  } else {
                    blog.title = req.body.title; // Save latest blog title
                    blog.body = req.body.body; // Save latest body
                    // Function that will be checking if req is array and if return is true then "req" will be inserting into array
                    blog.tags = [];
                    if (typeof req.body.tags !== 'undefined' && req.body.tags !== null) {
                        0 < req.body.tags.length && req.body.tags.map(e => blog.tags.push(e));
                    }
                    blog.save((err) => {
                      if (err) {
                        if (err.errors) {
                          res.json({ success: false, message: 'Please ensure form is filled out properly' });
                        } else {
                          res.json({ success: false, message: err }); // Return error message
                        }
                      } else {
                        res.json({ success: true, message: 'Blog Updated!' }); // Return success message
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });
    
  router.put('/confirm', (req, res) => {
    // Check if id was provided
    if (!req.body.id) {
      res.json({ success: false, message: 'No blog id provided' }); // Return error message
    } else {
      // Check if id exists in database
      Blog.findOne({ _id: req.body.id }, (err, blog) => {
        // Check if id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Not a valid blog id' }); // Return error message
        } else {
          // Check if id was found in the database
          if (!blog) {
            res.json({ success: false, message: 'Blog id was not found.' }); // Return error message
          } else {
            // Check who user is that is requesting blog update
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
                } else {
                  // Check if user logged in the the one requesting to update blog post
                  if (user.isAdmin === false) {
                    res.json({ success: false, message: 'You are not authorized to edit this blog post.' }); // Return error message
                  } else {
                    blog.isApproved = true;
                    blog.save((err) => {
                      if (err) {
                          res.json({ success: false, message: 'Some error occured... Sorry' }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Blog Updated!' }); // Return success message
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });
    
    return router;
};

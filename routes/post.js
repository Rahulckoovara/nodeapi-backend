const express = require("express");

const postControllers= require("../controllers/post");
const { createPostValidator } = require("../validators");
const { requireLogin, authenticateToken } = require("../middlewares/auth");
const router = express.Router();

router.get("/",requireLogin, postControllers.getposts);
router.post("/post", requireLogin, createPostValidator, postControllers.createPost);


// Route for user registration
router.post("/register", postControllers.register); // Route for user registration

// Route for user login
router.post("/login", postControllers.login); 

//get the registered data
router.get("/userdetails",authenticateToken, postControllers.getUsers);

//fetch the user data with the user id
router.get("/userdetails/:id",authenticateToken, postControllers.getUserById);


//update the user data with the user id
router.put("/userdetails/:id", postControllers.updateUser);

//registering the asset with details

router.post("/assetdetails",postControllers.assets);




//logout
//router.post("/logout",authenticateToken, postControllers.logout);

// router.post("/logout",postControllers.logout);




module.exports = router;


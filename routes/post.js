const express = require("express");

const postControllers= require("../controllers/post");
const { createPostValidator } = require("../validators");
const { requireLogin } = require("../middlewares/auth");
const router = express.Router();

router.get("/",requireLogin, postControllers.getposts);
router.post("/post", requireLogin, createPostValidator, postControllers.createPost);

router.post("/register", postControllers.register); // Route for user registration

router.post("/login", postControllers.login); 
// router.post("/logout",postControllers.logout);

//router.post("/login",postControllers.login)
// const getposts = (req, res) => {
//    // res.send("Hello World from nodejavas");
// };


module.exports = router;


const express = require("express");

const postControllers = require("../controllers/post");
const { createPostValidator } = require("../validators");
const { requireLogin, authenticateToken } = require("../middlewares/auth");
const router = express.Router();

router.get("/", requireLogin, postControllers.getposts);
router.post(
  "/post",
  requireLogin,
  createPostValidator,
  postControllers.createPost
);

//1 Route for user registration
router.post("/register", postControllers.register); // Route for user registration

//2 Route for user login
router.post("/login", postControllers.login);

//3get the registered data
router.get("/userdetails", postControllers.getUsers);

//4fetch the user data with the user id
router.get("/userdetails/:id", postControllers.getUserById);

//5update the user data with the user id
router.put("/userdetails/:id", postControllers.updateUser);

//6registering the asset with details
router.post("/assetdetails", postControllers.assets);

//7getting the user details by the if from the user
router.get("/assets/:userId", postControllers.getUserAssetById);

//8get all the asset details
router.get("/assets", postControllers.getAllAssets);


// Fetch the details of a specific asset under the user by assetId
router.get("/assets/:userId/:assetId", postControllers.getUserAssetDetailsById);

//logout
//router.post("/logout",authenticateToken, postControllers.logout);

// router.post("/logout",postControllers.logout);

module.exports = router;

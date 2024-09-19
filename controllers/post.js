const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const User = require("../models/user");
const Assets = require("../models/housedetails");

//------get call-------

exports.getposts = (req, res) => {
  Post.find()
    .select("_id name age address")
    .then((apiData) => {
      res.json({ Details: apiData });
    })
    .catch(() => {
      console.log("get api error");
    });
  // res.json({
  //     posts:[
  //         {title:"First post"},
  //         {title:"Second post"}
  //     ]
  // });
};

//get registered data

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-tokens -password -__v");

    res.status(200).json({
      userDetails: users,
    });

  }catch (err) {
    res.status(500).json({ message: "An error occurred", err });
  }
  // User.find().
  // select("-tokens -password -__v")
  // .then((apiData)=>{
  //     res.json({
  //         Details:apiData
  //     })
  // })
};


//update the user values fetch from the id

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, password, image } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (password) user.password = password;
    if (image) user.image = image;
    await user.save();

    res.status(200).json({
      //  _id:_id.user._id,
      message: "user details successfully updated",

      //     user:{
      //     _id: user._id,
      //     username: user.username,
      //     name: user.name,
      //     image: user.image,
      //   }
    });
  } catch (e) {
    res.status(400).json({
      error: e,
    });
  }
};

// In your postControllers file
exports.getUserById = async (req, res) => {
  const { id } = req.params; // Get user ID from URL params

  try {
    // Find the user by ID, excluding sensitive fields
    const user = await User.findById(id).select("-tokens -password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ userDetails: user });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

//post call-------------------------------------------

exports.createPost = async (req, res) => {
  const postCall = new Post(req.body);
  console.log("created post:", req.body);

  try {
    const result = await postCall.save();
    res.status(200).json({
      postCall: result,
    });
  } catch (err) {
    console.log("error", err);
    return res.status(400).json({
      error: err,
    });
  }

  // postCall.save((err,result) => {
  //     if(err)
  //     {
  //         console.log("errorrrrrrr")
  //         return res.status(400).json
  //         ({
  //             error:err,
  //         });

  //     }
  //     res.status(200).json({
  //        postCall:result
  //     })
  // });
};

// login register api call----------------------------

exports.register = async (req, res) => {
  const { username, isowner, name, password, image } = req.body;
  const notNewUser = await User.isThisEmailInUse(username);
  if (notNewUser) {
    console.log("is already registered", notNewUser);
    return res
      .status(200)
      .json({ message: "this email already in use try login" });
  }

  try {
    const user = new User({ username, isowner, name, password, image });
    console.log("user----", user);

    //store in the database
    await user.save();

    res.status(200).json({
      message: "user registered successfully",
    });
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
};

//login api call-----------------------------

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user by username
    const user = await User.findOne({ username });
    console.log("user is -----", user);

    if (!user) {
      return res.status(200).json({ error: "Invalid username" });
    }

    const isMatch = await user.comparePassword(password);
    console.log("is matchis-", isMatch);

    if (!isMatch) {
      console.log("not match------------");
      return res.status(200).json({ error: "Invalid password" });
    }

    // Generate a new token with a 2-hour expiration
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // Retrieve old tokens or initialize an empty array
    let oldTokens = user.tokens || [];
    console.log("old tokens----", oldTokens);

    oldTokens = oldTokens.filter((t) => {
      const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
      return timeDiff < 20;
    });

    // Add the new token to the list of tokens
    const newTokens = [
      ...oldTokens,
      { token, signedAt: Date.now().toString() },
    ];

    // Update the user with the new list of tokens
    await User.findByIdAndUpdate(user._id, { tokens: newTokens });

    // Respond with the generated token
    res.status(200).json({
      userId: user._id,
      isowner: user.isowner,
      message: "Login successful",
      token,
    });
    console.log("token:", token);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};





//call for the data uploading of the assets details

exports.assets = async (req, res) => {
  const {
    userId,
    assetname,
    location,
    bedrooms,
    commonHall,
    bathroom,

    description,
    price,
    thumbimage,

    contact,
    gallery,
  } = req.body;

  try {
    const assets = new Assets({
      userId,
      assetname,
      location,
      bedrooms,
      commonHall,
      bathroom,
      description,
      price,
      thumbimage,
      contact,
      gallery,
    });

    console.log("assetss---", assets);
    // store it in the database
    await assets.save();

    res.status(200).json({
      message: "data uploaded succesfully",
    });
  } catch (e) {
    res.status(400).json({
      error: e,
    });
  }
};


//fetch the assets details under the specific user

exports.getUserAssetById = async (req, res) => {
  const { userId } = req.params;

  try {

    // Find all assets that match the given userId
    const assets = await Assets.find({ userId: userId });

    if (assets.length == 0) {
        return res.status(404).json({
        message: "No assets found",
      });
    }

    res.status(200).json({
      assets: assets,
    });
  }
   catch (e) {
    res.status(500).json({
      error: e,
    });
  }
};


//fetch all the asset details
exports.getAllAssets=async(req,res)=>{
    try{
        const assets = await Assets.find().select("-__v");
        res.status(200).json({
            assets:assets
        })
    }
    catch(e){
        res.json({
            error:e
        })
    }
};


// Fetch the details of a specific asset under the user by assetId
exports.getUserAssetDetailsById = async (req, res) => {
  const { userId, assetId } = req.params;

  try {
    // Find the specific asset that matches the given userId and assetId
    const asset = await Assets.findOne({ userId: userId, _id: assetId });

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found for the given user",
      });
    }

    res.status(200).json({
      asset: asset,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
    });
  }
};

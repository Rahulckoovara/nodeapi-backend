const mongoose = require("mongoose")

const assetSchema= new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // model of the user
    required: true,
  },
  assetname: {
    type:String,
    required: true,
  },
  location: {
    type:String,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true 
   },
   commonHall: {
    type: Number,
    required: true 
   },
   bathroom: {
    type: Number,
    required: true 
   },
   description: {
    type: String,
    required: true 
   },
   price: {
    type: Number,
    required: true 
   },

  thumbimage: {
    type:String,
    required :true
  },
    contact:{
      type:Number,
     
    },
    gallery: [
        {
          type: String, // Store each image as a string ( URL or Base64)
        },
      ],
});



const Assets = mongoose.model("Assets",assetSchema)

module.exports= Assets;

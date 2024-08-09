const mongoose = require ("mongoose");


 const postSchema =new mongoose.Schema({

    name:{
        type:String,
        required:true,
        minlength:2,
        maxlength:50
        },

    age:{
        type:Number,
        required:true,
        minlength:1,
        maxlength:3
        },

    address:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    },
    

 });

 module.exports=mongoose.model("Post",postSchema);
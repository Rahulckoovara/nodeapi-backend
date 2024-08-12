const express = require("express");
const app = express();
const mongoose =require("mongoose");
const morgan = require("morgan");
const bodyParser=require("body-parser");
// const expressValidator = require("express-validator");
const dotenv=require("dotenv");
dotenv.config();



//db
mongoose.connect(process.env.MONGO_URI)
 .then(() => 

          {
             console.log("connection succesfull")
          }
        ).catch((err)=>{
            console.error("Database connection error:", err);
        })

mongoose.connection.on('error',
    (err)=>

    {
      console.log("db connection error",err.message);

    })

//routes
const postRoutes = require('./routes/post');


//middleware 
app.use(morgan("dev"));
app.use(bodyParser.json());
// app.use(expressValidator());
app.use('/',postRoutes);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


const port = process.env.PORT ||8080 ;
app.listen(port, () => {
    console.log(`Server is running on  port ${port}`);
});

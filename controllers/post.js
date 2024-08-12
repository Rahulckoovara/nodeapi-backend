const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const User = require("../models/user");


//------get call-------

exports.getposts = (req, res) => {
      Post.find().select("_id name age address")
    .then((apiData)=>

    {
        res.json({Details:apiData})
    })
    .catch(()=>
    {
        console.log("get api error")
    })
    // res.json({
    //     posts:[
    //         {title:"First post"},
    //         {title:"Second post"}
    //     ]
    // });
};

//post call-------------------------------------------

exports.createPost= async (req,res)=>{ 
    const postCall =new Post(req.body)
    console.log("created post:",req.body);


try {  
const result = await postCall.save();
res.status(200).json({
    postCall:result
 });
}

catch(err){
console.log("error",err)
return res.status(400).json

({               
    error:err
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

exports.register= async(req,res)=> {

 const {username,name,password,image}= req.body;
  const notNewUser = await User.isThisEmailInUse(username)
if(notNewUser){
    console.log("is already registered",notNewUser)
    return res.status(200).json({message:"this email already in use try login"})
}

 try {
  const user = new User({username,name, password, image});
  console.log("user----",user)


//store in the database
  await user.save();


 res.status(200).json({
 message:"user registered successfully"
});

}
  catch(err)

{
  res.status(400).json({
  error:err
})
}};



//login api call-----------------------------

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find the user by username
        const user = await User.findOne({ username });
        console.log("user is -----", user);
        
        if (!user) {
            return res.status(400).json({ error: 'Invalid username' });
        }

        const isMatch = await user.comparePassword(password);
        console.log("is matchis-", isMatch);

        if (!isMatch) {
            console.log("not match------------");
            return res.status(400).json({ error: "Invalid password" });
        }

        // Generate a new token with a 2-hour expiration
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        // Retrieve old tokens or initialize an empty array
        let oldTokens = user.tokens || [];
        console.log("old tokens----", oldTokens);

        oldTokens = oldTokens.filter(t => {
            const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
            return timeDiff < 20; 
        });

        // Add the new token to the list of tokens
        const newTokens = [...oldTokens, { token, signedAt: Date.now().toString() }];

        // Update the user with the new list of tokens
        await User.findByIdAndUpdate(user._id, { tokens: newTokens });

        // Respond with the generated token
        res.status(200).json({ message: "Login successful", token });
        console.log('token:', token);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

//logout 


// Logout function to invalidate the token
// exports.logout = async(req, res) => { 
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).json({ error: 'Access denied, token missing!' });
//     }

//     const tokenParts = authHeader.split(' ');
//     if (tokenParts[0] !== 'Bearer' || tokenParts.length !== 2) {
//         return res.status(401).json({ error: 'Access denied, invalid token format!' });
//     }

//     const token = tokenParts[1];
//     const{username}=req.body;
//     const user =await User.findOne({username})
//     console.log("logging out user---------------------",user)
//     // Decode the token to get its payload
//     let decoded;
//     try {
        
//         decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//         return res.status(400).json({ error: 'Invalid token' });
//     }

//     // Create a new token with a very short expiration time (e.g., 1 second)
//     const newToken = jwt.sign(  
//         { _id: user._id },
//         process.env.JWT_SECRET,
//         { expiresIn: '1s' }
//     );

//     return res.status(200).json({
//         message: 'Successfully logged out',
//         token: newToken
//     });
// };






// module.exports = {
//     getposts
// }

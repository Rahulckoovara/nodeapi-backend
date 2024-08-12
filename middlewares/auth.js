const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.requireLogin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("required token=====", authHeader);

    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied, token missing!' });
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts[0] !== 'Bearer' || tokenParts.length !== 2) {
        return res.status(401).json({ error: 'Access denied, invalid token format!' });
    
    }

    const token = tokenParts[1];
    console.log("the token is::", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("token decoded----", decoded);
        req.user = decoded; 
        next();
    } catch (err) {
        if(err.name==="TokenExpiredError"){
            return res.status(401).json({
                error:"Token expired please login"
            })
        }
        console.error(err);
        return res.status(400).json({ error: 'Token is not valid' });
    }
};

//login based token 

exports.authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID
        const user = await User.findById(decoded._id);
        if (!user) return res.sendStatus(403);

        // Check if the token is in the user's tokens array
        const isValidToken = user.tokens.some(t => t.token === token);
        if (!isValidToken) return res.sendStatus(403);

        // Attach the user to the request
        req.user = user;
        next();
    } catch (err) {
        res.sendStatus(403); // Forbidden
    }
};
//token based login 

// const jwt = require('jsonwebtoken');

// exports.requireLogin = (req, res, next) => {
//     const token = req.headers.authorization;
//     console.log("required token=====",token)
//     if (!token) {
//         return res.status(401).json({ error: 'Access denied, token missing!' });
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("token decoded----",decoded)
//         req.user = decoded;
//         next();
//     } catch (err) {
//         console.error(err)
//         res.status(400).json({ error: 'Token is not valid' });
//     }
// };

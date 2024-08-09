const jwt = require('jsonwebtoken');

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

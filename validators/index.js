const { check, validationResult } = require('express-validator');

exports.createPostValidator = [
     
    check('name', 'enter the name ').trim().notEmpty(),
    check('name', 'name must have 3 characters').isLength({ min: 1, max: 50 }),

    check('age', 'Enter the age').notEmpty(),
    check('age', 'age must have min 1 characters').isLength({ min: 1, max: 50 }),
    check('age'," age should be a numeric value").isNumeric(),

    check('address', 'Enter the address').trim().notEmpty(),
    check('address', ' address must have min 5 characters').isLength({ min: 2, max: 50 }),
    
    (req, res, next) => {
       
        const errors = validationResult(req);
        if (!errors.isEmpty()) {    
            const firstError = errors.array().map((error) => error.msg)[0];
            return res.status(400).json({ message: firstError });
        }
        next();
    }
];

// // exports.createPostValidator=(req,res,next)=>{
// //     req.check("title","write the title").notEmpty()
// //     req.check("title","title must be between 4 to 150 characters").isLenght({
// //         min:4,
// //         max:150
// //     });

// //     //body
// //     req.check("body","write the body").notEmpty()
// //     req.check("body","body must be between 4 to 150 characters").isLenght({
// //         min:4,
// //         max:1000
// //     });

// //     //check for errors
// //    const  errors=req.validationErrors()
// //    //if error show first one

// //    if(errors){
// //     const firstError=errors.map((error)=>error.msg)[0]
// //     return res.status(400).json({error:firstError})
// //    }
// //    //procedd to nxt middle ware
// //    next();
// // }
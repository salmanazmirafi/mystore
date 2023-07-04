const jwt = require("jsonwebtoken");

const checkLogin  = (req, res, next)=>{
    const token = req.header('Authorization').replace('Bearer ', '');

    try {
        if(!token.length > 0){
            next("Authentication required!");
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECREAT);
        const {email, userId} = decoded;
        req.email = email;
        req.userId = userId;
        next();
    } catch (err) {
        next("Authentication required!")
    }
}


// module export 
module.exports = checkLogin;
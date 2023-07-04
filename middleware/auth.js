// user role authorization 
const User = require("../models/usersModel");



const authorization  = async (req, res, next)=>{
   try {
    const user = await User.find({email:req.email});
    if(user && user[0].role == 'admin'){
        next();
    }else{
        res.status(404).json({
            success:false,
            message:"You are not authorized for the actions!"
        })
    }
   } catch (err) {
    res.status(500).json({
        success:false,
        error:err.message
    })
   }
}


// export 
module.exports = authorization;
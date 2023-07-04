const User =  require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utilities/sendEmail");
const crypto = require("crypto");
const cloudinary =  require("cloudinary");


// create user or Sign Up
const createUser = async (req, res)=>{
    try {
        // check user exist or not
        const isUser = await User.find({email:req.fields.email});
        if(isUser.length < 1){
            const imagePath =req.files.image? req.files.image.path :"";
            if(imagePath){
                // create user with profile photo
                if(req.files.image.type == 'image/jpg' || req.files.image.type == 'image/png' || req.files.image.type == 'image/jpeg' || req.files.image.type == 'image/webp'){
                    const {url, public_id} = await  cloudinary.uploader.upload(imagePath,{folder:"mystore"});
                    req.fields.image = {public_id, url}
                    
                    const hashPassword = await bcrypt.hash(req.fields.password, 10);
                    const user = await User.create({
                        name:req.fields.name,
                        email:req.fields.email,
                        password:hashPassword,
                        role:req.fields.role,
                        image:req.fields.image
                    });
                    user.save(err =>{
                        if(!err){
                            res.status(200).json({
                                success:true,
                                message:" Account has been  cSuccessfully!",
                            });
                        }else{
                            res.status(400).json({
                                success:false,
                                message:err.message
                            });
                        }
                    })
                }else{
                    res.status(400).json({
                        success:false,
                        message:"User already exist!",
                    });
                }

            }else{
                // creart user without profile photo
                const hashPassword = await bcrypt.hash(req.fields.password, 10);
                const user = await User.create({
                    name:req.fields.name,
                    email:req.fields.email,
                    password:hashPassword,
                    role:req.fields.role,
                });
                user.save(err =>{
                    if(!err){
                        res.status(200).json({
                            success:true,
                            message:"User Created Successfully!",
                        });
                    }else{
                        res.status(400).json({
                            success:false,
                            message:err.message
                        });
                    }
                })
            }  
        }else{
            res.status(400).json({
                success:false,
                message:"User already exist!",
            });
        }
    } catch (err) {
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}

// get all users
const getAllUsers = async (req, res)=>{
    try {
        const users =  await User.find({});
        if(users.length > 0){
            res.status(200).json({
                success:true,
                users
            });
        }else{
            res.status(404).json({
                success:false,
                message:"Sorry! There is no user found!"
            });
        }
        
    } catch (err) {
        res.status(400).json({
            success:false,
            message:err.message
        });
    }
}
// get user by Id
const getUserById =  async (req, res)=>{
    try {
        const user =  await User.findById(req.params.id);
        if(user){
            res.status(200).json({
                success:true,
                user
            });
        }else{
            res.status(404).json({
                success:false,
                message:"User not found!"
            });
        }
        
    } catch (err) {
        res.status(400).json({
            success:false,
            message:err.message
        });
    }
}

// update user
const updateUser =  async(req, res)=>{
    try {
        const user = await User.findById(req.params.id);
    if(!user){
      return  res.status(404).json({
            success:false,
            message:"User not found!"
        });
    }
    const imgLinks = [];
    if(req.files.image){
        const path =req.files.image.path;
        if(req.files.image.type == 'image/jpg' || req.files.image.type == 'image/png' || req.files.image.type == 'image/jpeg'){
            const {url, public_id} = await  cloudinary.uploader.upload(path,{folder:"mystore"});
            imgLinks.push({public_id, url})
        }
          // delete previous image from cloudinary 
          if(user.image.length > 0){
              const {result } = await cloudinary.uploader.destroy(user.image[0]?.public_id);
          }
          const updateData = {
            name:req.fields.name,
            email:req.fields.email,
            role:req.fields.role,
            password:req.fields.password,
            image:imgLinks
          };
        // update 
        const updated = await User.updateOne({_id:req.params.id}, {$set:updateData})
        if(!updated.modifiedCount){
            return  res.status(500).json({
                    success:false,
                    message:"User update failed!"
            });
        }
        return res.status(200).json({
            success:true,
            message:"User updated Successfully!"
        });
    }
   // update user data without image 
  const updated = await User.updateOne({_id:req.params.id}, {$set:req.fields})
  if(!updated.modifiedCount){
    return  res.status(500).json({
            success:false,
            message:"User update failed!"
        });
  }
  return res.status(200).json({
    success:true,
    message:"User updated Successfully!"
});
    } catch (err) {
      return  res.status(400).json({
            success:false,
            message:err.message
        });
    }
}
// delete user by Id
const deleteUser =  async (req, res)=>{
    try {
        const user =  await User.findById(req.params.id);
        if(user){
            user.deleteOne();
            if(user.image.length){
                const {result} =  await  cloudinary.v2.uploader.destroy(user.image[0].public_id);
            }
            res.status(200).json({
                success:true,
                message:"User Deleted Successfully!"
            });
        }else{
            res.status(404).json({
                success:false,
                message:"User not found!"
            });
        }
        
    } catch (err) {
        res.status(400).json({
            success:false,
            message:err.message
        });
    }
}

// login user
const loginUser =  async (req, res, next) =>{
    try {
        const user =  await User.find({email:req.fields.email}).select("+password   ");

        if(user.length >0){
            const {name, email, role} = user[0];
            const isValidPassword = await bcrypt.compare(req.fields.password, user[0].password)
            if(isValidPassword){
                const token = jwt.sign({
                    email,
                    userId:user[0]._id
                },process.env.JWT_SECREAT, {
                    expiresIn:"1h"
                })
                // set cookie
                res.cookie("token", token, {
                    expiresIn: 60*60
                });
                
                res.status(200).json({
                    success:true,
                    message:"Login Success!",
                    access_token:token,
                    userData:{name, email, role, image:user[0].image[0]?.url }
                });
            }else{
                res.status(400).json({
                    success:false,
                    message:"incorrect email or password"
                });
            }
        }else{
            res.status(404).json({
                success:false,
                message:"User not found!"
            });
        }
        
    } catch (err) {
        res.status(500).json({
            success:false,
            message:"Autentication Failed!",
            error:err.message
        });
    }
}

// logout
const logoutUser = async (req, res)=>{
    res.cookie(process.env.COOKIE_NAME, null).json({
        success:true,
        message:"Logged Out Successfully"
    });
}

// get loggedin use details
const getLoginUserDetails = async (req, res ) =>{
    const user = await User.findOne({email:req.email});
    if(!user){
     return   res.status(404).json({
            success:false,
            message:"There is no loggedin user found!",
            user:[] 
        });
    }
   return res.status(200).json({
        success:true,
        message:"User found successfully!",
        user:{id:user._id, name:user.name, email:user.email, role:user.role, image:user.image[0]?.url }
    });
}

// forgot password
const forgotPassword = async (req, res)=>{
    const user =  await User.findOne({email:req.fields.email});
    if(user){
        // generate random string with hex
        const randomString =   crypto.randomBytes(20).toString("hex");
        const subject  = 'MyStore - Forogt Password Recovery';
        const resetpasswordurl = `Link: ${process.env.FRONTEND_HOST}/password/reset/${randomString}`;
        const message = `Please click the below link to reset your password \n\n 
        ${resetpasswordurl}
        if you are not requested for this mail,  please ignore it. 
        `;
        const response = await   sendEmail(user.email,subject, message);
       if(response.accepted.length > 0){
        // save user password reset token and time
        await user.updateOne({$set:{resetPasswordToken:randomString}});
        await user.updateOne({$set:{resetPasswordExpire:Date.now() + 60*5*1000}})
            res.status(200).json({
                success:true,
                message:`Email sent to ${user.email} successfully!`,
            });
       }else{
        res.status(400).json({
            success:false,
            message:`Email sent Failed!`
        });
       }
    }else{
        res.status(404).json({
            success:false,
            message:"User not found!"
        });
    }
    

}

// reset password
const resetPassword = async (req, res)=>{
    try {
        const user  = await User.find({
            resetPasswordToken:req.params.id,
            resetPasswordExpire:{$gt:Date.now()}
        });
        
        // const isResetPasswordTokenExpired = await User.find({resetPasswordTokenExpire:{$gt:Date.now()}})
    if(user.length > 0 ){
        // check password and confirm password match or not
        if(req.fields.password == req.fields.confirmPassword){
            
            // generate hash password
            const hashPassword = await bcrypt.hash(req.fields.password, 10);
            // update user password
            
            const passwordUpdated = await User.updateOne({resetPasswordToken:req.params.id},{$set:{password:hashPassword}});
            if(passwordUpdated.modifiedCount > 0){
                // set reset password token blank string
                // await User.updateOne({resetPasswordToken:req.params.id},{$set:{resetPasswordToken:"", resetPasswordExpire:""}});
                await User.updateOne({resetPasswordToken:req.params.id}, {$set:{resetPasswordToken:"", resetPasswordExpire:""}});
                res.status(200).json({
                    success:true,
                    message:"Password Changed Successfully!",
                });
            }
        }else{
            res.status(400).json({
                success:false,
                message:"Confirm password incorrect!",
            });
        }

    }else{
        res.status(400).json({
            success:false,
            message:"invalid password reset token or has been expired!",
        });
    }
    } catch (err) {
        res.status(400).json({
            success:false,
            message:"There was a server error!",
            error:err.message
        });
    }
 
}




// export default
module.exports ={
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser,
    getLoginUserDetails,
    forgotPassword,
    resetPassword
}
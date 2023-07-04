const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        select: false
    },
    role:{
        type:String,
        required:true,
        enum:["admin", "user"],
        default:"user"
    },
    image:[
        {
            public_id:{
              type:String,
            },
            url:{
                type:String,
                default:""
            },
          }
    ],
    resetPasswordToken:{
        type:String,
        default:""
    },
    resetPasswordExpire:{
        type:Date,
        default:""
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

// export default
module.exports = mongoose.model("User", userSchema);
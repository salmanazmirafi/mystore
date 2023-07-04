const mongoose = require("mongoose");

const messageSchema  = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    view:{
        type:String,
        enum:[true, false],
        default:false,
        required:true
    },
    
    createdAt:{
        type:Date,
        default:Date.now()
    }
});


// export model
module.exports = mongoose.model("Message", messageSchema)
const mongoose = require("mongoose");
const User = require("./usersModel");


const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:String,
        required:true,
        mexLength:8,
    },
    category:{
        type:String,
        required:true,
    },
    brand:{
        type:String,
        required:true,
    },
    size:{
        type:String,
        required:true,
    },
    color:{
        type:String,
        required:true,
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
          public_id:{
            type:String,
            required:true
          },
          url:{
              type:String,
              required:true
          },
        }
      ],
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true,
            },
            comment:{
                type:String,
                required:true
            }
        },
    ],
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        // required:true,
    }
});

// export 
module.exports = mongoose.model("Product", productSchema)
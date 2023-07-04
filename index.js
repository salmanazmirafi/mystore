const express = require("express");
const app  = express();
const cookieParser = require("cookie-parser");
const cors =  require("cors");
const bodyParser = require('body-parser');
const formidable =  require("express-formidable");
const cloudinary = require("cloudinary");

app.use(cors());


// app.use(express.json());
app.use(express.urlencoded({extended: false})); 
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
require("dotenv").config();
app.use(formidable());
//internal requies 
const connectDatabase = require("./config/DatabaseConnection");
// database Connection
connectDatabase();


// cloudinary configuration     
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, 
    api_key:  process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
})

// All routes
const productsRoute = require("./routes/productsRoute");
const categoryRoute =  require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute");
const messageRoute = require("./routes/messageRoute");
const orderRoute = require("./routes/orderRoute");
const cartRoute  = require("./routes/cartRoute");

// product 
app.use("/api/v1", productsRoute);
// category
app.use("/api/v1", categoryRoute);
// user
app.use("/api/v1", userRoute)
// message
app.use("/api/v1", messageRoute);
// order
app.use("/api/v1", orderRoute);
// cart 
app.use("/api/v1", cartRoute)


// default Error Handler
const errorHandler  = (err, req, res, next)=>{
    if(req.headersSent){
         return next(err)
    }
    res.status(500).json({error:err})
 }

 app.use(errorHandler);

// App Listener
app.listen(process.env.PORT || 8080, ()=>{
    console.log(`Server Listening on Port ${process.env.PORT || 8080}`);
})
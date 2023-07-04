const mongoose = require("mongoose");

const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_URI, {
           useNewUrlParser: true,
           useUnifiedTopology: true,
         })   
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err.message));
}






// export module
module.exports = connectDatabase;
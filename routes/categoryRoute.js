const express = require("express");
const router = express.Router();

// import categories controllers
const { 
    getAllCategory,
    createCategory, 
    deleteCategory } = require("../controllers/categoryController");


// category routes
router.get("/category/all", getAllCategory);
router.post("/category/create", createCategory);
router.delete("/category/delete/:id", deleteCategory);




// export
module.exports = router;
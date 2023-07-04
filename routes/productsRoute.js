const express = require("express");
const router = express.Router();

// all product controllers
const { 
    addNewProduct,
    getAllProducts, 
    deleteProduct, 
    getProductById,
    updateProduct } = require("../controllers/productController");
const authorization = require("../middleware/auth");
const checkLogin = require("../middleware/checkLogin");

// Product routes
router.get("/product/all", getAllProducts);
router.get("/product/one/:id", getProductById);
router.post("/product/create",addNewProduct);
router.delete("/product/delete/:id", deleteProduct);
router.put("/product/update/:id", updateProduct);


// export routes
module.exports = router;
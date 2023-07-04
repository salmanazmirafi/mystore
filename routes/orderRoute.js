const express  = require("express");
const router = express.Router();
const authorization = require("../middleware/auth");
const checkLogin = require("../middleware/checkLogin");
const { 
    createOrder, 
    getAllOrders, 
    getMyOrders, 
    getOrderById,
    deleteOrder,
    trackOrder,
    updateOrder
} = require("../controllers/orderController");


// order routes
//ToDo must be add checklogin
router.post("/orders/create",checkLogin, createOrder);
router.get("/orders/all",checkLogin, authorization,  getAllOrders);
router.get("/orders/me",checkLogin, getMyOrders);
router.get("/orders/:id",checkLogin, getOrderById);
router.delete("/orders/delete/:id",checkLogin, authorization, deleteOrder);
router.put("/orders/update/:id",checkLogin, authorization, updateOrder);
router.post("/orders/me/track", trackOrder);



// export 
module.exports = router;
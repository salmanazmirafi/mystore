const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// create order
const createOrder  = async (req, res)=>{
    try {
        const {
            shippingInfo,
            productInfo,
            paymentInfo,
            shippingPrice, 
            totalPrice,
            orderStatus,
            email,
            totalQuantity 
        } = req.fields;
        const order = await Order.create({
            shippingInfo,
            productInfo,
            paymentInfo,
            shippingPrice, 
            totalPrice,
            orderStatus,
            email,
            email,
            totalQuantity,
            user:req.userId
        });
    if(order){
        res.status(200).json({
            success:true,
            message:"Order placed Successfully!",
            order
        });
    }
        
    } catch (err) {
        res.status(500).json({
            success:false,
            message:"There was a server side error!",
            error:err.message
        });
    }
}
// get all orders -- admin 
const getAllOrders = async (req, res)=>{
    try {
        const orders = await Order.find({});
        if(orders.length > 0){
            res.status(200).json({
                success:true,
                total_orders:orders.length,
                orders:orders
            });
        }else{
            res.status(404).json({
                success:false,
                "message":"Order doesn't exist!"
            });
        }
    } catch (err) {
        res.status(500).json({
            success:false,
            message:"There was a server side error!",
        });
    }
}
// get specific user orders
const getMyOrders = async (req, res)=>{
    try {
        const orders = await Order.find({user:req.userId});
        if(orders){
            res.status(200).json({
                success:true,
                orders
            });
        }else{
            res.status(404).json({
                success:false,
                "message":"There is no orders found!"
            });
        }
    } catch (err) {
        res.status(500).json({
            success:false,
            message:"There was a server side error!",
        });
    }
}

// get order by id
const getOrderById =   async(req, res)=>{
    try {
        const orders = await Order.findById(req.params.id);
        if(orders){
            res.status(200).json({
                success:true,
                orders
            });
        }else{
            res.status(404).json({
                success:false,
                "message":"Order not found!"
            });
        }
    } catch (err) {
        res.status(500).json({
            success:false,
            message:"There was a server side error!",
        });
    }
}

// delete order 
const deleteOrder =   async(req, res)=>{
    try {
        const order = await Order.findById(req.params.id);
        if(order){
            order.deleteOne();
            res.status(200).json({
                success:true,
                "message":"Order Deleted Successfully!"
            });
        }else{
            res.status(404).json({
                success:false,
                "message":"Order not found!"
            });
        }
    } catch (err) {
        res.status(500).json({
            success:false,
            message:"There was a server side error!",
        });
    }

}

// update order  -- admin
const updateOrder  = async (req, res) =>{
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, {orderStatus:req.fields.orderStatus});
        if(order){
            res.status(200).json({
                success:true,
                message:"Order Updated Successfully!",
                order
            });
        }else{
            res.status(400).json({
                success:false,
                message:"Order not found!",
            });
        }  
        
    } catch (err) {
        res.status(400).json({
            success:false,
            message:"There was a server side error!",
        });
    }
}

// track order
const trackOrder =  async (req, res) =>{
    try {
        const {email, orderId } = req.fields
        const order = await Order.findById(orderId);
        const orderEmail = order?.shippingInfo?.email;
        if(order && orderEmail === email){
            res.status(200).json({
                success:true,
                message: order.orderStatus
            });
        }else{
            res.status(404).json({
                success:false,
                "message":"Order doesn't exist!",
            });
        }
    } catch (err) {
        res.status(400).json({
            success:false,
            message:"There was a server side error!",
        });
    }
}



// export 
module.exports = {
    createOrder,
    getAllOrders,
    getMyOrders,
    getOrderById,
    deleteOrder,
    trackOrder,
    updateOrder
}
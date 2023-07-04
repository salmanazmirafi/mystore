const Cart = require("../models/cartModel");


// get all cart items
const getAllCartItems =  async (req, res) =>{
    try {
        const cartProducts = await Cart.find({user:req.userId})
        if(cartProducts.length > 0){
            res.status(200).json({
                success:true,
                cartProducts,
            });
        }else{
            res.status(404).json({
                success:false,
                message:"There is no product in cart!"
            });
        }
    } catch (err) {
        res.status(500).json({
            success:false,
            message:"There was a sever error!"
        });
    }
}

// add product to cart
const addToCart =  async (req, res)=>{
    try {
    const {productId, name, description, price, category, images}  = req.fields;
      const productExist = await  Cart.find({productId});

    if(!productExist.length >0){
        if(productId, name,description, price, category, images){
            const addProduct = await Cart.create({
                productId,
                name,
                description,
                price, 
                category,
                images
            });
            if(addProduct){
                res.status(200).json({
                    success:true,
                    message:"1 Product added to cart!"
                });
            }else{
                res.status(400).json({
                    success:false,
                    message:"Failed! Product not add to cart!"
                });
            }
           }
    }else{

        const updateQuantity = {
            $set:{quantity:req.fields.quantity?req.fields.quantity:1}
        }; 
        // update
              Cart.findByIdAndUpdate(productExist[0]._id, updateQuantity, (err, data)=>{
                if(!err){
                    res.status(200).json({
                        success:true,
                        message:"Product quantity updated!",
                    });
                }else{
                    res.status(404).json({
                        success:true,
                        message:"Failed add to cart!"
                    });
                }
            })
    }
    } catch (err) {
        res.status(500).json({
            success:false,
            message:"There was a sever error!",
            error:err.message
        });
    }
}

// update cart product by id
const updateCartProduct  =  async (req, res)=>{
    
}




// Remove  product from cart
const removeProduct =  async (req, res)=>{
    try {
        const deleteProduct = await Cart.findOneAndDelete({_id:req.params.id});
        if(deleteProduct){
            res.status(200).json({
                success:true,
                message:" 1 Product removed from Cart!"
            });
        }else{
            res.status(400).json({
                success:false,
                message:"Product remove failed!"
            });
        }
    } catch (err) {
        res.status(500).json({
            success:false,
            message:"There was a sever error!"
        });
    }
}

// Remove all product from cart
const removeAllProduct = async(req, res)=>{
    try {
        const deleteProducts = await Cart.remove({});
        if(deleteProducts){
            res.status(200).json({
                success:true,
                message:" All products removed from Cart!"
            });
        }else{
            res.status(400).json({
                success:false,
                message:"Products remove failed!"
            });
        }
    } catch (err) {
        res.status(500).json({
            success:false,
            message:"There was a sever error!"
        });
    }
}


// export
module.exports = {
    getAllCartItems,
    addToCart,
    removeProduct,
    removeAllProduct
}
const Product = require("../models/productModel");
const cloudinary =  require("cloudinary");
const Apifeatures = require("../utilities/Apifeatures");

// Create a new product
const addNewProduct = async (req, res, next)=>{
        // set user reference in product 
        req.body.user = req.userId;
        const path = req.files.image.path 
        if(req.files.image.type == 'image/jpg' || req.files.image.type == 'image/png' || req.files.image.type == 'image/jpeg' || req.files.image.type == 'image/webp'){
            const {url, public_id} = await  cloudinary.uploader.upload(path,{folder:"mystore"});
            req.fields.images = {public_id, url}
            const productData  = req.fields;
            if(url){
                const product = new Product(productData);
                product.save((err)=>{
                    if(!err){
                        res.status(200).json({
                            success:true,
                            message:"Product Created Successfully!",
                            product
                        });
                    }else{
                        res.status(200).json({
                            success:false,
                            message:err.message
                        })
                    }
                });
            }else{
                res.status(200).json({
                    success:false,
                    message:"Image upload Failed!",
                });
            }

        }else{
            res.status(200).json({
                success:false,
                message:"Only image file allowed!",
            });
        }
 

      
}

// Get All Products
const getAllProducts =  async(req, res)=>{

    try {   
        const apifeatures =  new  Apifeatures(Product.find(), req.query).Search().FilterByCategory().Pagination();

        const products =await apifeatures.query;
        const totalProducts = products.length >0? await Product.find({}):0;
      
        if(products){
            res.status(200).json({
                success:true,
                products,
                total:totalProducts.length
            });
        }else{
            res.status(404).json({
                success:false,
                message:"Sorry! Didn't find any product!"
            })
        }
    } catch (err) {
    }
    
}

// get a product by id
const getProductById =  async(req, res)=>{

    try {
        const products = await Product.findById(req.params.id);
        if(products){
            res.status(200).json({
                success:true,
                products
            });
        }else{
            res.status(404).json({
                success:false,
                message:"Product Not Found!"
            })
        }
    } catch (err) {
      
    }
    
}


// delete a product 
const deleteProduct = async (req, res )=>{
 
   try {
        const product =  await Product.findById(req.params.id);
        if(product){
            product.deleteOne();
            const {result} =await  cloudinary.v2.uploader.destroy(product.images[0].public_id);
            res.status(200).json({
                success:true,
                message:"Product Deleted Successfully!"
            });
        }else{
            res.status(404).json({
                success:false,
                message:"Product not Found!"
            });
        }
   } catch (err) {
       
   }

}
    

// update a product
const updateProduct = async (req, res)=>{
    try {
        const product =  await Product.findById(req.params.id);
       
        if(product){
            const imgLinks = [];
            const updateData = {};
            if(req.files.image){
                const path =req.files.image.path;
                if(req.files.image.type == 'image/jpg' || req.files.image.type == 'image/png' || req.files.image.type == 'image/jpeg'){
                    const {url, public_id} = await  cloudinary.uploader.upload(path,{folder:"mystore"});
                    imgLinks.push({public_id, url})
                }
                  // delete previous image from cloudinary 
                  const {result } =await cloudinary.uploader.destroy(product.images[0].public_id);
            }
            if(req.fields.name){
                updateData.name = req.fields.name;
            }
            if(req.fields.price){
                updateData.price = req.fields.price;
            }
            if(req.fields.brand){
                updateData.brand = req.fields.brand;
            }
            if(req.fields.color){
                updateData.color = req.fields.color;
            }
            if(req.fields.category){
                updateData.category = req.fields.category;
            }
            if(req.fields.size){
                updateData.size = req.fields.size
            }
            if(req.fields.description){
                updateData.description = req.fields.description
            }
            if(imgLinks.length > 0){
                updateData.images = imgLinks[0]
            }

            // update
            Product.findByIdAndUpdate(req.params.id, updateData , (err, data)=>{
                if(!err){
                    res.status(200).json({
                        success:true,
                        message:"Product Updated Successfully!",
                        product
                    });
                }else{
                    res.status(404).json({
                        success:true,
                        message:"Product Updated Failed!"
                    });
                }
            })
        }else{
            res.status(404).json({
                success:false,
                message:"Product not Found!"
            })
        }
    } catch (err) {
    return
    }
}



// export default
module.exports ={
    addNewProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
    updateProduct
}
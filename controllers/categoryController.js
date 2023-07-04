const Category = require("../models/categoryModel");


// get all category
const getAllCategory = async(req, res)=>{
    try {
        const categories = await Category.find({});
        if(categories){
            res.status(200).json({
                success:true,
                categories,
            });
        }else{
            res.status(404).json({
                success:false,
                message:"Category not Found!"
            })
        }
    } catch (err) {
        return
    }
}

// create category --admin
const createCategory = async (req, res)=>{
   try {
    const isExistCategory = await Category.find({name:req.fields.name.toLowerCase()});
    
     if(isExistCategory.length <1){
        // capitalize category name
        const newCategory =req.fields.name.toLowerCase();
        const category = new Category({name:newCategory});
        category.save((err)=>{
            if(!err){
                res.status(200).json({
                    success:true,
                    message:"Category Created Successfully!",
                });
            }else{
                res.status(401).json({
                    success:false,
                    message:"Category Created Failed!",
                    error:err.message
                });
            }
        });
     }else{
        res.status(401).json({
            success:false,
            message:"Sorry! Category Already Exist!",
        });
     }
   } catch (err) {
   return
   }
}
// delete category --admin
const deleteCategory = async (req, res)=>{
    try {
        const category = await Category.findById(req.params.id);
        if(category){
            category.deleteOne();
            res.status(200).json({
                success:true,
                message:"Category Deleted Successfully!"
            })

        }else{
            res.status(404).json({
                success:false,
                message:"Category not Found!"
            })
        }
    } catch (err) {
        res.status(500).json({
            success:false,
          error:err.message
        })
    }
}



// export default
module.exports ={
    getAllCategory,
    createCategory,
    deleteCategory
}
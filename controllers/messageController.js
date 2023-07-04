const Message  = require("../models/messageModel");


// get all message  -- admin
const getAllMessage = async (req, res)=>{
    try {
        const messages = await Message.find({})
        if(messages){
            res.status(200).json({
                success:true,
                messages
            });
        }else{
            res.status(404).json({
                success:false,
                message:"Message not found!"
            })
        }

    } catch (err) {
        res.status(400).json({
            success:false,
            error:err.messsage
        })
    }
}
// create message
const createMessage  = async (req, res)=>{
    try {
        const messsage = await Message.create(req.fields);
        messsage.save(err =>{
            if(!err){
                res.status(200).json({
                    success:true,
                   messsage:"Thanks! Your message recored!"
                });
            }
        })
    } catch (err) {
        res.status(400).json({
            success:false,
            message:"Something wrong!",
            error:err.messsage
        })
    }
    
}
// delete message
const deleteMessage = async (req, res)=>{
    try {
        const message = await Message.findById(req.params.id);
        if(message){
            message.deleteOne();
            res.status(200).json({
                success:true,
                message:"Message Deleted Successfully!"
            })

        }else{
            res.status(404).json({
                success:false,
                message:"Message not Found!"
            })
        }
    } catch (err) {
        res.status(500).json({
            success:false,
            error:err.message
        })
    }
}


// export module
module.exports  ={
    createMessage,
    getAllMessage,
    deleteMessage
}
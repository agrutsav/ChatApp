const Messages = require("../model/messageModel");

module.exports.addMessage = async (req, res, next) => {
    try {
        const {from,to,message}=req.body;
        
        const data=await Messages.create({
            message:{text:message},
            users:[from,to],
            sender:from,

        })
        if(data){
            return res.json({msg:"message added successfully"})
        }
        else{
            return msg.json({msg:"Failed to add the message to database"})
        }
    } catch (ex) {
        
        next(ex)
    }
};

module.exports.getAllMessage = async (req, res, next) => {
    try {
        const {from,to}=req.body;
        const messages=await Messages.find({
            users:{
                $all:[from,to],
            },
        })
        .sort({updatedAt:1});
        const projectMessages=messages.map((msg)=>{
            return{
                fromSelf:msg.sender.toString()===from,
                message:msg.message.text,
            }
        })
    } catch (ex) {
        next(ex)
    }
};

const mongoose=require('mongoose');
const messageSchema=new mongoose.Schema({
    SenderID:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    ReceiverID:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    Content: {type:String,required:true},
    TimeStamp: {type:Date,default:Date.now},
    SendStatus:{type:Boolean,default:true},
    LastMessage:{type:Boolean,default:false}
})
messageSchema.methods.setLastMessage=function(){
    this.LastMessage=true;
}
messageSchema.statics.setPreviousMessageFalse=async function(senderID,receiverID){
    await this.updateOne(
        {
            $or:[{SenderID:senderID,
            ReceiverID:receiverID,
            LastMessage:true},
            {SenderID:receiverID,
            ReceiverID:senderID,
            LastMessage:true},
            ]
        },
        {
            $set:{LastMessage:false}
        }
    )
}


module.exports=mongoose.model('Message',messageSchema);
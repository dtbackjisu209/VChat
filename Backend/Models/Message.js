const mongoose=require('mongoose');
const messageSchema=new mongoose.Schmem({
    SenderID:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    ReceiverID:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    Content: {type:String,required:true},
    TimeStamp: {type:Date,default:Date.now},
    SendStatus:{type:Boolean,default:true},
    LastMessage:{type:Boolean,default:false}
})
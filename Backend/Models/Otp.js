const mongoose=require('mongoose');
const otpschema=new mongoose.Schema({
    email:{type:String,required:true, unique:true},
    otp:{type:String,required:true},
    createdAt:{type:Date, default:Date.now,expires:500}

});
module.exports=mongoose.model('Otp',otpschema);
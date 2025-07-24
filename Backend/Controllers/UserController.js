const User=require('../Models/Users');
const getuserfrominputtext=async(req,res)=>{
     console.log('Gọi đến API tìm kiếm với name:', req.body.name);
     console.log("dữ liệu decoded",req);
    const searchname=req.body.name;
    try{
         const users=await User.find({
        name:{$regex:searchname,$options:'i'}});
        res.status(200).json({message:"successfully found",Users:users});
    

    }
    catch(error)
    {
        console.log(error.message);
    }
   

}
const getUserLoginID=async(req,res)=>{
    try{
  console.log("ID người dùng là : ",req.user._id);
  res.status(200).json({UserLoginID:req.user._id});
    }
     catch(error)
    {
        console.log("Lỗi lấy ID người dùng",error.message);
    }
}
module.exports={getuserfrominputtext,getUserLoginID};

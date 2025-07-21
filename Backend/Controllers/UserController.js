const User=require('../Models/Users');
const getuserfrominputtext=async(req,res)=>{
     console.log('Gọi đến API tìm kiếm với name:', req.body.name)
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
module.exports={getuserfrominputtext};
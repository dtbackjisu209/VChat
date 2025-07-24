const express=require('express');
const router=express.Router();
const Auth=require('../Middleware/VerifyToken.js');
const UserController=require('../Controllers/UserController.js');
router.post('/getuserfrominputtext',Auth,UserController.getuserfrominputtext);
router.get('/getUserLoginID',Auth,UserController.getUserLoginID)
module.exports=router;
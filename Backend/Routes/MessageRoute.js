const express=require('express');
const router=express.Router();
const Auth=require('../Middleware/VerifyToken.js');
const GetMessageAandB=require('../Controllers/MessageController');
router.post('/getmessage',Auth,GetMessageAandB.getMessageAandB);
module.exports=router;
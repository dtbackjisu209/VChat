const express=require('express');
const router=express.Router();
const Authorization=require('../Controllers/authcontroller');
const VerifyToken=require('../Middleware/VerifyToken.js')
router.post('/login',Authorization.login);
router.post('/register',Authorization.register);
router.get('/CheckValidToken',VerifyToken,Authorization.CheckValidToken);
module.exports=router;
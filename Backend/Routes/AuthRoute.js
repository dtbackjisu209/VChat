const express=require('express');
const router=express.Router();
const Authorization=require('../Controllers/authcontroller');
router.post('/login',Authorization.login);
router.post('/register',Authorization.register);
module.exports=router;
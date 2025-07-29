const express = require('express');
const router = express.Router();
const multer = require('multer');
const Avatarupload=require('../Middleware/avatarupload.js')



const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/avatar', upload.single('avatar'),Avatarupload.avatarupload );

module.exports = router;

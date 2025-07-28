const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const User = require('../Models/Users');

// Multer config: lưu ảnh trên RAM (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    // Kiểm tra file
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Upload qua stream
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'avatars' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();

    // Cập nhật avatar user
    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      { avatar: result.secure_url },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedUser });
  } catch (err) {
    console.error('❌ Upload avatar failed:', err);
    res.status(500).json({ success: false, message: err.message || 'Upload failed' });
  }
});

module.exports = router;

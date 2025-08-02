const jwt = require("jsonwebtoken");
const User = require("../Models/Users");
const bcryptjs = require('bcryptjs');
const Otp = require("../Models/Otp");
const sendOTP = require("../Utils/SendEmail")
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || (await bcryptjs.compare(password, user.password)) === false) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({ token, userID: user._id });
};
const register = async (req, res) => {
  const { name, email, password } = req.body;
  const availableuser = await User.findOne({ email });
  if (availableuser) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const hashpassword = await bcryptjs.hash(password, 10);
  const newuser = new User({
    name,
    email,
    password: hashpassword,
  });
  await newuser.save();
  const token = jwt.sign({ userID: newuser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(201).json({ token, userID: newuser._id });
};
const CheckValidToken = async (req, res) => {
  const user = req.user;
  if (user) {
    return res.status(200).json({ message: "Token is Valid" });
  }
  else {
    return res.status(401).json({ message: "Invalid token" });
  }


}
const SendResetEmail = async (req, res) => {
  try {
    const { ResetEmail } = req.body;
    if (!ResetEmail) return res.status(400).json({ message: "Thiếu ResetEmail trong body" });

    const finduser = await User.findOne({ email: ResetEmail });
    if (!finduser) {
      return res.status(401).json({ message: "Không tìm thấy người dùng với email này" });
    }

    const otpnumber = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email: ResetEmail }); // Sửa chỗ này: tìm theo email

    const newOtp = new Otp({ email: ResetEmail, otp: otpnumber });
    await newOtp.save();

    await sendOTP(ResetEmail, otpnumber);
    res.json({ message: "OTP đã được gửi đến email" });
  } catch (error) {
    console.error("SendResetEmail error:", error);
    res.status(500).json({ message: "Lỗi server khi gửi OTP" });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPass } = req.body;

    const found = await Otp.findOne({ email, otp });
    if (!found) return res.status(400).json({ msg: "OTP không đúng hoặc đã hết hạn" });

    const hashedPassword = await bcryptjs.hash(newPass, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    await Otp.deleteMany({ email }); // Xóa OTP sau khi dùng
    res.json({ msg: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    console.error("ResetPassword error:", error);
    res.status(500).json({ msg: "Lỗi server khi đặt lại mật khẩu" });
  }
};
module.exports = { login, register, CheckValidToken,SendResetEmail,resetPassword};




































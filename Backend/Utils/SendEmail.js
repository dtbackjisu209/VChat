require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTP = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Mã OTP đổi mật khẩu",
            text: `Mã OTP của bạn là: ${otp}. OTP có hiệu lực trong 5 phút.`,
        });
     
        return { success: true, message: "Đã gửi OTP thành công" };
    } catch (error) {
        console.log("Gửi otp thất bại", error.message);
        return { success: false, message: "Gửi OTP thất bại" };
    }
};

module.exports = sendOTP;

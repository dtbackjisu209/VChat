const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const sendOTP = async (req, res) => {
    const { email, otp } = req.body;
    try{
         await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Mã OTP đổi mật khẩu",
        text: `Mã OTP của bạn là: ${otp}. OTP có hiệu lực trong 5 phút.`,

    })

    }
    catch(error)
    {
        console.log("Gửi otp thất bại",error.message);
    }
   
}
module.exports=sendOTP
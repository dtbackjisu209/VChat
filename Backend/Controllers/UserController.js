const User = require('../Models/Users');
const Message = require('../Models/Message');
const getuserfrominputtext = async (req, res) => {
    console.log('Gọi đến API tìm kiếm với name:', req.body.name);
    console.log("dữ liệu decoded", req);
    const searchname = req.body.name;
    try {
        const users = await User.find({
            name: { $regex: '^' + searchname, $options: 'i' }
        });


        res.status(200).json({ message: "successfully found", Users: users });


    }
    catch (error) {
        console.log(error.message);
    }


}
const getUserLoginID = async (req, res) => {
    try {
        console.log("ID người dùng là : ", req.user._id);
        res.status(200).json({ UserLoginID: req.user._id });
    }
    catch (error) {
        console.log("Lỗi lấy ID người dùng", error.message);
    }
}
const getUserAndLastMessage = async (req, res) => {
    try {
        const UserLoginID = req.user._id;

        const UserLastTextedMessage = await Message.find({
            $or: [
                { SenderID: UserLoginID, LastMessage: true },
                { ReceiverID: UserLoginID, LastMessage: true },


            ]
        }).sort({ TimeStamp: -1 })
        const result = await Promise.all(
            UserLastTextedMessage.map(async (msg) => {
                const otherUserID = (msg.SenderID.toString() === UserLoginID)
                    ? msg.ReceiverID
                    : msg.SenderID;

                const otherUser = await User.findById(otherUserID);
                return {
                    message: msg,
                    user: otherUser
                };
            })
        );
        res.status(200).json(result);
    }
    catch (error) { console.log("Không lấy được dữ liệu tin nhắn cuối", error) };
}
const getuseravatarandusername=async(req,res)=>{
    try{
        UserLoginID=req.user._id;
        const user = await User.findById(UserLoginID);

        res.status(200).json({Avatar: user.avatar,UserName:user.name})
    }
    catch(error)
    {
        console.log("Không lấy được ảnh",error.message);
    }

}
module.exports = { getuserfrominputtext, getUserLoginID, getUserAndLastMessage,getuseravatarandusername};

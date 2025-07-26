const Message = require('../Models/Message');
const getMessageAandB = async (req, res) => {
    const SendID = req.user._id;
    const ReceiveID = req.body.receiveid;
    console.log("ID người gửi", SendID);
    console.log("ID người nhận", ReceiveID);
   


    const MessageDataAandB = await Message.find({
        $or: [
            { SenderID: SendID, ReceiverID: ReceiveID },
            { SenderID: ReceiveID, ReceiverID: SendID },
        ],
    });
   

    console.log(MessageDataAandB)
    return res.status(200).json({ MessageDataAandB,SenderID:SendID})

}

module.exports = { getMessageAandB };
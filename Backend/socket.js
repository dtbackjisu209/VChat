const Message=require('./Models/Message')
const Socket = (io) => {
  const UserID = new Map();
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    socket.on("join", (userID) => {
      UserID.set(userID, socket.id);
      console.log(`User ${userID} joined with socket ID: ${socket.id}`);
    });
    socket.on("SendMessage", async(data) => {
      console.log("Dữ liệu tin nhắn:",data);
      const toSocketID = UserID.get(data.ReceiverID);

      const messagePayLoad = new Message({
        SenderID: data.SenderID,
        ReceiverID: data.ReceiverID,
        Content: data.sendMessageData,
        TimeStamp: Date.now(),
        SendStatus: true,
        LastMessage: true,
      });
    

      if (toSocketID) {
        messagePayLoad.setLastMessage();
        io.to(toSocketID).emit("receive-message", messagePayLoad);
        await messagePayLoad.save();
      }
      else
      {messagePayLoad.setLastMessage();
          await messagePayLoad.save();


      }

      socket.emit("receive-message", messagePayLoad);
    });

    socket.on("disconnected", () => {
      console.log("A user disconnected", socket.id);
    });
  });
};
module.exports = { Socket };

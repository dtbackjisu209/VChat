const Message = require('./Models/Message')
const Socket = (io) => {
  const UserID = new Map();
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    socket.on("join", (userID) => {
      if (!UserID.has(userID)) {
        UserID.set(userID, []);
      }
      UserID.get(userID).push(socket.id);
      console.log(`User ${userID} joined with socket ID: ${socket.id}`);
    });
    socket.on("SendMessage", async (data) => {
      console.log("Dữ liệu tin nhắn:", data);

      await Message.setPreviousMessageFalse(data.SenderID, data.ReceiverID);

      const messagePayLoad = new Message({
        SenderID: data.SenderID,
        ReceiverID: data.ReceiverID,
        Content: data.sendMessageData,
        TimeStamp: Date.now(),
        SendStatus: true,
        LastMessage: true,
      });

      await messagePayLoad.save();

      // Gửi tới tất cả socket của người nhận
      const receiverSockets = UserID.get(data.ReceiverID) || [];
      receiverSockets.forEach(id => {
        io.to(id).emit("receive-message", messagePayLoad);
      });

      // Gửi tới tất cả socket của chính người gửi (để sync đa thiết bị)
      const senderSockets = UserID.get(data.SenderID) || [];
      senderSockets.forEach(id => {
        io.to(id).emit("receive-message", messagePayLoad);
      });
    });



    socket.on("disconnect", () => {
      for (let [userID, sockets] of UserID.entries()) {

        UserID.set(userID, sockets.filter(id => id !== socket.id));


        if (UserID.get(userID).length === 0) {
          UserID.delete(userID);
          console.log(`User ${userID} disconnected (last device)`);
        }
      }
    });

  });
};
module.exports = { Socket };

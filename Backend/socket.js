// server/socket.js (hoặc file tương tự)
const Message = require('./Models/Message');

const Socket = (io) => {
  const UserID = new Map(); // map: userID -> socket.id

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("join", (userID) => {
      UserID.set(userID, socket.id);
      console.log(`User ${userID} joined with socket ID: ${socket.id}`);
    });

    socket.on("SendMessage", async (data) => {
      console.log("Dữ liệu tin nhắn:", data);
      const toSocketID = UserID.get(data.ReceiverID);
      console.log("toSocketID", toSocketID);
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

      if (toSocketID) {
        io.to(toSocketID).emit("receive-message", messagePayLoad);
      }
      // gửi lại cho sender (local echo)
      socket.emit("receive-message", messagePayLoad);
    });

    // forward offer với trường "from" là userID người gửi
    socket.on("call-offer", ({ to, offer }) => {
      const toSocketID = UserID.get(to);
      if (toSocketID) {
        // tìm userID của người gọi
        let callerUserID;
        for (let [uID, sID] of UserID.entries()) {
          if (sID === socket.id) {
            callerUserID = uID;
            break;
          }
        }
        io.to(toSocketID).emit("call-offer", { from: callerUserID, offer });
      } else {
        // tùy chọn: báo lỗi cho caller nếu người nhận không online
        socket.emit("call-unavailable", { to });
      }
    });

    // forward answer: to là userID của caller (người gọi)
    socket.on("call-answer", ({ to, answer }) => {
      const toSocketID = UserID.get(to);
      if (toSocketID) {
        io.to(toSocketID).emit("call-answer", { answer });
      }
    });

    // forward candidate
    socket.on("call-candidate", ({ to, candidate }) => {
      const toSocketID = UserID.get(to);
      if (toSocketID) {
        io.to(toSocketID).emit("call-candidate", { candidate });
      }
    });

    // call-ended: 'to' là userID -> chuyển sang socket id
    socket.on("call-ended", ({ to }) => {
      const toSocketID = UserID.get(to);
      if (toSocketID) {
        io.to(toSocketID).emit("call-ended");
      }
      // nếu muốn notify cả người gửi nữa, có thể socket.emit('call-ended')
    });

    socket.on("disconnect", () => {
      for (let [userID, socketID] of UserID.entries()) {
        if (socketID === socket.id) {
          UserID.delete(userID);
          console.log(`User ${userID} disconnected`);
          break;
        }
      }
    });
  });
};

module.exports = { Socket };

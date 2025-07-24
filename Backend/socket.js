
const Socket = (io) => {
  const UserID=new Map();
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    socket.on("join",(userID)=>{
      UserID.set(userID,socket.id);
      console.log(`User ${userID} joined with socket ID: ${socket.id}`);
    })
    socket.on("SendMessage", (data) => {
  const toSocketID = UserID.get(data.ReceiverID);

  const messagePayload = {
    SenderID: data.SenderID,
    ReceiverID: data.ReceiverID,
    Content: data.sendMessageData,
    TimeStamp: Date.now(),
    SendStatus: true,
    LastMessage: true,
  };

  
  if (toSocketID) {
    io.to(toSocketID).emit('receive-message', messagePayload);
  }


  socket.emit('receive-message', messagePayload);
});

    socket.on("disconnected", () => {
      console.log("A user disconnected", socket.id);
    });
  });
};
module.exports = { Socket };

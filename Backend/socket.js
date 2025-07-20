
const Socket = (io) => {
  const UserID=new Map();
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    socket.on("join",(userID)=>{
      UserID.set(userID,socket.id);
      console.log(`User ${userID} joined with socket ID: ${socket.id}`);
    })
    socket.on("disconnected", () => {
      console.log("A user disconnected", socket.id);
    });
  });
};
module.exports = { Socket };


const Socket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    socket.on("disconnected", () => {
      console.log("A user disconnected", socket.id);
    });
  });
};
module.exports = { Socket };

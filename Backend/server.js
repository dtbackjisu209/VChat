const app=require('./app');
const dbconnect=require('./config/db');
require('dotenv').config();
const http=require('http');
const {Server}=require('socket.io');
const socketconnect=require('./socket.js');
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ['GET', 'POST']
  }
});
socketconnect.Socket(io);
const PORT=process.env.PORT||5000;
dbconnect();
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    

});
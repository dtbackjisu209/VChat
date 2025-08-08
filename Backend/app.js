const express=require('express');



const authroutes=require('./Routes/AuthRoute');
const userroutes=require('./Routes/UserRoute');
const messageroutes=require('./Routes/MessageRoute');
const cors=require('cors');
const app=express();
const uploadroutes = require('./Routes/UploadRoute'); 
app.use(express.json());

app.use(cors({
    origin: ["https://v-chat-two.vercel.app"], 
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use('/api/auth',authroutes);
app.use('/api/user',userroutes);
app.use('/api/message',messageroutes);
app.use('/api/upload', uploadroutes); 
module.exports=app;






























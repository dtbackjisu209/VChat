const express=require('express');



const authroutes=require('./Routes/AuthRoute');
const userroutes=require('./Routes/UserRoute');
const messageroutes=require('./Routes/MessageRoute');
const cors=require('cors');
const app=express();
app.use(express.json());
app.use(cors());

app.use('/api/auth',authroutes);
app.use('/api/user',userroutes);
app.use('/api/message',messageroutes);
module.exports=app;






























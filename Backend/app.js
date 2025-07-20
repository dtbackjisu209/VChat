const express=require('express');



const authroutes=require('./Routes/AuthRoute');

const cors=require('cors');
const app=express();
app.use(express.json());
app.use(cors());

app.use('/api/auth',authroutes);

module.exports=app;






























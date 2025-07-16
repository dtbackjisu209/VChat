const app=require('./app');
const dbconnect=require('./config/db');
require('dotenv').config();

const PORT=process.env.PORT||5000;
dbconnect();
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    

});
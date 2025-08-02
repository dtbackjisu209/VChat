import axios from 'axios'
const SendResetEmail=async(ResetEmail)=>{
    try{
        const respone=await axios('http://localhost:5000/api/auth/SendResetEmail',ResetEmail);
        console.log(response);
    }
    catch(error)
    {
        console.log(error.message);
    }

}
export default SendResetEmail;

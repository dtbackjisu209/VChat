import axios from 'axios'
const resetPassword=async(data)=>{
    try{
        const response=await axios.post('http://localhost:5000/api/auth/resetPassword',data )
        console.log(response.data);
        return response.data;
    }
    catch(error)
    {
        console.log("Đặt lại mật khẩu thất bại".error.message);
    }

}
export default resetPassword;
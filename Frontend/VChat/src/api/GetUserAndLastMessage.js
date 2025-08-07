import axios from 'axios';
const  GetTextedUsersAndLastMessage=async()=>{
    try{
         const token = localStorage.getItem('token');
        
        const response=await axios.get('https://vchat-vd30.onrender.com/api/user/getUserAndLastMessage',
            {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
        );
        return response.data;
    }
    catch(error)
    {
        console.log("Lỗi không lấy được dữ liệu tin nhắn cuối",error);
    }
}
export default GetTextedUsersAndLastMessage;
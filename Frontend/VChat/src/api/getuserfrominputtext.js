import axios from 'axios';
const getuserfrominputtext=async(name)=>{
    try{
        const token = localStorage.getItem('token');
        console.log("TOKEN",token);
        const response=await axios.post('https://vchat-vd30.onrender.com/api/user/getuserfrominputtext',{name}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
        console.log(response.data);
        return response.data;

    }
    catch(error)
    {
        throw error;
    }
}
export default getuserfrominputtext;
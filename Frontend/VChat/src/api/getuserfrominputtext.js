import axios from 'axios';
const getuserfrominputtext=async(name)=>{
    try{
        const token = localStorage.getItem('token');
        console.log("TOKEN",token);
        const response=await axios.post('http://localhost:5000/api/user/getuserfrominputtext',{name}, {
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
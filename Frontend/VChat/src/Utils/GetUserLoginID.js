import axios from 'axios';
const GetUserLoginID=async()=>{
    try{
        const token = localStorage.getItem('token');
        console.log("TOKEN",token);
        const response=await axios.get('http://localhost:5000/api/user/getUserLoginID',{
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
export default  GetUserLoginID;

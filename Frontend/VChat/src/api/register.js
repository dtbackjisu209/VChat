import axios from 'axios';
const register=async(data)=>{
    try{
        const response=await axios.post("http://localhost:5000/api/auth/register", data);
        console.log(response.data);
        return response.data;
    }
    catch(error)
    {
        throw new Error("Registration failed: " + error.message);
    }
}
export default register;
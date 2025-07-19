import axios from 'axios';
const login=async(data)=>{
    try{
        const response=await axios.post("http://localhost:5000/api/auth/login", data);
        console.log(response.data);
        return response.data;
    }
    catch(error)
    {
        throw new Error("Login failed: " + error.message);
    }
}
export default login;
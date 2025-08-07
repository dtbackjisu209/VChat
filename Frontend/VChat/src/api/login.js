import axios from 'axios';
const login=async(data)=>{
    try{
        const response=await axios.post("https://vchat-vd30.onrender.com/api/auth/login", data);
        localStorage.setItem ("token", response.data.token);
        console.log(response.data);
        return response.data;
    }
    catch(error)
    {
        throw new Error("Login failed: " + error.message);
    }
}
export default login;
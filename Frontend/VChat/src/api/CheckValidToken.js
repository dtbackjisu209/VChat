
import axios from 'axios'

const CheckValidToken = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('https://vchat-vd30.onrender.com/api/auth/CheckValidToken', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return true; 
  } catch (error) {
    console.log("Token đã hết hạn hoặc không hợp lệ:", error.message);
    return false;
  }
};

export default CheckValidToken;

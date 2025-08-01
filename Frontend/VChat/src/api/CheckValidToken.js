
import axios from 'axios'

const CheckValidToken = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/auth/CheckValidToken', {
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

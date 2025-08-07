import axios from 'axios'
const getavatarandusername = async () => {
  try {
    const token = localStorage.getItem('token'); 
    const response = await axios.get('https://vchat-vd30.onrender.com/api/user/getuseravatarandusername', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log("Lỗi ko lấy được avatar", error.message);
  }
}

export default getavatarandusername;
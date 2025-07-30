import axios from 'axios';
const GetUserLoginID = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn("Không có token, chưa đăng nhập.");
      return null; // hoặc throw new Error("No token");
    }
    console.log("TOKEN", token);
    const response = await axios.get('http://localhost:5000/api/user/getUserLoginID', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("ID người dùng abcxyz",response.data);
    return response.data;

  }
  catch (error) {
    throw error;
  }
}
export default GetUserLoginID;

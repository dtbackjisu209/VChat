import axios from 'axios';

const SendResetEmail = async (ResetEmail) => {
  return await axios.post('https://vchat-vd30.onrender.com/api/auth/SendResetEmail', {
    ResetEmail: ResetEmail
  });
};

export default SendResetEmail;

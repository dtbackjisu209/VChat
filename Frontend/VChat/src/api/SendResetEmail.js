import axios from 'axios';

const SendResetEmail = async (ResetEmail) => {
  return await axios.post('http://localhost:5000/api/auth/SendResetEmail', {
    ResetEmail: ResetEmail
  });
};

export default SendResetEmail;

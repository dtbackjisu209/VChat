import axios from 'axios';

export const uploadAvatar = async (file, userId) => {
  const formData = new FormData();
  formData.append('avatar', file);
  formData.append('userId', userId);

  try {
    const res = await axios.post('http://localhost:5000/api/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err) {
    console.error('Lỗi khi upload ảnh:', err);
    throw err;
  }
};

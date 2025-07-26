import GetTextedUsersAndLastMessage from '../api/GetUserAndLastMessage.js';
export default async function updateRecentUsers() {
  try {
    const data = await GetTextedUsersAndLastMessage();
    return data.map((item) => ({
      message: item.message,
      user: item.user,
    }));
  } catch (error) {
    console.error('Lỗi khi cập nhật danh sách người đã nhắn:', error);
    return [];
  }
}
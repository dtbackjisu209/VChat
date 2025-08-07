import { io } from 'socket.io-client'

const socket = io('https://vchat-vd30.onrender.com') // Đổi thành địa chỉ backend của bạn

export default socket

import { io } from 'socket.io-client'

const socket = io('http://localhost:5000') // Đổi thành địa chỉ backend của bạn

export default socket

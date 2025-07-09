import { io } from 'socket.io-client'

const baseURL = import.meta.env.VITE_API_BASE_URL
const socketURL = `${baseURL}`.replace('/api', '')


export async function initializeSocket() {
  try {
    console.log("Waking up backend...")

    await fetch(socketURL + '/', {
      method: 'GET',
      credentials: 'include',
    })

    console.log("Backend is awake. Connecting socket...")

    const socket = io(socketURL, {
      transports: ['websocket'],
      withCredentials: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 10000,
    })

    socket.on("connect", () => {
      console.log("Socket.IO connected:", socket.id)
    })

    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err)
    })

    return socket
  } catch (err) {
    console.error("Failed to wake backend:", err)
    return null
  }
}

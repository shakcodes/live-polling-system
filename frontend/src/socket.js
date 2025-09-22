import { io } from "socket.io-client";

const socket = io("https://live-polling-system-2-4qph.onrender.com"); // ✅ Render backend
export default socket;

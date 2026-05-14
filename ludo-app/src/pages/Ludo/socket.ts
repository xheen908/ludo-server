// src/socket.js
import { io } from "socket.io-client";

const socket = io("https://ludogame.x3.dynu.com"); // Passen Sie die URL entsprechend an

export default socket;

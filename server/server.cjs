const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("createRoom", (roomId) => {
    if (!rooms[roomId]) {
      rooms[roomId] = { players: [], gameState: null };
      socket.join(roomId);
      rooms[roomId].players.push({ id: socket.id, name: null });
      console.log(`Room ${roomId} created, current players: ${rooms[roomId].players.length}`);
    } else {
      socket.emit("error", "Room already exists");
      console.log(`Room ${roomId} already exists`);
    }
  });

  socket.on("joinRoom", (roomId, playerName) => {
    if (rooms[roomId] && rooms[roomId].players.length < 4) {
      socket.join(roomId);
      rooms[roomId].players.push({ id: socket.id, name: playerName });
      io.to(roomId).emit("updatePlayers", rooms[roomId].players);
      console.log(`Player ${playerName} joined room ${roomId}, current players: ${rooms[roomId].players.length}`);
      if (rooms[roomId].players.length === 4) {
        io.in(roomId).emit("gameStart");
        console.log(`Room ${roomId} is full, game starting.`);
      }
    } else {
      socket.emit("error", "Room is full or does not exist");
      console.log(`Failed to join room ${roomId}. Room is full or does not exist.`);
    }
  });

  socket.on("updateState", (roomId, newState) => {
    if (rooms[roomId]) {
      rooms[roomId].gameState = newState;
      socket.to(roomId).emit("updateState", newState);
      console.log(`State updated for room ${roomId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
    for (const roomId in rooms) {
      const index = rooms[roomId].players.findIndex(player => player.id === socket.id);
      if (index !== -1) {
        rooms[roomId].players.splice(index, 1);
        io.to(roomId).emit("updatePlayers", rooms[roomId].players);
        console.log(`Player left room ${roomId}, current players: ${rooms[roomId].players.length}`);
        if (rooms[roomId].players.length === 0) {
          delete rooms[roomId];
          console.log(`Room ${roomId} deleted`);
        }
      }
    }
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});

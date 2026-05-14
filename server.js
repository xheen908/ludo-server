// server.js
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

// Importiere deine neue Socket-Handler-Funktion
const { socketHandler } = require("./components/socketHandler");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Statische Dateien
app.use(express.static("public"));
app.use("/public", express.static(path.join(__dirname, "public")));

// Hier packen wir nun die Datenstrukturen rein,
// die für Socket.IO relevant sind und geben sie später an socketHandler weiter:
const waitingQueues = {
  2: [],
  4: [],
};

const rooms = {};
const colorsByMode = {
  2: ["red", "blue"],
  4: ["red", "blue", "green", "yellow"],
};

// ----- ROUTES -----

// Startseite
app.get("/", (req, res) => {
  const serverStatus = {
    onlinePlayers: io.engine.clientsCount,
    activeRooms: Object.keys(rooms).length,
  };
  res.render("index", { serverStatus });
});

// Admin-Übersicht
app.get("/admin", (req, res) => {
  const serverStatus = {
    onlinePlayers: io.engine.clientsCount,
    activeRooms: Object.keys(rooms).length,
  };
  res.render("admin", {
    waitingQueues,
    rooms,
    serverStatus,
  });
});

// Spezifische Room-Ansicht
app.get("/admin/room/:roomId", (req, res) => {
  const { roomId } = req.params;
  const room = rooms[roomId];

  if (!room) {
    return res.status(404).send("Raum nicht gefunden.");
  }

  res.render("room", {
    roomId,
    room,
  });
});

app.use('/ludo', express.static(path.join(__dirname, 'ludo-app', 'dist')));

// Fallback: Für alle Routen unter /demo wird index.html ausgeliefert
app.get('/ludo/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'ludo-app', 'dist', 'index.html'));
});

// ---------------------------------
// Initialisiere Socket-IO in einer separaten Datei
// ---------------------------------
socketHandler(io, waitingQueues, rooms, colorsByMode);

// Server starten
const PORT = process.env.PORT || 8888;
server.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});



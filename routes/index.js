// routes/index.js

const express = require("express");

module.exports = function(io, rooms, waitingQueues) {
  const router = express.Router();

  router.get("/", (req, res) => {
    const serverStatus = {
      onlinePlayers: io.engine.clientsCount,
      activeRooms: Object.keys(rooms).length,
    };

    res.render("index", { serverStatus });
  });

  return router;
};

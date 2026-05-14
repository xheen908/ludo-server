// routes/admin.js

const express = require("express");


module.exports = function(io, rooms, waitingQueues) {
  const router = express.Router();

  router.get("/admin", (req, res) => {
    console.log("Aktuelle Räume:", rooms);
    res.render("admin", {
      waitingQueues,
      rooms,
      serverStatus,
    });
  });
  router.get("/admin/room/:roomId", (req, res) => {
    const { roomId } = req.params;
    const room = rooms[roomId];

    if (!room) {
      return res.status(404).send("Raum nicht gefunden.");
    }

    console.log(`Raum ${roomId} Daten:`, room);
    res.render("room", {
      roomId,
      room,
    });
  });

  return router;
};

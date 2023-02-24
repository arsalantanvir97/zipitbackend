const express = require("express");
const router = express.Router();
const StationController = require("../controller/stationController");
router.get("/allstations", StationController.getAllStations);
router.get("/station", StationController.getStation);
module.exports = router;

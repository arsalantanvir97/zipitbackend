require("dotenv").config();
const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const axios = require("axios");
const app = express();
const feedbackRoutes = require("./routes/feedbackRoutes");

const Port = process.env.Port || 6058;
const connection = require("./config/db");

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use("/api/feedback", feedbackRoutes);

//connecting the db
connection();

const local = false;
let credentials = {};

if (local) {
  credentials = {
    key: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.key", "utf8"),
    cert: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.crt", "utf8"),
    ca: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.ca"),
  };
} else {
  credentials = {
    key: fs.readFileSync("../certs/ssl.key"),
    cert: fs.readFileSync("../certs/ssl.crt"),
    ca: fs.readFileSync("../certs/ca-bundle"),
  };
}

app.get("/", (req, res) => {
  res.send("Zip it solar is Running");
});

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(Port, () => {
  console.log(`Server is running at the port ${Port}`);
});

//for filtering the tesla stations
app.use("/test", async (req, res) => {
  try {
    const { language, state, lat, long } = req.query;
    let { data } = await axios({
      method: "GET",
      url: `${process.env.TESLA_API}lang=${language}&q=${state}&loc=${lat},${long}`,
    });
    // console.log("owner",data.)
    data = data.filter((x) => x.operator == "Tesla");
    return res.status(200).json({ data });
  } catch (err) {
    console.log("Error", err);
    return res.status(500).json(err);
  }
});

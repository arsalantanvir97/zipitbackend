require("dotenv").config();
const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const axios = require("axios");
const uuid   = require("uuid")

const app = express();
const feedbackRoutes = require("./routes/feedbackRoutes");
const stationRoutes = require("./routes/stationRoutes");
const userRoutes = require("./routes/userRoutes");

const foreCast = require("./utils/forecast");
const geoCode = require("./utils/geocode");
const Stripe  = require("stripe")
const stripe = Stripe("sk_test_OVw01bpmRN2wBK2ggwaPwC5500SKtEYy9V");

const Port = process.env.Port || 6058;
const connection = require("./config/db");

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use("/api/feedback", feedbackRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/user", userRoutes);

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
app.post("/api/checkout", async (req, res) => {
  console.log("Request:", req.body);

  let error;
  let status;
  try {
    const { product, token } = req.body;
    console.log(product, typeof product, "prodprice");
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

    const idempotency_key =  uuid.v4()
    console.log('idempotency_key',idempotency_key,customer)
    const charge = await stripe.charges.create(
      {
        amount: product * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        // description: `Purchased the ${product.name}`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip
          }
        }
      },
      { idempotencyKey: idempotency_key }
    );
    console.log("Charge:", { charge });
    res.json(charge);

    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
    res.json(error);
  }
});
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

//for current weather
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Please provide a Location",
    });
  }
  geoCode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        res.send({ error });
      }
      foreCast(latitude, longitude, (error, forecastData) => {
        if (error) {
          res.send({ error });
        }
        console.log("forecastData", forecastData);
        res.send({
          forecast: forecastData,
        });
      });
    }
  );
});

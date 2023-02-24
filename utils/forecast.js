const request = require("request");
const foreCast = (lat, long, callback) => {
  const URL = `http://api.weatherstack.com/current?access_key=25eecd826e171848e1f52800b37abac6&query=${encodeURIComponent(
    lat
  )},${encodeURIComponent(long)}`;
  request({ url: URL, json: true }, (Error, { body }) => {
    if (Error) {
      callback("Unable to connect with the WeatherStack API", undefined);
    } else if (body.error) {
      callback("Unable to find the location", undefined);
    } else {
      callback(undefined, body.current);
    }
  });
};
module.exports = foreCast;

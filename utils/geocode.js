const request = require("request");
const geoCode = (address, callback) => {
  const URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/ ${encodeURIComponent(
    address
  )} .json?access_token=pk.eyJ1IjoiYWxpbXVoYW1tYWQiLCJhIjoiY2t0eXRicXZoMGR4ZjMxczgyY29md2N3byJ9.U_O8d_rndESxU4hfrQ6f3w`;
  request({ url: URL, json: true }, (Error, { body }) => {
    if (Error) {
      callback("Unable to connect with the Mapbox API", undefined);
    } else if (body.features.length == 0) {
      callback("Unable to find location", undefined);
    } else {
      console.log(
        "lat&long",
        body.features[0].center[0],
        body.features[0].center[1]
      );
      callback(undefined, {
        longitude: body.features[0].center[0],
        latitude: body.features[0].center[1],
        location: body.features[0].place_name,
      });
    }
  });
};
module.exports = geoCode;

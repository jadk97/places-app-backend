const API_KEY = "YOUR_API_KEY";
const axios = require("axios");
const HttpError = require("../models/http-error");

async function getCoordsForAddress(address) {
  const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${API_KEY}`);

  const data = response.data;
  console.log(data);
  if(data.features.length === 0){
    const error = new HttpError("Could not find a location for the specified address", 422);
    throw error;
  }
  const coordinates = {lat: data.features[0].center[1], lng: data.features[0].center[0]};
  return coordinates;
}

module.exports = getCoordsForAddress;
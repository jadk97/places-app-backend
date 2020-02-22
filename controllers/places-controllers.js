const HttpError = require("../models/http-error");
const uuid = require("uuid/v4");
const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: "20 W 34th ST, New York, NY 10001",
    creator: "u1"
  }
];

const getPlaceById = (req, res, next) => {

  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => p.id === placeId);

  if (!place) {
    const error = new HttpError("Could not find a place for that provided id.", 404);
    return next(error);
  }

  res.json({ place });

};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((p) => p.creator === userId);

  if (!place) {
    const error = new HttpError("Could not find a place for that provided user id.", 404);
    return next(error);
  }

  res.json({ place });
}

const createPlace = (req, res, next) => {
 const { title, description, coordinates, address, creator} = req.body;
 
 const createdPlace = {
   id: uuid(),
   title,
   description,
   location: coordinates,
   address,
   creator
 }

 DUMMY_PLACES.push(createdPlace);
 res.status(201).json({ place: createdPlace});
}

module.exports = { getPlaceById, getPlaceByUserId, createPlace };
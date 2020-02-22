const HttpError = require("../models/http-error");
const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
let DUMMY_PLACES = [
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

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => p.creator === userId);

  if (!places || places.length === 0) {
    const error = new HttpError("Could not find a place for that provided user id.", 404);
    return next(error);
  }

  res.json({ places });
}

const createPlace = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const error = new HttpError("Invalid inputs passed, please check your data.", 422);
    return next(error);
  }
  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator
  }

  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
}

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) };

  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace })
}

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
  res.status(200).json({message: `Deleted place with id: ${placeId}`});
}

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace
};
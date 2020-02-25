const HttpError = require("../models/http-error");
const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");

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

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  }
  catch (err) {
    const error = new HttpError("Something went wrong, could not find the place.", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find a place for that provided id.", 404);
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });

};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;

  try {
    places = await Place.find({ creator: userId })
  }
  catch (err) {
    const error = new HttpError("Fetching places failed, please try again later.", 500);
    return next(error);
  }

  if (!places || places.length === 0) {
    const error = new HttpError("Could not find a place for that provided user id.", 404);
    return next(error);
  }

  res.json({ places: places.map(place => place.toObject({ getters: true })) });
}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs passed, please check your data.", 422);
    return next(error);
  }
  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  }
  catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: "https://untappedcities.com/wp-content/uploads/2015/07/Flatiron-Building-Secrets-Roof-Basement-Elevator-Sonny-Atis-GFP-NYC_5.jpg",
    creator
  });

  try {
    await createdPlace.save();
  }
  catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
}

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs passed, please check your data.", 422);
    return next(error);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  }
  catch (err) {
    const error = new HttpError("Something went wrong, could not update place", 500);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  }
  catch (err) {
    const error = new HttpError("Something went wrong, could not update place", 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
}

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  
  let place;

  try {
    place = await Place.findById(placeId);
  }
  catch (err) {
    const error = new HttpError("Something went wrong, could not delete place.", 500);
    return next(error);
  }

  try{
    await place.remove();
  }
  catch(err){
    const error = new HttpError("Something went wrong, could not delete place.", 500);
    return next(error);
  }

  res.status(200).json({ message: `Deleted place with id: ${placeId}` });
}

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace
};
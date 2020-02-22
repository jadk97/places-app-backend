const express = require('express');
const placesControllers = require("../controllers/places-controllers");

const router = express.Router();


router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.patch("/:pid", placesControllers.updatePlace);
router.delete("/:pid", placesControllers.deletePlace);
router.post("/", placesControllers.createPlace);
module.exports = router;
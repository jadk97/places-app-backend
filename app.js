const express =require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");


const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-fuyhi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", 
  "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Route not found.", 404);
  throw error;
})

app.use((error, req, res, next) => {
  if(res.headerSent){
    return next(error);
  }
  res.status(error.code || 500);
  res.json({message: error.message || "An unknown error ocurred!"});
});

mongoose
.connect(url)
.then(() => {
  app.listen(5000);
})
.catch((error) => {
  console.log(error);
});


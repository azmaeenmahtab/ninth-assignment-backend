const express = require('express');
const dotenv = require("dotenv")
const app = express();
dotenv.config()
const port = 5000;
const cors = require('cors');

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

const addpetRoute = require('./routes/add-pet.route');
app.use("/", addpetRoute);

const adoptionRequestsRoute = require('./routes/adoption-requests.route');
app.use("/", adoptionRequestsRoute);

const getAllPetsRoute = require('./routes/get-all-pets.route');
app.use("/", getAllPetsRoute);

const getSinglePetRoute = require('./routes/get-single-pet.route');
app.use("/", getSinglePetRoute);

const getListingRoute = require('./routes/get-listing.route');
app.use("/", getListingRoute);

const requestAdoptionRoute = require('./routes/request-adoption.route');
app.use("/", requestAdoptionRoute);

const updatePetRoute = require('./routes/update-pet.route');
app.use("/", updatePetRoute);


module.exports = { app };
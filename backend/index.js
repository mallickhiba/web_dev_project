require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./routes/index');
 
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

(async () => {
    try {
        await mongoose.connect("mongodb+srv://mallickhiba:6k01T6hQZH3zN463@cluster0.hlhg6oe.mongodb.net/wed-dev")
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

app.use('/', router);

app.use(function (req, res, next) {
    console.log(req.body);
    console.log("at middleware");
    next(createError(404)); // middleware 
});

const PORT = 5600;
app.listen(PORT, console.log(`Server running port ${PORT}`));
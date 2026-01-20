const express = require('express');
const app = express.Router();
const controller = require('../controllers/booking.controller');

app.get('/', controller.getBookings);
app.get('/:id', controller.getBookingById);
app.post('/', controller.createBooking);
app.put('/:id', controller.updateBooking);
app.delete('/:id', controller.deleteBooking);

module.exports = app;

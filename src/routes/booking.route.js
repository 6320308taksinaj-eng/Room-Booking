const express = require('express');
const app = express.Router();
const controller = require('../controllers/booking.controller');

app.get('/', 
    // #swagger.tags = ['Bookings']
    // #swagger.description = 'การจองห้องพักทั้งหมด'
    controller.getBookings);

app.get('/:id', 
    // #swagger.tags = ['Bookings']
    // #swagger.description = 'ดึงข้อมูลการจองห้องพักตามid'
    controller.getBookingById);

app.post('/', 
    // #swagger.tags = ['Bookings']
    // #swagger.description = 'สร้างข้อมูลการจองห้องพักใหม่'
    controller.createBooking);

app.put('/:id', 
    // #swagger.tags = ['Bookings']
    // #swagger.description = 'อัปเดตข้อมูลการจองห้องพักตามid'
    controller.updateBooking);
    
app.delete('/:id', 
    // #swagger.tags = ['Bookings']
    // #swagger.description = 'ลบข้อมูลการจองห้องพักตามid'
    controller.deleteBooking);

module.exports = app;

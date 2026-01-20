const express = require('express');
const app = express.Router();
const controller = require('../controllers/room.controller');

app.get('/', 
    // #swagger.tags = ['Rooms']
    // #swagger.description = 'ห้องพักทั้งหมด'
    controller.getRooms);


app.get('/q/capacity/:min/:max', 
    // #swagger.tags = ['Rooms']
    // #swagger.description = 'รายการห้องพักตามช่วงความจุ'
    controller.getRoomsByCapacityRange);
// /q/capacity/100
app.get('/q/capacity/:capacity', 
    // #swagger.tags = ['Rooms']
    // #swagger.description = 'รายการห้องพักตามความจุ'
    controller.getRoomsByCapacity);


app.get('/:id', 
    // #swagger.tags = ['Rooms']
    // #swagger.description = 'ห้องพักตามid'
    controller.getRoomById);

app.post('/', 
    // #swagger.tags = ['Rooms']
    // #swagger.description = 'สร้างห้องพักใหม่'
    controller.createRoom);

app.put('/:id', 
    // #swagger.tags = ['Rooms']
    // #swagger.description = 'อัปเดตข้อมูลห้องพักตามid'
    controller.updateRoom);

app.delete('/:id', 
    // #swagger.tags = ['Rooms']
    // #swagger.description = 'ลบข้อมูลห้องพักตามid'
    controller.deleteRoom);

module.exports = app;
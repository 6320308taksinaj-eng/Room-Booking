const express = require('express');
const app = express.Router();
const controller = require('../controllers/user.controller');

app.get('/', 
    // #swagger.tags = ['User']
    // #swagger.description = 'ข้อมูลผู้ใช้ทั้งหมด'
    controller.getUsers);

app.get('/:id', 
    // #swagger.tags = ['User']
    // #swagger.description = 'ดึงข้อมูลผู้ใช้ตามid'
    controller.getUserById);

app.post('/', 
    // #swagger.tags = ['User']
    // #swagger.description = 'สร้างข้อมูลผู้ใช้'
    controller.createUser);

app.put('/:id', 
    // #swagger.tags = ['User']
    // #swagger.description = 'อัปเดตข้อมูลผู้ใช้ตามid'
    controller.updateUser);

app.delete('/:id', 
    // #swagger.tags = ['User']
    // #swagger.description = 'ลบข้อมูลผู้ใช้ตามid'
    controller.deleteUser);

module.exports = app;



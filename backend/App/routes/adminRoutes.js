const express = require('express');
const adminRoutes = express.Router();
const adminController = require('../controllers/adminController');


adminRoutes.post('/register', adminController.AdminRegister);
adminRoutes.get('/dashboard/infos', adminController.GetDashboardAdmin);
adminRoutes.get('/admin/all/reservations', adminController.GetAllReservationsAdmin);
adminRoutes.get('/admin/all/users', adminController.GetAllUsersAdmin);
adminRoutes.get('/admin/all/drivers', adminController.GetAllDriversAdmin);
adminRoutes.get('/admin/all/cars', adminController.GetAllCarsAdmin);

module.exports = adminRoutes;
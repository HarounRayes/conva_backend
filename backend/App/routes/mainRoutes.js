const express = require('express');
const mainRoutes = express.Router();


const userController = require('../controllers/userController');
const clientController = require('../controllers/clientController');
const driverController = require('../controllers/driverController');
const paymentController = require('../controllers/paymentController');
const carController = require('../controllers/carController');
const cityController = require('../controllers/cityController');
const ratingController = require('../controllers/ratingController');
const reservationController = require('../controllers/reservationController');
const reservationPlacesController = require('../controllers/reservationPlacesController');
const {checkAuthToken, checkDriverAuthToken} = require('./../services/jwt');

// user Routes
mainRoutes.post('/user/updateinfo', checkAuthToken, userController.UpdateInfo);
mainRoutes.post('/user/updatepassword', checkAuthToken, userController.UpdatePassword);
mainRoutes.get('/user/historics', checkAuthToken, userController.GetUserHistorics);
mainRoutes.get('/user/isvalid', checkAuthToken, userController.IsValidUser);



// Client Routes
mainRoutes.post('/client/register', clientController.Register);
mainRoutes.post('/client/update/profile/:id', clientController.UpdateProfile);
mainRoutes.post('/client/update/card', checkAuthToken, clientController.UpdateCardID);
mainRoutes.get('/client/check/card', checkAuthToken, clientController.CheckCardID);
mainRoutes.get('/client/delete/:id', clientController.RemoveClient);
mainRoutes.get('/client/auth', checkAuthToken, clientController.GetAuthClient);
mainRoutes.get('/client/:id', clientController.GetClient);
mainRoutes.get('/client/all', clientController.GetAllClients);


// driver Routes
mainRoutes.post('/driver/register', driverController.Register);
mainRoutes.post('/driver/update/profile/:id', driverController.UpdateProfile);
mainRoutes.post('/driver/update/card', checkAuthToken, driverController.UpdateCardID);
mainRoutes.get('/driver/check/card', checkAuthToken, driverController.CheckCardID);
mainRoutes.get('/driver/delete/:id', driverController.RemoveDriver);
mainRoutes.get('/driver/:id', driverController.GetDriver);
mainRoutes.get('/driver/auth/getid', checkAuthToken, driverController.GetDriverId);
mainRoutes.get('/driver/get/auth', checkAuthToken, driverController.GetAuthDriver);
mainRoutes.get('/driver/all', driverController.GetAllDrivers);
mainRoutes.get('/driver/reservations/all/:driver_id', checkAuthToken, driverController.GetDriverReservations);
mainRoutes.get('/driver/cars/:driver_id', checkAuthToken, driverController.GetDriverCars);


// driver payments routes
mainRoutes.post('/payment/post', paymentController.postPayment);
mainRoutes.post('/payment/evalute', paymentController.EvalutaePayment);
mainRoutes.get('/payment/driver/:id', paymentController.GetDriverPayments);
mainRoutes.get('/payment/statistics/:id', checkAuthToken, paymentController.PaymentStatistics);
mainRoutes.get('/payment/infos/driver', checkAuthToken, paymentController.PaymentDriverInfo);



// Car Routes
mainRoutes.post('/car/add', checkDriverAuthToken, carController.AddCar);
mainRoutes.post('/car/update/:id', carController.UpdateCar);
mainRoutes.get('/car/:id', carController.GetCar);
mainRoutes.get('/cars/driver/:driver_id', checkAuthToken, carController.GetCarsForDriver);
mainRoutes.get('/car/remove/:id', carController.RemoveCar);
mainRoutes.get('/driver/all', carController.GetAllCars);


// City Routes
mainRoutes.post('/city/add', cityController.AddCity);
mainRoutes.post('/city/update/:id', cityController.UpdateCity);
mainRoutes.get('/city/:id', cityController.GetCity);
mainRoutes.get('/city/remove/:id', cityController.RemoveCity);
mainRoutes.get('/city/all/get', cityController.GetAllCities);

// Rating Driver Routes
mainRoutes.post('/rating/post', checkAuthToken, ratingController.PostRating);
mainRoutes.get('/get/ratings', checkAuthToken, ratingController.getAvailableRating);
mainRoutes.post('/edit/ratings', checkAuthToken, ratingController.editRatingStatus);

// Reservation Routes
mainRoutes.post('/reservation/add', reservationController.AddReservation);
mainRoutes.post('/reservation/update/:id', reservationController.UpdateReservation);
mainRoutes.get('/reservation/:id', reservationController.GetReservation);
mainRoutes.get('/reservation/places/:id', reservationController.GetReservationPlaces);
mainRoutes.get('/reservation/get/all', reservationController.GetAllReservations);
mainRoutes.post('/reservation/get/filter', reservationController.GetReservationsFilter);
mainRoutes.post('/reservation/get/search', reservationController.GetReservationsSearch);
mainRoutes.get('/reservation/remove/:id', checkDriverAuthToken, reservationController.RemoveReservation);


// Reservation_Places Routes
mainRoutes.post('/reservation/places/add', checkAuthToken, reservationPlacesController.AddReservationPlace);
mainRoutes.post('/reservation/places/update/:id', reservationPlacesController.UpdateReservationPlace);
mainRoutes.get('/user/reserved/places', checkAuthToken, reservationPlacesController.GetReservationPlaces);
mainRoutes.get('/reservation/place/remove/:id', checkAuthToken, reservationPlacesController.RemoveReservationPlace);
mainRoutes.get('/get/places/reservation/:id', reservationPlacesController.GetAllReservationPlacesInReservation);
mainRoutes.post('/evalute/place', checkAuthToken, reservationPlacesController.EvaluateReservationPlace);


module.exports = mainRoutes;
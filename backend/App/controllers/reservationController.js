const conn = require('../database/connection').pool;

function AddReservation (req, res) {

    conn.getConnection((err, connection) => {

        var { driverId, sCityId, sCityPlace, eCityId, eCityPlace, carId, startDate, startTime, estimateTime, placesNumber, price, mapDestination, mapOrigin } = req.body;

        const record = {
            driver_id: driverId,
            s_city_id: sCityId,
            s_city_place: sCityPlace,
            e_city_id: eCityId,
            e_city_place: eCityPlace,
            car_id: carId,
            start_date: startDate,
            start_time: startTime,
            estimate_time: estimateTime,
            place_numbers: placesNumber,
            price: price,
            map_destination: mapDestination,
            map_origin: mapOrigin,
        };

        connection.query("INSERT INTO reservations SET ?", record, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json({
                msg: 'The Reservation Has Been Added',
            });
        }); 
    });
}

function UpdateReservation (req, res) {

    const id = req.params.id;

    conn.getConnection((err, connection) => {            
        
        var { s_city_id, e_city_id, start_time, estimate_time, place_numbers, price } = req.body;

        const query = `UPDATE reservations SET 
                s_city_id = ?,
                e_city_id = ?, 
                start_time = ?, 
                estimate_time = ?, 
                place_numbers = ?, 
                price = ? 
            WHERE id = ?`;
        
        connection.query(query, [s_city_id, e_city_id, start_time, estimate_time, place_numbers, price, id], (err, result) => {
            if (err) throw err;
            connection.release();
            res.json({
                msg: 'The Reservation Has Been Updated',
            });
        });
    });
}

function GetReservation (req, res){
    const id = req.params.id;
    conn.getConnection((err, connection) => {            
        connection.query("SELECT * FROM reservations WHERE id = ?", id, (err, result) => {
            if (err) throw err;
            connection.release(); 
            res.json(result[0]);
        });
    });
}

function GetReservationPlaces (req, res){
    const id = req.params.id;
    conn.getConnection((err, connection) => {     
        const query = `
            SELECT * FROM reservation_place WHERE reservation_id = ?
        `;       
        connection.query(query, id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result);
        });
    });
}

function GetAllReservations (req, res){
    // how many item for one page
    const limit = 25;

    // the page we are currently checking
    const page = req.query.page ?? 1;

    const offset = (page - 1) * limit;


    conn.getConnection((err, connection) => {


        const query = `
            SELECT r.*, sc.name AS s_name, ec.name AS e_name, c.car_name, d.profile, u.name AS user_name, d.id as driver_id, 
                (SELECT count(*) FROM reservation_place rp WHERE r.id = rp.reservation_id) AS placeCount,
                (SELECT IFNULL(AVG(driver_stars),0) FROM trips_rating tr WHERE tr.driver_id = r.driver_id) AS driver_rate
            FROM reservations r
                JOIN cities sc ON r.s_city_id = sc.id  
                JOIN cities ec ON r.e_city_id = ec.id
                JOIN cars c ON c.id = r.car_id
                JOIN drivers d ON d.id = r.driver_id
                JOIN users u ON d.user_id = u.id
            WHERE r.status = 0 AND (cast(concat(start_date, ' ', start_time) as datetime) >= now())
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `;


        connection.query(query, [limit, offset], (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result);
        });

    });
}

function GetReservationsFilter (req, res){

    // how many item for one page
    const limit = 25;

    // the page we are currently checking
    const page = req.query.page ?? 1;
    const offset = (page - 1) * limit;

    const {sCityId, eCityId, minPrice, maxPrice, placesNumber, sorted} = req.body;

    conn.getConnection((err, connection) => {  

        const query = `
            SELECT r.*, sc.name AS s_name, ec.name AS e_name, c.car_name, d.profile, u.name AS user_name, d.id as driver_id, 
                (SELECT count(*) FROM reservation_place rp WHERE r.id = rp.reservation_id) AS placeCount,
                (SELECT IFNULL(AVG(rate_value),0) FROM drivers_rating dr WHERE dr.driver_id = r.driver_id) AS driver_rate,
                (SELECT IFNULL(AVG(rate_value),0) FROM cars_rating cr WHERE cr.car_id = r.car_id) AS car_rate
            FROM reservations r
                JOIN cities sc ON r.s_city_id = sc.id  
                JOIN cities ec ON r.e_city_id = ec.id
                JOIN cars c ON c.id = r.car_id
                JOIN drivers d ON d.id = r.driver_id
                JOIN users u ON d.user_id = u.id
            WHERE r.status = 0 AND r.s_city_id = ? AND r.e_city_id = ? AND r.price >= ? AND r.price <= ? 
                AND (r.place_numbers - (SELECT count(*) FROM reservation_place rp WHERE r.id = rp.reservation_id)) >= ?
                AND (cast(concat(start_date, ' ', start_time) as datetime) >= now())
            ORDER BY ? DESC
            LIMIT ? OFFSET ?
        `;    

        connection.query(query, [sCityId, eCityId, minPrice, maxPrice, placesNumber, sorted, limit, offset],(err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result);
        });
    });
}

function GetReservationsSearch (req, res){

    // how many item for one page
    const limit = 25;

    // the page we are currently checking
    const page = req.query.page ?? 1;
    const offset = (page - 1) * limit;

    const {city} = req.body;



    conn.getConnection((err, connection) => {  

        const query = `
            SELECT r.*, sc.name AS s_name, ec.name AS e_name, c.car_name, d.profile, u.name AS user_name, d.id as driver_id, 
                (SELECT count(*) FROM reservation_place rp WHERE r.id = rp.reservation_id) AS placeCount,
                (SELECT IFNULL(AVG(rate_value),0) FROM drivers_rating dr WHERE dr.driver_id = r.driver_id) AS driver_rate,
                (SELECT IFNULL(AVG(rate_value),0) FROM cars_rating cr WHERE cr.car_id = r.car_id) AS car_rate
            FROM reservations r
                JOIN cities sc ON r.s_city_id = sc.id  
                JOIN cities ec ON r.e_city_id = ec.id
                JOIN cars c ON c.id = r.car_id
                JOIN drivers d ON d.id = r.driver_id
                JOIN users u ON d.user_id = u.id
            WHERE (r.status = 0) AND (r.s_city_id = ? OR r.e_city_id = ?) 
                AND (cast(concat(start_date, ' ', start_time) as datetime) >= now())
            ORDER BY r.created_at DESC
            LIMIT ? OFFSET ?
        `;    

        connection.query(query, [city, city, limit, offset],(err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result);
        });
    });
}

function RemoveReservation (req, res){
    const id = req.params.id;
    const status = 1;
    conn.getConnection((err, connection) => {            
        connection.query("UPDATE reservations SET status = ? WHERE id = ?", [status, id], (err, result) => {
            if (err) throw err;
            connection.release();
            res.json({
                msg: "Reservation Has Been Removed",
            });
        });
    });
}

module.exports.AddReservation = AddReservation;
module.exports.UpdateReservation = UpdateReservation;
module.exports.GetReservation = GetReservation;
module.exports.GetReservationPlaces = GetReservationPlaces;
module.exports.GetAllReservations = GetAllReservations;
module.exports.GetReservationsFilter = GetReservationsFilter;
module.exports.GetReservationsSearch = GetReservationsSearch;
module.exports.RemoveReservation = RemoveReservation;

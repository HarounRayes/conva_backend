const conn = require('../database/connection').pool;

function getAvailableRating(req, res){

    const user_id = req.user.id;

    conn.getConnection((err, connection) => {

        const query = `
            SELECT 
                rp.id, rp.reservation_id, rp.user_id, rp.updated_at, r.driver_id, r.car_id, r.price, sc.name as s_city, ec.name as e_city, c.car_name, u.name
            FROM 
               reservation_place rp JOIN reservations r ON r.id = rp.reservation_id
                                    JOIN cities sc ON r.s_city_id = sc.id  
                                    JOIN cities ec ON r.e_city_id = ec.id
                                    JOIN cars c ON c.id = r.car_id
                                    JOIN drivers d ON r.driver_id = d.id
                                    JOIN users u ON d.user_id = u.id
            WHERE
                rp.user_id = ? AND rp.status = 2 AND rp.rating_status = 0 AND (rp.updated_at + INTERVAL 1 day) < now()
        `;

        connection.query(query, user_id, (err, checkResult) => {
            if (err) throw err;
            connection.release();
            res.json(checkResult);
        });
    });

}

function editRatingStatus(req, res){
    conn.getConnection((err, connection) => {
        const { id, value } = req.body;
        const query = `UPDATE reservation_place SET rating_status = ? WHERE id = ?`;
        connection.query(query, [value, id], (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result);
        });
    });
}

function PostRating (req, res) {
    const user_id = req.user.id;
    conn.getConnection((err, connection) => {
        const { driverId, carId, ReservationId, driverStars, carStars, tripStars } = req.body;
        const record = {
            user_id: user_id,
            driver_stars: driverStars,
            car_stars: carStars,
            trip_stars: tripStars,
            driver_id: driverId,
            car_id: carId,
            Reservation_id: ReservationId,
        }

        const query = `INSERT INTO trips_rating SET ?`;

        connection.query(query, record, (err, checkResult) => {
            if (err) throw err;
            connection.release();
            res.json({
                msg: 'Your Rate Has Been Posted',
            });
        });
    });
}

function IsAlreadyRated (req, res){
    const id = req.user.id;
    const driver_id = req.params.driver_id;
    conn.getConnection((err, connection) => {     
        const query = `
            SELECT * 
            FROM drivers_rating
            WHERE user_id = ? AND driver_id = ?
        `;
        connection.query(query, [id, driver_id], (err, result) => {
            if (err) throw err;
            const isAlreadyRatedDriver = result.length > 0;
            connection.release();
            res.json({
                logged: isAlreadyRatedDriver,
                rate_value: isAlreadyRatedDriver ? result[0].rate_value : 0,
            });
        });
    });
}

function RemoveRating (req, res){
    const user_id = req.user.user_id;
    const rate_id = req.params.id;

    conn.getConnection((err, connection) => {            
        connection.query("DELETE FROM trips_rating WHERE user_id = ? AND id = ?", [user_id, rate_id], (err, result) => {
            if (err) throw err;
            connection.release();
            res.json({
                msg: "Rate Has Been Removed",
            });
        });
    });
}



module.exports.getAvailableRating = getAvailableRating;
module.exports.editRatingStatus = editRatingStatus;
module.exports.PostRating = PostRating;
module.exports.RemoveRating = RemoveRating;
module.exports.IsAlreadyRated = IsAlreadyRated;

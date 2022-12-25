const conn = require('../database/connection').pool;

function AddReservationPlace (req, res) {

    const user_id = req.user.id;
    var { reservationId, userName, isForMySelf } = req.body;
    var record = {};

    conn.getConnection((err, connection) => {

        const acceptQuery = `
            SELECT place_numbers,
                (SELECT count(*) FROM reservation_place WHERE reservation_id = ?) AS placeCount
            FROM reservations
            WHERE id = ?
        `;


        connection.query(acceptQuery, [reservationId, reservationId], (err, result) => {
            if (err) throw err;

            if (result[0].placeCount >= result[0].place_numbers){
                res.json({
                    logged: false,
                    test: result[0].placeCount,
                    msg: "You can't take a place in this reservation because it is full please check out the other reservations availbale",
                });
            } else {

                if (isForMySelf){
                    record = {
                        reservation_id: reservationId, 
                        place_position: result[0].placeCount + 1, 
                        user_name: req.user.name,
                        user_id: user_id,
                    };
                } else {
                    record = {
                        reservation_id: reservationId, 
                        place_position: result[0].placeCount + 1,
                        user_name: userName,
                        user_id: user_id,
                    };
                }

                connection.query("INSERT INTO reservation_place SET ?", record, (err, result) => {
                    if (err) throw err;
                    connection.release();
                    res.json({
                        logged: true,
                        msg: 'The Place Has Been Reserved',
                    });
                }); 
            }
        }); 
    });

    
}

function UpdateReservationPlace (req, res) {

    const id = req.params.id;

    conn.getConnection((err, connection) => {            
        
        var { place_position, user_name } = req.body;

        const query = `UPDATE reservation_place SET 
                place_position = ?,
                user_name = ?
            WHERE id = ?`;
        
        connection.query(query, [place_position, user_name, id], (err, result) => {
            if (err) throw err;
            connection.release();
            res.json({
                msg: 'The Place Has Been Updated',
            });
        });
    });
}

function GetReservationPlaces (req, res){
    const id = req.user.id;
    conn.getConnection((err, connection) => {
        const query = `
            SELECT rp.*, r.*, sc.name AS s_name, ec.name AS e_name, rp.id as rp_id
            FROM reservation_place rp
                JOIN reservations r ON rp.reservation_id = r.id
                JOIN cities sc ON r.s_city_id = sc.id  
                JOIN cities ec ON r.e_city_id = ec.id
            WHERE rp.user_id = ? AND (cast(concat(start_date, ' ', start_time) as datetime) >= now())
        `;
        
        connection.query(query, id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result);
        });
    });
}

function GetAllReservationPlacesInReservation (req, res){
    const id  = req.params.id;
    conn.getConnection((err, connection) => {            
        connection.query("SELECT * FROM reservation_place WHERE reservation_id = ?", (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result);
        });
    });
}

function RemoveReservationPlace (req, res){
    const id = req.params.id;
    conn.getConnection((err, connection) => {            
        connection.query("DELETE FROM reservation_place WHERE id = ?", id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json({
                removed: true,
                msg: "Reservation Has Been Removed",
            });
        });
    });
}

function EvaluateReservationPlace (req, res) {

    var { status, id } = req.body;
    var user_id = req.user.id;

    conn.getConnection((err, connection) => {            
        const reservationQuery = `SELECT r.price, rp.status AS rp_status, r.driver_id
            from reservations r JOIN reservation_place rp ON r.id = rp.reservation_id 
            WHERE rp.id = ?`;
        connection.query(reservationQuery, id, (err, rResult) => {
            const reservationQueryResult = rResult[0];
            const comissionFees = 0.1;
            const amount = reservationQueryResult.price * comissionFees;
            if (reservationQueryResult.rp_status != 2){
                if (status == 2){
                    const updateDriverQuery = `
                        UPDATE users u
                        JOIN drivers d ON u.id = d.user_id
                        SET d.total_amount = d.total_amount + ${amount}
                        WHERE u.id = ?
                    `;
                    connection.query(updateDriverQuery, user_id);
                }
            } else {
                if (status == 1){
                    const updateDriverQuery = `
                        UPDATE users u
                        JOIN drivers d ON u.id = d.user_id
                        SET d.total_amount = d.total_amount -  ${amount}
                        WHERE u.id = ?
                    `;
                    connection.query(updateDriverQuery, user_id);
                }
            }

            const query = `UPDATE reservation_place SET status = ?, updated_at = now() WHERE reservation_place.id = ?`;
            connection.query(query, [status, id], (err, result) => {
                if (err) throw err;
                connection.release();
                res.json({
                    msg: status === 1 ? 'The place has been rejected' : 'The place has been accepted',
                    logged: true,
                });
            });
        });
    });
}



module.exports.AddReservationPlace = AddReservationPlace;
module.exports.UpdateReservationPlace = UpdateReservationPlace;
module.exports.GetReservationPlaces = GetReservationPlaces;
module.exports.GetAllReservationPlacesInReservation = GetAllReservationPlacesInReservation;
module.exports.RemoveReservationPlace = RemoveReservationPlace;
module.exports.EvaluateReservationPlace = EvaluateReservationPlace;

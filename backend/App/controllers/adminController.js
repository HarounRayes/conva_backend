const conn = require('../database/connection').pool;
const bcrypt = require('bcrypt');

const saltRounds = 10;

function AdminRegister(req, res){
    conn.getConnection((err, connection)=>{
        const { name, email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        const type = 2;

        connection.query("SELECT email FROM users WHERE email = ?", [email], (err, result) => {
            if (err) throw err;
            if (result.length > 0){
                return {msg: "This Email Has Already Been Used"};
            } else {
                connection.query("INSERT INTO users (name, email, user_password, type) VALUES (?,?,?,?)", [name, email, hashedPassword, type] ,(err, userResult) => {
                    connection.release();
                    res.json({
                        msg: "Admin Created Successfully",
                    })
                }); 
            }
        });
    });
}

function GetDashboardAdmin (req, res){

    conn.getConnection((err, connection) => {  
        
        const query = `
            SELECT
                (SELECT COUNT(*) FROM users WHERE type = 0)  AS users_count, 
                (SELECT COUNT(*) FROM users WHERE type = 1)  AS drivers_count,
                (SELECT COUNT(*) FROM cars) AS cars_count,
                (SELECT COUNT(*) FROM reservations) AS reservations_count
            ;
        `;
        connection.query(query, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result[0]);    
        });
    });
}

function GetAllReservationsAdmin (req, res){

    // how many item for one page
    const limit = 15;

    // the page we are currently checking
    const page = req.query.page;
    const offset = (page - 1) * limit;

    conn.getConnection((err, connection) => {  

        const query = `
            SELECT r.*, sc.name AS s_name, ec.name AS e_name, c.car_name, d.profile, u.name AS user_name, d.id as driver_id, r.status as r_status,
                (SELECT count(*) FROM reservation_place rp WHERE r.id = rp.reservation_id) AS placeCount,
                (SELECT IFNULL(AVG(rate_value),0) FROM drivers_rating dr WHERE dr.driver_id = r.driver_id) AS driver_rate,
                (SELECT IFNULL(AVG(rate_value),0) FROM cars_rating cr WHERE cr.car_id = r.car_id) AS car_rate,
                (SELECT IF(cast(concat(start_date, ' ', start_time) as datetime) < now(), 0, 1)) as status,
                (SELECT IF((SELECT COUNT(*) FROM reservation_place rp WHERE rp.reservation_id = r.id) >= r.place_numbers, 1, 2)) as full
            FROM reservations r
                JOIN cities sc ON r.s_city_id = sc.id  
                JOIN cities ec ON r.e_city_id = ec.id
                JOIN cars c ON c.id = r.car_id
                JOIN drivers d ON d.id = r.driver_id
                JOIN users u ON d.user_id = u.id
            LIMIT ? OFFSET ?
        `;    

        connection.query(query, [limit, offset], (err, result) => {
            connection.query('SELECT COUNT(*) AS count FROM reservations', (err, countResult) => {
                if (err) throw err;
                connection.release();
                
                var jsonResult = {
                    'pages': Math.ceil(countResult[0].count/limit),
                    'current_number': page,
                    'reservations':result,
                }

                res.json(jsonResult);    
            });
        });
    });
}

function GetAllUsersAdmin (req, res){

    // how many item for one page
    const limit = 15;

    // the page we are currently checking
    const page = req.query.page;
    const offset = (page - 1) * limit;

    conn.getConnection((err, connection) => {  

        const query = `
            SELECT u.*, c.*
            FROM clients c JOIN users u ON c.user_id = u.id
            LIMIT ? OFFSET ?
        `;

        connection.query(query, [limit, offset], (err, result) => {
            connection.query('SELECT COUNT(*) AS count FROM users WHERE type = 0', (err, countResult) => {
                if (err) throw err;
                connection.release();
                
                var jsonResult = {
                    'pages': Math.ceil(countResult[0].count/limit),
                    'current_number': page,
                    'users':result,
                }

                res.json(jsonResult);    
            });
        });
    });
}

function GetAllDriversAdmin (req, res){

    // how many item for one page
    const limit = 15;

    // the page we are currently checking
    const page = req.query.page;
    const offset = (page - 1) * limit;

    conn.getConnection((err, connection) => {  

        const query = `
            SELECT u.*, d.*
            FROM drivers d JOIN users u ON d.user_id = u.id
            LIMIT ? OFFSET ?
        `;

        connection.query(query, [limit, offset], (err, result) => {
            connection.query('SELECT COUNT(*) AS count FROM users WHERE type = 1', (err, countResult) => {
                if (err) throw err;
                connection.release();
                
                var jsonResult = {
                    'pages': Math.ceil(countResult[0].count/limit),
                    'current_number': page,
                    'drivers':result,
                }
                res.json(jsonResult);    
            });
        });
    });
}

function GetAllCarsAdmin (req, res){

    // how many item for one page
    const limit = 15;

    // the page we are currently checking
    const page = req.query.page;
    const offset = (page - 1) * limit;

    conn.getConnection((err, connection) => {  

        const query = `
            SELECT u.name, c.*
            FROM cars c JOIN drivers d ON c.driver_id = d.id JOIN users u ON d.user_id = u.id
            LIMIT ? OFFSET ?
        `;

        connection.query(query, [limit, offset], (err, result) => {
            connection.query('SELECT COUNT(*) AS count FROM cars', (err, countResult) => {
                if (err) throw err;
                connection.release();
                
                var jsonResult = {
                    'pages': Math.ceil(countResult[0].count/limit),
                    'current_number': page,
                    'cars':result,
                }
                res.json(jsonResult);    
            });
        });
    });
}


module.exports.AdminRegister = AdminRegister;
module.exports.GetDashboardAdmin = GetDashboardAdmin;
module.exports.GetAllReservationsAdmin = GetAllReservationsAdmin;
module.exports.GetAllUsersAdmin = GetAllUsersAdmin;
module.exports.GetAllDriversAdmin = GetAllDriversAdmin;
module.exports.GetAllCarsAdmin = GetAllCarsAdmin;


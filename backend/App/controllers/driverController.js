const conn = require('../database/connection').pool;
const bcrypt = require('bcrypt');

const saltRounds = 10;


function Register (req, res) {

    conn.getConnection((err, connection) => {

        var { name, email, password, phone, type } = req.body;

        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        connection.query("SELECT email FROM users WHERE email = ?", [email], (err, result) => {
            if (err) throw err;
            if (result.length > 0){
                return {msg: "This Email Has Already Been Used"};
            } else {
                const saveUser = {
                    name, 
                    email,
                    password: hashedPassword,
                    phone: phone,
                    type: type,
                }
                connection.query("INSERT INTO users SET ?", saveUser ,(err, userResult) => {
                    connection.query("INSERT INTO drivers (user_id, payment_date) VALUES (?, now() + INTERVAL 1 month)", userResult.insertId, (err, result) => {
                        connection.release();
                        res.json({
                            logged: true,
                            msg: 'User Has Register Successfully',
                            id: userResult.insertId,
                        });
                    }); 
                }); 
            }
        });
    });
}

function UpdateProfile (req, res){
    conn.getConnection((err, connection) => {
        const user_id = req.params.id;
        if (req.files && Object.keys(req.files).length > 0){
            const file = req.files.profile;
            const profileImage = file.name;
            var uploadDir = './assets/profiles/' + profileImage;
            file.mv(uploadDir);

            connection.query("UPDATE drivers SET profile = ? WHERE user_id = ?", [profileImage, user_id], (err, result) => {
                connection.release();
                res.json({
                    msg: 'Profile Has Been Updated',
                });
            });
        } else {
            res.json({
                msg: "You Haven't Uploaded Any Picture",
            });
        }
    });
}

function NotifyAdminUserUploadCard(user_id, filename){
    const record = {
        user_id: user_id,
        filename: filename,
    };
    const notifyAdminQuery = `INSERT INTO users_cards SET ?`;
    conn.getConnection((err, connection) => {
        connection.query(notifyAdminQuery, record);
        connection.release();
    });
}

function CheckCardID(req, res){
    const user_id = req.user.id;
    conn.getConnection((err, connection) => {
        const query = `
            SELECT *
            FROM users u JOIN drivers d ON u.id = d.user_id
            WHERE u.id = ?
        `;
        connection.query(query, user_id, (err, result) => {
            if (result[0].isValid == 1 || result[0].isValid == 0){
                if(result[0].docs === ''){
                    res.json({
                        logged: false,
                        isActivatedAccount: false,
                        isUploadedFile: false,
                    });
                } else {
                    res.json({
                        logged: true,
                        isActivatedAccount: false,
                        isUploadedFile: true,
                        file: result[0].docs,
                    });
                }
            } else if (result[0].isValid == 2){
                res.json({
                    logged: true,
                    isActivatedAccount: true,
                    isUploadedFile: true,
                    file: result[0].docs,
                });
            }
        });
    });
}

function UpdateCardID(req, res){
    // notify the admin
    conn.getConnection((err, connection) => {
        const user_id = req.user.id;
        if (req.files && Object.keys(req.files).length > 0){
            const file = req.files.card;
            const cardImage = file.name;
            var uploadDir = './assets/cards/' + cardImage;
            file.mv(uploadDir);

            // notify the admin 
            NotifyAdminUserUploadCard(user_id, cardImage);

            connection.query("UPDATE drivers SET docs = ? WHERE user_id = ?", [cardImage, user_id], (err, result) => {
                connection.release();
                res.json({
                    logged: true,
                    msg: 'Card ID Has Been Uploaded',
                });
            });
        } else {
            res.json({
                logged: false,
                msg: "You Haven't Uploaded Any Picture",
            });
        }
    });
}

function GetDriver(req, res){
    const id = req.params.id;
    conn.getConnection((err, connection) => {   

        const query = `
            SELECT u.*, d.*
            FROM drivers d JOIN users u ON d.user_id = u.id
            WHERE u.id = ?
        `;         

        connection.query(query, id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result[0]);
        });
    });
}

function GetDriverReservations (req, res){
    const driver_id = req.params.driver_id;
    conn.getConnection((err, connection) => {  


        // status => 0 = valide
        // status => 1 = delete
        

        const query = `
            SELECT r.*, sc.name AS s_name, ec.name AS e_name, c.car_name, 
                GROUP_CONCAT(rp.user_name) AS names,
                (SELECT count(*) FROM reservation_place rp WHERE r.id = rp.reservation_id) AS placeCount,
                (SELECT IFNULL(AVG(rate_value),0) FROM drivers_rating dr WHERE dr.driver_id = r.driver_id) AS driver_rate,
                (SELECT IF(cast(concat(start_date, ' ', start_time) as datetime) < now(), 0, 1)) as status,
                (SELECT IF((SELECT COUNT(*) FROM reservation_place rp WHERE rp.reservation_id = r.id) >= r.place_numbers, 1, 2)) as full
            FROM reservations r
                LEFT JOIN reservation_place rp ON r.id = rp.reservation_id
                JOIN cities sc ON r.s_city_id = sc.id  
                JOIN cities ec ON r.e_city_id = ec.id
                JOIN cars c ON c.id = r.car_id
            WHERE r.driver_id = ? AND (concat(r.start_date, ' ', r.start_time)) > now() AND r.status = 0
            GROUP BY id
            ORDER BY created_at DESC
        `;

        connection.query(query, driver_id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result);
        });
    });
}

function GetDriverId (req, res){
    const user_id = req.user.id;
    conn.getConnection((err, connection) => {   
        const query = `
            SELECT d.id
            FROM drivers d JOIN users u ON d.user_id = u.id
            WHERE u.id = ?
        `;
        connection.query(query, user_id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json({driver_id: result[0].id});
        });
    });
}

function RemoveDriver (req, res){
    const id = req.params.id;
    conn.getConnection((err, connection) => {            
        connection.query("DELETE FROM users WHERE id = ?", id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json({
                msg: "Driver Has Been Removed",
            });
        });
    });
}

function GetAuthDriver(req, res){
    const id = req.user.id;

    conn.getConnection((err, connection) => {   
        const query = `
            SELECT u.*, d.*
            FROM drivers d JOIN users u ON d.user_id = u.id
            WHERE u.id = ?
        `;         
        connection.query(query, id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result[0]);
        });
    });
}

function GetAllDrivers (req, res){
    conn.getConnection((err, connection) => {    
        const query = `
            SELECT u.*, d.*
            FROM drivers d JOIN users u ON d.user_id = u.id
        `;  

        connection.query(query, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result);
        });
    });
}

function GetDriverCars (req, res){
    // driver ask for his cars
    const driver_id = req.params.driver_id;
    conn.getConnection((err, connection) => {    
        const query = `
            SELECT c.*,
                (SELECT count(*) FROM cars_rating cr WHERE c.id = cr.car_id) AS rating_count,
                (SELECT IFNULL(AVG(rate_value),0) FROM cars_rating cr WHERE cr.car_id = c.id) AS car_rate
            FROM cars c LEFT JOIN cars_rating cr ON c.id = cr.car_id
            WHERE c.driver_id = ?
            GROUP BY c.id
        `;
        connection.query(query, driver_id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result);
        });
    });
}



module.exports.Register = Register;
module.exports.UpdateProfile = UpdateProfile;
module.exports.GetDriver = GetDriver;
module.exports.GetDriverId = GetDriverId;
module.exports.GetAuthDriver = GetAuthDriver;
module.exports.GetAllDrivers = GetAllDrivers;
module.exports.UpdateCardID = UpdateCardID;
module.exports.CheckCardID = CheckCardID;
module.exports.RemoveDriver = RemoveDriver;
module.exports.GetDriverCars = GetDriverCars;
module.exports.GetDriverReservations = GetDriverReservations;

const conn = require('../database/connection').pool;
const bcrypt = require('bcrypt');


function UpdateInfo(req, res) {

    const user_id = req.user.id;
    const { name, email } = req.body;
    
    conn.getConnection((err, connection) => {
        connection.query("SELECT email, id FROM users WHERE email = ?", email, (err, emailsResult) => {
            if (emailsResult.length <= 0 || emailsResult[0].id === user_id){
                connection.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, user_id], (err, result) => {
                    connection.release();
                    res.json({
                        logged: true,
                        msg: 'Your informations has been updated successfully',
                    });
                });
            } else {
                res.json({
                    logged: false,
                    msg: 'This email is already taken please try with a different email address',
                });
            }
        });
    });
}

function UpdatePassword (req, res){        
    const user = req.user;
    conn.getConnection((err, connection) => {

        const playerQuery = `SELECT * FROM users WHERE id = ?`;

        const {oldPassword, newPassword} = req.body;

        connection.query(playerQuery, user.id, function (error, playerResult) {
            const isCorrect = bcrypt.compareSync(oldPassword, playerResult[0].password);
            if (isCorrect === true){
                const hashedPassword = bcrypt.hashSync(newPassword, 10);
                const query = `UPDATE users SET password = ? WHERE id = ?`;
                connection.query(query, [hashedPassword, user.id], function (error, results) {
                    connection.release();
                    return res.json({ 
                        logged: isCorrect,
                        msg: 'Password changed successfully',
                    });
                });
            } else {
                return res.json({ 
                    logged: isCorrect,
                    msg: "Your current password is iccorect",
                });
            }
        });
    });
}

function GetUserHistorics(req, res){
    const user_id = req.user.id;
    conn.getConnection((err, connection) => {
        const playerQuery = `
            SELECT rp.user_name, sc.name as s_name, ec.name as e_name, r.s_city_place, r.e_city_place, r.start_date, r.start_time, r.price, rp.status
            FROM reservation_place rp
                JOIN reservations r ON r.id = rp.reservation_id
                JOIN cities sc ON sc.id = r.s_city_id
                JOIN cities ec ON ec.id = r.e_city_id
            WHERE (rp.user_id = ?) AND (CURRENT_TIME > r.start_date)
        `;

        connection.query(playerQuery, user_id, function (error, playerResult) {
            res.json(playerResult);
        });
    });
}

function IsValidUser(req, res){
    const user_id = req.user.id;
    conn.getConnection((err, connection) => {
        const playerQuery = `
            SELECT isValid as isvalid
            FROM users
            WHERE id = ?
        `;
        connection.query(playerQuery, user_id, function (error, playerResult) {
            res.json(playerResult[0]);
        });
    });
}

module.exports.UpdateInfo = UpdateInfo;
module.exports.UpdatePassword = UpdatePassword;
module.exports.GetUserHistorics = GetUserHistorics;
module.exports.IsValidUser = IsValidUser;

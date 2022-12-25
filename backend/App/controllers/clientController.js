const conn = require('../database/connection').pool;
const bcrypt = require('bcrypt');
const { type } = require('express/lib/response');

const saltRounds = 10;

function Register (req, res) {

    conn.getConnection((err, connection) => {

        var { name, email, password, phone, type } = req.body;

        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        connection.query("SELECT email FROM users WHERE email = ?", email, (err, result) => {
            if (err) throw err;
            if (result.length > 0){
                res.json({
                    logged: false,
                    msg: "This Email Has Already Been Used",
                });
            } else {
                const saveUser = {
                    name,
                    email,
                    password: hashedPassword,
                    phone: phone,
                    type: type,
                };
                connection.query("INSERT INTO users SET ?", saveUser ,(err, userResult) => {
                    connection.query("INSERT INTO clients (user_id) VALUES (?)", userResult.insertId ,(err, result) => {
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
            connection.query("UPDATE clients SET profile = ? WHERE user_id = ?", [profileImage, user_id], (err, result) => {
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

function CheckCardID(req, res){
    conn.getConnection((err, connection) => {
        const user_id = req.user.id;
        const query = `
            SELECT *
            FROM users u JOIN clients c ON u.id = c.user_id
            WHERE u.id = ?
        `;
        connection.query(query, [user_id], (err, result) => {
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
    conn.getConnection((err, connection) => {
        const user_id = req.user.id;
        if (req.files && Object.keys(req.files).length > 0){
            const file = req.files.card;
            const cardImage = file.name;
            var uploadDir = './assets/cards/' + cardImage;
            file.mv(uploadDir);

            // notify the admin 
            NotifyAdminUserUploadCard(user_id, cardImage);

            connection.query("UPDATE clients SET docs = ? WHERE user_id = ?", [cardImage, user_id], (err, result) => {
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

// notify admin
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

function GetAuthClient(req, res){
    const id = req.user.id;

    conn.getConnection((err, connection) => {   
        const query = `
            SELECT u.*, c.*
            FROM clients c JOIN users u ON c.user_id = u.id
            WHERE u.id = ?
        `;   
        connection.query(query, id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result[0]);
        });
    });
}

function GetClient(req, res){
    const id = req.params.id;

    conn.getConnection((err, connection) => {   

        const query = `
            SELECT u.*, c.*
            FROM clients c JOIN users u ON c.user_id = u.id
            WHERE c.id = ?
        `;         

        connection.query(query, id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result[0]);
        });
    });
}

function RemoveClient (req, res){
    const id = req.params.id;
    conn.getConnection((err, connection) => {            
        connection.query("DELETE FROM users WHERE id = ?", id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json({
                msg: "Client Has Been Removed",
            });
        });
    });
}

function GetAllClients (req, res){
    conn.getConnection((err, connection) => {    
        const query = `
            SELECT u.*, c.*
            FROM clients c JOIN users u ON c.user_id = u.id
        `;  

        connection.query(query, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result);
        });
    });
}


module.exports.Register = Register;
module.exports.UpdateProfile = UpdateProfile;
module.exports.GetAuthClient = GetAuthClient;
module.exports.GetClient = GetClient;
module.exports.GetAllClients = GetAllClients;
module.exports.UpdateCardID = UpdateCardID;
module.exports.CheckCardID = CheckCardID;
module.exports.RemoveClient = RemoveClient;
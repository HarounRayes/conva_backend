const conn = require('../database/connection').pool;
const bcrypt = require('bcrypt');
const jwtFuncs = require('../services/jwt');
const jwt = require('jsonwebtoken');
const otp_generator = require('otp-generator');


function Login(req, res){
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ?";
    conn.getConnection((err, connection) => {
        connection.query(query, email, (err, result) => {
            if (result.length > 0){
                const db_password = result[0].password;
                const checkPassword = bcrypt.compareSync(password, db_password);

                if (checkPassword){
                    // auth successfully
                    const token = jwtFuncs.createAuthToken(result[0]);
                    res.send({
                        logged: true,
                        msg: 'log in successfully',
                        user_id: result[0].id,
                        type: result[0].type,
                        isvalid: result[0].isValid,
                        token: token,
                    });
                } else {
                    res.send({
                        logged: false,
                        msg: 'Password Incorrect!',
                    });
                }
            } else {
                res.send({
                    logged: false,
                    msg: 'Email Incorrect!',
                });
            }
        });
    });
}

function GetUserType(req, res){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (typeof token === 'undefined' || token == null){
        return res.send({
            auth: false,
            msg: 'User Must Be Redirected To Login Page',
        });
    }

    jwt.verify(token, process.env.APP_SECRET_TOKEN, (err, use) => {
        if (err){
            return res.send({err: true, msg: "must be a valide token"});
        } 
        return res.json(use);
    });
}

function GetAuthUser(req, res){
    const user = req.user;
    conn.getConnection((err, connection) => {
        const query = 'SELECT name, type, email FROM users WHERE id = ?';
        connection.query(query, user.id, (err, result) => {
            res.json(result[0]);
        });
    });
        
}

// app.get('/get/otp/:id', RequestOtp); the route for the request
function RequestOtp(req, res){
    const id = req.params.id;
    conn.getConnection((err, connection) => {
        const query = 'SELECT phone FROM users WHERE id = ?';
        connection.query(query, id, (err, result) => {
            const digitNumber = otp_generator.generate(6, {upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true},);
            // send an sms to the user with this 6 digit code 
            // before we go to the second step
            res.json({test:result[0], digitNumber});
        });
    });  
}

// app.get('/verify/otp/:id', VerifyOtp); the route for the verification
function VerifyOtp(req, res){
    // this part only if the code is correct
    //
    //
    const id = req.params.id;
    const isValid = 1;

    conn.getConnection((err, connection) => {
        const query = 'UPDATE users SET isValid = ? WHERE id = ?'; 
        connection.query(query, [isValid, id], (err, result) => {
            res.json({
                updated: true,
            });
        });
    });  
}


module.exports.Login = Login;
module.exports.GetUserType = GetUserType;
module.exports.GetAuthUser = GetAuthUser;
module.exports.RequestOtp = RequestOtp;
module.exports.VerifyOtp = VerifyOtp;
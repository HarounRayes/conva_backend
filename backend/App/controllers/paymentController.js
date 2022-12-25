const conn = require('../database/connection').pool;

function postPayment (req, res) {

    if (req.files && Object.keys(req.files).length >= 1){
        // prof
        const file1 = req.files.prof;
        const prof = file1.name;
        var uploadDir1 = './assets/prof/' + prof;
        file1.mv(uploadDir1);

        conn.getConnection((err, connection) => {
            var { fullname, driver_id, amount, driver_id } = req.body;

            const record = {
                driver_id: driver_id,
                fullname: fullname,
                amount: amount,
                prof: prof,
            }
    
            connection.query("INSERT INTO payments SET ?", record, (err, result) => {
                if (err) throw err;
                connection.release();
                // notify the admin
                res.json({
                    msg: 'Payment Requests Has Been Added! Please Wait For The Admin To Approve',
                });
            }); 
        });
    } else {
        res.json({
            msg: 'You Have To Provide Your Prof',
        });
    }
}

function EvalutaePayment(req, res){

    var { id , status } = req.body;

    conn.getConnection((err, connection) => {        
        const query = `UPDATE payments SET 
                status = ?
            WHERE id = ?`; 
            
        // 0 => Unchecked
        // 1 => Rejected
        // 2 => Accepted

        connection.query(query, [id, status], (err, result) => {
            if (status == 2){
                const paymentObject = GetPaymentFromId(id);
                connection.query(
                    `UPDATE drivers d SET d.total_amount = d.total_amount - ${paymentObject.amount} WHERE id = ?`,
                    paymentObject.driver_id
                );
            }
            if (err) throw err;
            connection.release();
            res.json(result);
        });
    });
}

function GetPaymentFromId(id){
    conn.getConnection((err, connection) => {        
        const query = `SELECT * from payments WHERE id = ?`;
        connection.query(query, id, (err, result) => {
            if (err) throw err;
            connection.release();
            return(result[0]);
        });
    });
}

function GetDriverPayments (req, res){

    const driver_id = req.params.id;  // pass the driver id

    conn.getConnection((err, connection) => {            
        connection.query("SELECT * FROM payments WHERE driver_id = ?", driver_id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result);
        });
    });
}

function GetAllPayments (req, res){
    conn.getConnection((err, connection) => {            
        connection.query("SELECT * FROM payments", (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result);
        });
    });
}

function GetPayment (req, res){
    const id = req.params.id; // payment ID  this is for admin
    conn.getConnection((err, connection) => {            
        connection.query("SELECT * FROM payments WHERE id = ?" , id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result);
        });
    });
}

function RemovePayment (req, res){
    const id = req.params.id;
    conn.getConnection((err, connection) => {            
        connection.query("DELETE FROM payments WHERE id = ?", id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json({
                msg: "Payment Has Been Removed",
            });
        });
    });
}

function PaymentStatistics (req, res){

    const driver_id = req.params.id;


    conn.getConnection((err, connection) => {   

        const query = `
            SELECT (SELECT IFNULL(SUM(r.price),0) 
            FROM reservations r JOIN reservation_place rp ON r.id = rp.reservation_id 
            WHERE rp.status = 2 AND r.driver_id = ?) AS total,

            (SELECT IFNULL(SUM(r.price),0) 
            FROM reservations r JOIN reservation_place rp ON r.id = rp.reservation_id 
            WHERE rp.status = 2 AND MONTH(r.start_date) = MONTH(CURRENT_DATE()) AND YEAR(r.start_date) = YEAR(CURRENT_DATE()) AND r.driver_id = ?) AS month,
            
            (SELECT IFNULL(SUM(r.price),0) 
            FROM reservations r JOIN reservation_place rp ON r.id = rp.reservation_id 
            WHERE rp.status = 2 AND r.start_date = CURRENT_DATE() AND r.driver_id = ?) AS day 
        `;

        connection.query(query, [driver_id, driver_id, driver_id], (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result[0]);
        });
    });
}

function PaymentDriverInfo(req, res){

    const user_id = req.user.id;

    conn.getConnection((err, connection) => {    
        const query = `
            SELECT d.total_amount, payment_date, fee, CURDATE() as now_date
            FROM users u JOIN drivers d ON u.id = d.user_id
            WHERE d.user_id = ?
        `;
        connection.query(query, user_id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result[0]);
        });
    });
}


module.exports.postPayment = postPayment;
module.exports.EvalutaePayment = EvalutaePayment;
module.exports.GetPayment = GetPayment;
module.exports.GetAllPayments = GetAllPayments;
module.exports.GetDriverPayments = GetDriverPayments;
module.exports.RemovePayment = RemovePayment;
module.exports.PaymentStatistics = PaymentStatistics;
module.exports.PaymentDriverInfo = PaymentDriverInfo;

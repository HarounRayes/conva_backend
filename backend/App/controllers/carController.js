const conn = require('../database/connection').pool;


function AddCar (req, res) {

    if (req.files && Object.keys(req.files).length >= 2){

        // insurance
        const file1 = req.files.insurance;
        const insurance = file1.name;
        var uploadDir1 = './assets/carDocs/' + insurance;
        file1.mv(uploadDir1);

        // registeration
        const file2 = req.files.registeration;
        const registeration = file2.name;
        var uploadDir2 = './assets/carDocs/' + registeration;
        file2.mv(uploadDir2);

        conn.getConnection((err, connection) => {
            var { car_name, car_capacity, registration_number, driver_id } = req.body;

            const record = {
                car_name: car_name,
                driver_id: driver_id,
                registration_number: registration_number,
                car_capacity: car_capacity,
                insurance: insurance,
                registeration: registeration,
            }
    
            connection.query("INSERT INTO cars SET ?", record, (err, result) => {
                if (err) throw err;
                connection.release();
                // notify the admin
                NotifyAdminUserUploadCard(result.insertId, insurance, registeration);
                res.json({
                    msg: 'Add New Car Requests Has Been Added! Please Wait For The Admin To Approve',
                });
            }); 
        });
    } else {
        res.json({
            msg: 'You Have To Provide Your Docs',
        });
    }
}

function NotifyAdminUserUploadCard(car_id, file1, file2){
    const record = {
        car_id: car_id,
        file1: file1,
        file2: file2,
    };
    const notifyAdminQuery = `INSERT INTO cars_cards SET ?`;
    conn.getConnection((err, connection) => {
        connection.query(notifyAdminQuery, record);
        connection.release();
    });
}

function UpdateCar (req, res) {

    const id = req.params.id;

    conn.getConnection((err, connection) => {            
        
        var { registration_number } = req.body;

        try{
            if (req.files && Object.keys(req.files).length > 0){
                const file = req.files.image;
                const docs = file.name;
                var uploadDir = './assets/carDocs/' + docs;
                file.mv(uploadDir);

                connection.query("UPDATE cars SET registration_number = ?, docs = ? WHERE id = ?", [registration_number, docs, id], (err, result) => {
                    if (err) throw err;
                    connection.release();
                    res.json({
                        msg: 'The City Has Been Updated',
                    });
                });

            } 
        } catch (e){
            console.log(e);
        }
    });
}

function GetCar (req, res){
    const id = req.params.id;

    conn.getConnection((err, connection) => {            
        connection.query("SELECT * FROM cars WHERE id = ?", id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result[0]);
        });
    });
}

function GetCarsForDriver(req, res){
    const id = req.params.driver_id;
    const user_id = req.user.id;
    conn.getConnection((err, connection) => {     
        const query = `
            SELECT c.*, 
                (SELECT COUNT(*) FROM reservation_place rp JOIN reservations r ON rp.reservation_id = r.id WHERE rp.status = 2 AND rp.user_id = ? AND c.id = r.car_id) AS canRate, 
                (SELECT COUNT(*) FROM reservations r WHERE c.id = r.car_id) AS reservation_count,
                (SELECT COUNT(*) FROM cars_rating cr WHERE cr.car_id = c.id) AS total_rates,
                (SELECT IFNULL(AVG(rate_value),0) FROM cars_rating cr WHERE cr.car_id = c.id) AS rate_value
            FROM cars c
            WHERE c.driver_id = ? AND c.status = 2
        `;
        connection.query(query, [user_id,  id], (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result);
        });
    });
}

function GetAllCars (req, res){

    conn.getConnection((err, connection) => {            
        connection.query("SELECT * FROM cars", (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result);
        });
    });
}

function RemoveCar (req, res){
    const id = req.params.id;
    conn.getConnection((err, connection) => {            
        connection.query("DELETE FROM cars WHERE id = ?", id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json({
                msg: "City Has Been Removed",
            });
        });
    });
}


module.exports.AddCar = AddCar;
module.exports.UpdateCar = UpdateCar;
module.exports.GetCar = GetCar;
module.exports.GetCarsForDriver = GetCarsForDriver;
module.exports.GetAllCars = GetAllCars;
module.exports.RemoveCar = RemoveCar;

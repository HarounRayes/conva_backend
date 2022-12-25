const conn = require('../database/connection').pool;


function AddCity (req, res) {

    conn.getConnection((err, connection) => {

        var { name, city_index } = req.body;

        let cityImage = 'defaultPlayerProfile.png';

        if (req.files && Object.keys(req.files).length > 0){
            const file = req.files.profile;
            cityImage = file.name;
            var uploadDir = './assets/cities/' + cityImage;
            file.mv(uploadDir);
        }

        const record = {
            city_index: city_index, 
            name: name,
            picture: cityImage
        }

        connection.query("INSERT INTO cities SET ?", record, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json({
                msg: 'The City Has Been Added',
            });
        }); 
    });
}

function UpdateCity (req, res) {

    const id = req.params.id;

    conn.getConnection((err, connection) => {            
        
        var { name, city_index } = req.body;

        try{
            let cityImage;
            if (req.files && Object.keys(req.files).length > 0){
                const file = req.files.image;
                cityImage = file.name;
                var uploadDir = './assets/cities/' + cityImage;
                file.mv(uploadDir);

                connection.query("UPDATE cities SET city_index = ?, name = ?, picture = ? WHERE id = ?", [city_index, name, cityImage, id], (err, result) => {
                    if (err) throw err;
                    connection.release();
                    res.json({
                        msg: 'The City Has Been Updated',
                    });
                });

            } else {

                connection.query("UPDATE cities SET city_index = ?, name = ? WHERE id = ?", [city_index, name, id], (err, result) => {
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

function GetCity (req, res){
    const id = req.params.id;
    conn.getConnection((err, connection) => {            
        connection.query("SELECT * FROM cities WHERE id = ?", id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result[0]);
        });
    });
}

function GetAllCities (req, res){
    conn.getConnection((err, connection) => {            
        connection.query("SELECT * FROM cities", (err, result) => {
            if (err) throw err;
            connection.release();
            res.json(result);
        });
    });
}

function RemoveCity (req, res){
    const id = req.params.id;
    conn.getConnection((err, connection) => {            
        connection.query("DELETE FROM cities WHERE id = ?", id, (err, result) => {
            if (err) throw err;
            connection.release();
            res.json({
                msg: "City Has Been Removed",
            });
        });
    });
}


module.exports.AddCity = AddCity;
module.exports.UpdateCity = UpdateCity;
module.exports.GetCity = GetCity;
module.exports.GetAllCities = GetAllCities;
module.exports.RemoveCity = RemoveCity;

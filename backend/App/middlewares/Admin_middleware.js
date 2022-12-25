
function CheckAdmin(req, res, next){
    const type = req.body.type;
    if (type === 0){
        res.json({
            msg: 'you are not an admin (YOU ARE A CLIENT)'
        });
    } else if (type === 1){
        res.json({
            msg: 'you are not an admin (YOU ARE AN DRIVER)'
        });
    } else {
        next();
    }
}

function CheckAdmin(req, res, next){
    const type = req.body.type;
    if (type === 0){
        res.json({
            msg: 'you are not an organizer (YOU ARE AN GAMER)'
        });
    } else if (type === 2){
        res.json({
            msg: 'you are not an organizer (YOU ARE AN ADMIN)'
        });
    } else {
        next();
    }
}
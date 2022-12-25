function CheckPlayer(req, res, next){
    const type = req.user.type;
    if (type === 1){
        return res.json({
            msg: 'you are not an player (YOU ARE AN Organizer)'
        });
    } else if (type === 2){
        return res.json({
            msg: 'you are not an player (YOU ARE AN ADMIN)'
        });
    } else {
        return next();
    }
}

module.exports.CheckPlayer = CheckPlayer;
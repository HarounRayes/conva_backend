const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.createAuthToken = (user) => {
    const token = jwt.sign({id: user.id, name: user.name, email: user.email, type: user.type}, process.env.APP_SECRET_TOKEN);
    return token;
}

exports.createAdminAuthToken = (admin) => {
    const token = jwt.sign({id: admin.id, email: admin.email}, process.env.APP_SECRET_TOKEN);
    return token;
}

exports.checkAuthToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(403);

    const user = jwt.verify(token, process.env.APP_SECRET_TOKEN);

    req.user = user;
    
    return next();
}

exports.checkDriverAuthToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(403);

    const user = jwt.verify(token, process.env.APP_SECRET_TOKEN);
    if (user.type === 1){
        req.user = user;
        return next();
    } else {
        return res.json({
            msg: 'fail to make this task',
        });
    }
}
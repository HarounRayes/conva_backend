// import required Packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fileupload = require("express-fileupload");
const path = require('path');


const mainRoutes = require('./App/routes/mainRoutes');
const authRoutes = require('./App/routes/authRoutes');
const adminRoutes = require('./App/routes/adminRoutes');

const { RequestOtp, VerifyOtp } = require('./App/controllers/authController');


const mailService = require('./App/services/mailer');


// Init Packages
const app = express();
dotenv.config();



// Init Packages Middlewares
app.use(fileupload());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
var corsOptions = {
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}
app.use(cors(corsOptions));


// routes
app.use('', mainRoutes);
app.use('', authRoutes);
app.use('', adminRoutes);

app.get('/test', (req, res) => {
    res.json('qegsqdjy');
});

app.get('/mail', async (req, res) =>   {
    
    await mailService.sendEmail(
        'bouzitharoun@gmail.com',
        'aloloala82@gmail.com',
        'Zamil',
        'Ahla zamil',
        '<h1> Zamil Kbira </h1>'
    );

    res.json("info");
});




app.use('/assets/profiles', express.static(path.join(__dirname, '/assets/profiles')));
app.use('/assets/cities', express.static(path.join(__dirname, '/assets/cities')));
app.use('/assets/cards', express.static(path.join(__dirname, '/assets/cards')));
app.use('/assets/carDocs', express.static(path.join(__dirname, '/assets/carDocs')));
app.use('/assets/prof', express.static(path.join(__dirname, '/assets/prof')));



// Server Run
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    
});

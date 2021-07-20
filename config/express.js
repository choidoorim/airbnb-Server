const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const passportConfig = require('../passport')

module.exports = function () {
    const app = express();

    passportConfig()

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());


    require('../src/app/User/userRoute')(app);
    require('../src/app/Room/roomRoute')(app);
    require('../src/app/WishList/wishListRoute')(app);
    require('../src/app/Trip/tripRoute')(app);
    require('../src/app/Chat/chatRoute')(app);
    require('../src/app/Search/searchRoute')(app);
    require('../src/app/Experience/experienceRoute')(app);

    return app;
};
const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
var cors = require('cors');
const passport = require('passport')
const passportConfig = require('../passport')

module.exports = function () {
    const app = express();

    passportConfig()

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());
    // app.use(express.static(process.cwd() + '/public'));

    /* App (Android, iOS) */
    // TODO: 도메인을 추가할 경우 이곳에 Route를 추가하세요.
    require('../src/app/User/userRoute')(app);
    require('../src/app/Room/roomRoute')(app);
    require('../src/app/WishList/wishListRoute')(app);
    require('../src/app/Trip/tripRoute')(app);
    require('../src/app/Chat/chatRoute')(app);
    require('../src/app/Search/searchRoute')(app);
    require('../src/app/Experience/experienceRoute')(app);
    // require('../src/app/Experience/expRoute')(app);
    // require('../src/app/Board/boardRoute')(app);

    return app;
};
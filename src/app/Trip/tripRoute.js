module.exports = function(app){
    const trip = require('./tripController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 이전 예약 조회 API
    app.get('/app/trip/reservations/past', jwtMiddleware, trip.getPastReservations); //jwtMiddleware

    // 2. 예정된 예약 조회 API
    app.get('/app/trip/reservations/future', jwtMiddleware, trip.getFutureReservations); //jwtMiddleware

    // 3. 유저 예약된 숙소 정보 조회 API
    app.get('/app/users/rooms/reservation/:reservationIdx', trip.getUserReservations); //jwtMiddleware

    // 4. 유저 예약 정보 변경 API
    app.patch('/app/users/:userIdx/rooms/reservation/:reservationIdx', jwtMiddleware, trip.patchReservation); //jwtMiddleware
};
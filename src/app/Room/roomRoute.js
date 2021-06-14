module.exports = function(app){
    const room = require('./roomController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. test API
    app.post('/app/tests', room.getTests);

    app.get('/app/rooms', room.getTestRooms);

    // 숙소 상세 조회 수정
    app.get('/app/rooms/:roomIdx/info', room.getRoominfo);

    // 1 숙소 조회 API - O
    app.get('/app/room', jwtMiddleware, room.getRooms); //jwtMiddleware

    // 2. 숙소 상세 조회 API - O
    app.get('/app/rooms/:roomIdx/contents', jwtMiddleware, room.getRoomContents); //jwtMiddleware

    // 3. 숙소 리뷰 조회 API - O
    app.get('/app/rooms/:roomIdx/reviews', room.getRoomReviews);

    // 숙소 리뷰 등록 API
    app.post('/app/users/rooms/reviews', jwtMiddleware, room.postReviews); //jwtMiddleware

    // 호스트 리뷰 등록 API
    app.post('/app/users/hosts/reviews', jwtMiddleware, room.postHostReviews); //jwtMiddleware

    // 4. 숙소 예약 현황 조회 API - O
    app.get('/app/rooms/:roomIdx/reservations-status', room.getRoomReservation);

    // 5. 숙소 예약 정보 조회 API - O
    app.get('/app/rooms/:roomIdx/reservations-info', jwtMiddleware, room.getRoomReservationInfo); //jwtMiddleware

    // 6. 숙소 예약 API - O
    app.post('/app/rooms/reservations', jwtMiddleware, room.postRoomReservation); // jwtMiddleware

    // 7. 숙소 예약 확정 API(Host) - O
    app.patch('/app/host-users/:userIdx/reservations/:reservationIdx/confirm', jwtMiddleware, room.patchRoomReservation); // jwtMiddleware

    // 8. 위시리스트 등록 API - O
    app.post('/app/rooms/wishlists', jwtMiddleware, room.postRoomWishLists); //jwtMiddleware

    // 9. 숙소 찜 상태 변경 API - O
    app.post('/app/rooms/like', jwtMiddleware, room.postRoomLike); //jwtMiddleware

    // 11 .숙소 예약 취소 - O
    app.patch('/app/users/:userIdx/reservation/:reservationIdx/status', jwtMiddleware, room.patchUserReservationStatus); //jwtMiddleware

    // 12 . 숙소 신고 API - O
    app.post('/app/rooms/reports', jwtMiddleware, room.postRoomReport); //jwtMiddleware

    // 13 .호스트 정보 조회 API
    app.get('/app/host-users/:userIdx/information', jwtMiddleware, room.getHostInfo); //jwtMiddleware
};

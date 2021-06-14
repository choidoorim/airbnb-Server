const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const roomDao = require("./roomDao");

exports.selectTestRooms = async function (userIdx){

    const connection = await pool.getConnection(async (conn) => conn);
    // const roomListResult = await roomDao.selectRooms(connection, selectRoomsInfoParams);
    const roomListResult = await roomDao.selectTestRooms(connection, userIdx);
    connection.release();

    return roomListResult;
};

//숙소 조회 API
exports.selectRooms = async function (selectRoomsInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomListResult = await roomDao.selectRooms(connection, selectRoomsInfoParams);
    connection.release();

    return roomListResult;
};

exports.selectRoomsToDate = async function (selectRoomsInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomListResult = await roomDao.selectRoomsToDate(connection, selectRoomsInfoParams);
    connection.release();

    return roomListResult;
};

exports.selectRoomsToGuest = async function (selectRoomsInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomListResult = await roomDao.selectRoomsToGuest(connection, selectRoomsInfoParams);
    connection.release();

    return roomListResult;
};

exports.selectRoomsToDateGuest = async function (selectRoomsInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomListResult = await roomDao.selectRoomsToDateGuest(connection, selectRoomsInfoParams);
    connection.release();

    return roomListResult;
}

// 호스트 정보 조회 API
exports.selectHostInfo = async function (hostUserIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const hostInfoResult = await roomDao.selectHostInfo(connection, hostUserIdx);
    connection.release();

    return hostInfoResult;
}

exports.selectHostRooms = async function (userIdx, hostUserIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const hostRoomsResult = await roomDao.selectHostRooms(connection, userIdx, hostUserIdx);
    connection.release();

    return hostRoomsResult;
}

exports.selectHostReviews = async function (hostUserIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const hostReviewsResult = await roomDao.selectHostReviews(connection, hostUserIdx);
    connection.release();

    return hostReviewsResult;
}

// 숙소 내용 조회 API
// client
exports.selectRoomInfo = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectRoomInfoResult = await roomDao.selectRoomInfo(connection, roomIdx);
    connection.release();

    return selectRoomInfoResult;
}

exports.selectRoomContents = async function (roomIdx, userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomContentsListResult = await roomDao.selectRoomContents(connection, roomIdx, userIdx);
    connection.release();

    return roomContentsListResult;
};

exports.selectRoomImages = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomImagesListResult = await roomDao.selectRoomImages(connection, roomIdx);
    connection.release();

    return roomImagesListResult;
};

exports.selectRoomFacilities = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomFacilitiesListResult = await roomDao.selectRoomFacilities(connection, roomIdx);
    connection.release();

    return roomFacilitiesListResult;
}

exports.selectRoomBadges = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomBadgesListResult = await roomDao.selectRoomBadges(connection, roomIdx);
    connection.release();

    return roomBadgesListResult;
}

exports.selectRoomReviews = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomReviewsListResult = await roomDao.selectRoomReviews(connection, roomIdx);
    connection.release();

    return roomReviewsListResult;
};

//숙소 리뷰 상세 조회 API
exports.selectReviewGradeAll = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewGradesListResult = await roomDao.selectReviewGradeAll(connection, roomIdx);
    connection.release();

    return reviewGradesListResult;
}

exports.selectRoomReviewsAll = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewsAllListResult = await roomDao.selectRoomReviewsAll(connection, roomIdx);
    connection.release();

    return reviewsAllListResult;
};

// 숙소 예약 현황 조회 API
exports.selectRoomReservation = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomReservationListResult = await roomDao.selectRoomReservation(connection, roomIdx);
    connection.release();

    return roomReservationListResult;
};

exports.selectRoomReviewGrade = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomReviewGradeListResult = await roomDao.selectRoomReviewGrade(connection, roomIdx);
    connection.release();

    return roomReviewGradeListResult;
};

// 숙소 예약 정보 조회 API
exports.selectRoomReservationInfo = async function (roomIdx, userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reservationInfoListResult = await roomDao.selectRoomReservationInfo(connection, roomIdx, userIdx);
    connection.release();

    return reservationInfoListResult;
}

// check
exports.checkRooms = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkRoomsResult = await roomDao.checkRooms(connection, roomIdx);
    connection.release();

    return checkRoomsResult;
};

exports.checkRoomReservation = async function (roomIdx, startDate, endDate) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkRoomReservationResult = await roomDao.checkRoomReservation(connection, roomIdx, startDate, endDate);
    connection.release();

    return checkRoomReservationResult;
};

exports.checkWishLists = async function (wishIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkWishListsResult = await roomDao.checkWishLists(connection, wishIdx);
    connection.release();

    return checkWishListsResult;
};

exports.checkRoomLike = async function (roomIdx, userIdx, wishIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkRoomLikeListsResult = await roomDao.checkRoomLike(connection, roomIdx, userIdx, wishIdx);
    connection.release();

    return checkRoomLikeListsResult;
};

exports.checkUsers = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUsersResult = await roomDao.checkUsers(connection, userIdx);
    connection.release();

    return checkUsersResult;
};

exports.checkReservations = async function (reservationIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkReservationsResult = await roomDao.checkReservations(connection, reservationIdx);
    connection.release();

    return checkReservationsResult;
};

exports.checkUserReservations = async function (userIdx, roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUserReservationsResult = await roomDao.checkUserReservations(connection, userIdx, roomIdx);
    connection.release();

    return checkUserReservationsResult;
};

exports.checkUserReviews = async function (userIdx, roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUserReviewsResult = await roomDao.checkUserReviews(connection, userIdx, roomIdx);
    connection.release();

    return checkUserReviewsResult;
};

exports.checkHostReviews = async function (userIdx, hostUserIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkHostReviewsResult = await roomDao.checkHostReviews(connection, userIdx, hostUserIdx);
    connection.release();

    return checkHostReviewsResult;
};

exports.getUserEmail = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getUserEmailResult = await roomDao.getUserEmail(connection, userIdx);

    return getUserEmailResult;
}
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const experienceDao = require("./experienceDao");

exports.selectTestRooms = async function (userIdx){

    const connection = await pool.getConnection(async (conn) => conn);
    // const roomListResult = await experienceDao.selectRooms(connection, selectRoomsInfoParams);
    const roomListResult = await experienceDao.selectTestRooms(connection, userIdx);
    connection.release();

    return roomListResult;
};

//숙소 조회 API
exports.selectRooms = async function (selectRoomsInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomListResult = await experienceDao.selectRooms(connection, selectRoomsInfoParams);
    connection.release();

    return roomListResult;
};

exports.selectRoomsToDate = async function (selectRoomsInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomListResult = await experienceDao.selectRoomsToDate(connection, selectRoomsInfoParams);
    connection.release();

    return roomListResult;
};

exports.selectRoomsToGuest = async function (selectRoomsInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomListResult = await experienceDao.selectRoomsToGuest(connection, selectRoomsInfoParams);
    connection.release();

    return roomListResult;
};

exports.selectRoomsToDateGuest = async function (selectRoomsInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomListResult = await experienceDao.selectRoomsToDateGuest(connection, selectRoomsInfoParams);
    connection.release();

    return roomListResult;
}

// 호스트 정보 조회 API
exports.selectHostInfo = async function (hostUserIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const hostInfoResult = await experienceDao.selectHostInfo(connection, hostUserIdx);
    connection.release();

    return hostInfoResult;
}

exports.selectHostRooms = async function (userIdx, hostUserIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const hostRoomsResult = await experienceDao.selectHostRooms(connection, userIdx, hostUserIdx);
    connection.release();

    return hostRoomsResult;
}

exports.selectHostReviews = async function (hostUserIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const hostReviewsResult = await experienceDao.selectHostReviews(connection, hostUserIdx);
    connection.release();

    return hostReviewsResult;
}

// 숙소 내용 조회 API
exports.selectRoomContents = async function (roomIdx, userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomContentsListResult = await experienceDao.selectRoomContents(connection, roomIdx, userIdx);
    connection.release();

    return roomContentsListResult;
};

exports.selectRoomImages = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomImagesListResult = await experienceDao.selectRoomImages(connection, roomIdx);
    connection.release();

    return roomImagesListResult;
};


exports.selectRoomFacilities = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomFacilitiesListResult = await experienceDao.selectRoomFacilities(connection, roomIdx);
    connection.release();

    return roomFacilitiesListResult;
}

exports.selectRoomBadges = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomBadgesListResult = await experienceDao.selectRoomBadges(connection, roomIdx);
    connection.release();

    return roomBadgesListResult;
}

exports.selectRoomReviews = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomReviewsListResult = await experienceDao.selectRoomReviews(connection, roomIdx);
    connection.release();

    return roomReviewsListResult;
};

//숙소 리뷰 상세 조회 API
exports.selectReviewGradeAll = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewGradesListResult = await experienceDao.selectReviewGradeAll(connection, roomIdx);
    connection.release();

    return reviewGradesListResult;
}

exports.selectRoomReviewsAll = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewsAllListResult = await experienceDao.selectRoomReviewsAll(connection, roomIdx);
    connection.release();

    return reviewsAllListResult;
};

// 숙소 예약 현황 조회 API
exports.selectRoomReservation = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomReservationListResult = await experienceDao.selectRoomReservation(connection, roomIdx);
    connection.release();

    return roomReservationListResult;
};

exports.selectRoomReviewGrade = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomReviewGradeListResult = await experienceDao.selectRoomReviewGrade(connection, roomIdx);
    connection.release();

    return roomReviewGradeListResult;
};

// 숙소 예약 정보 조회 API
exports.selectRoomReservationInfo = async function (roomIdx, userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reservationInfoListResult = await experienceDao.selectRoomReservationInfo(connection, roomIdx, userIdx);
    connection.release();

    return reservationInfoListResult;
}

// check
exports.checkExp = async function(experienceIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkExpResult = await experienceDao.checkExp(connection, experienceIdx);
    connection.release();

    return checkExpResult;
};

exports.checkExpLike = async function(userIdx, experienceIdx, wishIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const checkExpLikeResult = await experienceDao.checkExpLikes(connection, userIdx, experienceIdx, wishIdx);
    connection.release();

    return checkExpLikeResult;
};

exports.checkRoomReservation = async function (roomIdx, startDate, endDate) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkRoomReservationResult = await experienceDao.checkRoomReservation(connection, roomIdx, startDate, endDate);
    connection.release();

    return checkRoomReservationResult;
};

exports.checkWishLists = async function (wishIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkWishListsResult = await experienceDao.checkWishLists(connection, wishIdx);
    connection.release();

    return checkWishListsResult;
};

exports.checkRoomLike = async function (roomIdx, userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkRoomLikeListsResult = await experienceDao.checkRoomLike(connection, roomIdx, userIdx);
    connection.release();

    return checkRoomLikeListsResult;
};

exports.checkUsers = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUsersResult = await experienceDao.checkUsers(connection, userIdx);
    connection.release();

    return checkUsersResult;
};

exports.checkReservations = async function (reservationIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkReservationsResult = await experienceDao.checkReservations(connection, reservationIdx);
    connection.release();

    return checkReservationsResult;
};

exports.checkUserReservations = async function (userIdx, roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUserReservationsResult = await experienceDao.checkUserReservations(connection, userIdx, roomIdx);
    connection.release();

    return checkUserReservationsResult;
}

exports.checkUserReviews = async function (userIdx, roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUserReviewsResult = await experienceDao.checkUserReviews(connection, userIdx, roomIdx);
    connection.release();

    return checkUserReviewsResult;
}

exports.checkHostReviews = async function (userIdx, hostUserIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkHostReviewsResult = await experienceDao.checkHostReviews(connection, userIdx, hostUserIdx);
    connection.release();

    return checkHostReviewsResult;
}
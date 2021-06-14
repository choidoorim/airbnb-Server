const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const experienceProvider = require("./experienceProvider");
const roomProvider = require("../Room/roomProvider");
const experienceDao = require("./experienceDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// 예약 하기 API
exports.insertReservation = async function(insertReservationInfoParams) {
    try {
        const checkRooms = await roomProvider.checkRooms(insertReservationInfoParams[0]);
        console.log(checkRooms);
        if(checkRooms.length === 0)
            return errResponse(baseResponse.ROOM_NOT_EXIST);
        if(checkRooms[0].maxPeople < (Number(insertReservationInfoParams[3]) + Number(insertReservationInfoParams[4])))
            return errResponse(baseResponse.ROOM_MAX_PEOPLE);
        if(checkRooms[0].userIdx === insertReservationInfoParams[8])
            return errResponse(baseResponse.ROOM_HOST_USER);

        const checkRoomReservation = await roomProvider.checkRoomReservation(insertReservationInfoParams[0], insertReservationInfoParams[1], insertReservationInfoParams[2])
        if(checkRoomReservation.length > 0)
            return errResponse(baseResponse.ROOM_RESERVATION_EXITS);

        const connection = await pool.getConnection(async (conn) => conn);
        const insertReservationResult = await roomDao.insertReservation(connection, insertReservationInfoParams);
        console.log(insertReservationResult[0].insertId);
        connection.release();

        return response(baseResponse.ROOMS_RESERVATION_INSERT_SUCCESS, insertReservationResult[0].insertId);

    } catch (err) {
        logger.error(`App - insertReservation Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 예약 확정(호스트) API
exports.updateRoomReservation = async function(userIdx, reservationIdx) {
    try {
        const checkUsers = await roomProvider.checkUsers(userIdx);
        if(checkUsers.length === 0 || checkUsers[0].status === 'N') return errResponse(baseResponse.USER_NOT_EXIST);
        if(checkUsers[0].hostStatus !== 'Y') return errResponse(baseResponse.NOT_HOST_USER)

        const checkReservations = await roomProvider.checkReservations(reservationIdx);
        if(!checkReservations || checkReservations[0].status === 'N') return errResponse(baseResponse.RESERVATION_NOT_EXIST);
        if(checkReservations[0].status === 'Y') return errResponse(baseResponse.ALREADY_RESERVATION_STATUS);

        const checkRooms = await roomProvider.checkRooms(checkReservations[0].roomIdx);
        console.log(checkRooms);
        if(checkRooms[0].userIdx != userIdx) return errResponse(baseResponse.NOT_ROOM_HOST_USER);

        const connection = await pool.getConnection(async (conn) => conn);
        const updateRoomReservationResult = await roomDao.updateRoomReservation(connection, reservationIdx);
        connection.release();

        return response(baseResponse.HOST_ROOMS_RESERVATION_CONFIRM_SUCCESS, updateRoomReservationResult[0].info);

    } catch (err) {
        logger.error(`App - updateRoomReservation Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.insertUserReviews = async function(contents, userIdx, roomIdx, accuracyGrade, communicationGrade, checkinGrade, cleanlinessGrade, locationGrade, priceSatisfactionGrade) {
    try {
        const insertInfo = [contents, userIdx, roomIdx, accuracyGrade, communicationGrade, checkinGrade, cleanlinessGrade, locationGrade, priceSatisfactionGrade];

        const checkReservation = await roomProvider.checkUserReservations(userIdx, roomIdx);
        if(checkReservation.length === 0) return errResponse(baseResponse.RESERVATION_NOT_EXIST);

        const checkUserReviews = await roomProvider.checkUserReviews(userIdx, roomIdx);
        if(checkUserReviews.length > 0) return errResponse(baseResponse.REVIEWS_ALREADY_EXIST);

        const connection = await pool.getConnection(async (conn) => conn);
        const insertReviewsResult = await roomDao.insertUserReviews(connection, insertInfo);
        connection.release();

        return response(baseResponse.INSERT_ROOM_REVIEWS_SUCCESS, insertReviewsResult[0].insertId);
    } catch(err) {
        logger.error(`App - insertUserReviews Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.insertHostReviews = async function(contents, userIdx, hostUserIdx) {
    try {
        const checkHost = await roomProvider.checkUsers(hostUserIdx);
        if(checkHost[0].hostStatus === 'N') return errResponse(baseResponse.NOT_HOST_USER);

        const checkHostReviews = await roomProvider.checkHostReviews(userIdx, hostUserIdx);
        console.log(checkHostReviews.length);
        if(checkHostReviews.length > 0) return errResponse(baseResponse.REVIEWS_ALREADY_EXIST);

        const connection = await pool.getConnection(async (conn) => conn);
        const insertHostReviewsResult = await roomDao.insertHostReviews(connection, contents, userIdx, hostUserIdx);
        connection.release();

        return response(baseResponse.INSERT_HOST_REVIEWS_SUCCESS, insertHostReviewsResult[0].insertId);
    }catch (err) {
        logger.error(`App - insertHostReviews Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 위시리스트 생성 API
exports.insertRoomWishListsToPeople = async function(insertRoomWishListsInfoParams) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const insertRoomWishListsResult = await roomDao.insertRoomWishListsToPeople(connection, insertRoomWishListsInfoParams);
        console.log(insertRoomWishListsResult[0].insertId);
        connection.release();

        return response(baseResponse.WISHLIST_INSERT_SUCCESS, insertRoomWishListsResult[0].insertId);

    } catch(err) {
        logger.error(`App - insertRoomWishListsToPeople Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.insertRoomWishListsToDate = async function(insertRoomWishListsInfoParams) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const insertRoomWishListsResult = await roomDao.insertRoomWishListsToDate(connection, insertRoomWishListsInfoParams);
        console.log(insertRoomWishListsResult[0].insertId);
        connection.release();

        return response(baseResponse.WISHLIST_INSERT_SUCCESS, insertRoomWishListsResult[0].insertId);

    } catch(err) {
        logger.error(`App - insertRoomWishListsToDate Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.insertRoomWishListsToWishName = async function(insertRoomWishListsInfoParams) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const insertRoomWishListsResult = await roomDao.insertRoomWishListsToWishName(connection, insertRoomWishListsInfoParams);
        console.log(insertRoomWishListsResult[0].insertId);
        connection.release();

        return response(baseResponse.WISHLIST_INSERT_SUCCESS, insertRoomWishListsResult[0].insertId);

    } catch(err) {
        logger.error(`App - insertRoomWishListsToWishName Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.insertRoomWishLists = async function(insertRoomWishListsInfoParams) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const insertRoomWishListsResult = await roomDao.insertRoomWishLists(connection, insertRoomWishListsInfoParams);
        console.log(insertRoomWishListsResult[0].insertId);
        connection.release();

        return response(baseResponse.WISHLIST_INSERT_SUCCESS, insertRoomWishListsResult[0].insertId);

    } catch(err) {
        logger.error(`App - insertRoomWishLists Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 체험 찜하기 API
exports.insertExpLikes = async function(userIdx, experienceIdx, wishIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        let status;
        const checkExp = await experienceProvider.checkExp(experienceIdx);
        if(checkExp.length === 0) return errResponse(baseResponse.EXPERIENCES_NOT_EXITS);

        const checkWish = await roomProvider.checkWishLists(wishIdx);
        if(checkWish.length === 0 || checkWish[0].status === 'N') return errResponse(baseResponse.WISHLISTS_NOT_EXITS);
        if(checkWish[0].userIdx !== userIdx) return errResponse(baseResponse.NOT_WISHLIST_USER);

        const checkExpLike = await experienceProvider.checkExpLike(userIdx, experienceIdx, wishIdx);

        await connection.beginTransaction();
        if(checkExpLike.length < 1){
            const insertExpLikesResult = await experienceDao.insertExpLikes(connection, userIdx, experienceIdx, wishIdx);
            await connection.commit();
            return response(baseResponse.EXPERIENCE_LIKE_STATUS_SUCCESS, insertExpLikesResult[0].insertId);
        }
        else if(checkExpLike.length > 0){
            if(checkExpLike[0].status === 'Y'){
                status = 'N';
            }
            else if(checkExpLike[0].status === 'N') {
                status = 'Y';
            }
            const updateExpLikeResult = await experienceDao.updateExpLikes(connection, status, userIdx, experienceIdx, wishIdx);
            await connection.commit();
            return response(baseResponse.EXPERIENCE_LIKE_STATUS_SUCCESS, updateExpLikeResult[0].info);
        }
    } catch (err) {
        await connection.rollback();
        logger.error(`App - insertExpLikes Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

// 숙소 예약 취소 API
exports.cancelUserRoomReservation = async function (userIdx, reservationIdx) {
      try {
          const checkUsers = await roomProvider.checkUsers(userIdx);
          if(checkUsers.length === 0 || checkUsers[0].status === 'N') return errResponse(baseResponse.USER_NOT_EXIST);

          const checkReservations = await roomProvider.checkReservations(reservationIdx);
          if(!checkReservations) return errResponse(baseResponse.RESERVATION_NOT_EXIST);
          if(checkReservations[0].status === 'N') return errResponse(baseResponse.ALREADY_DELETE_RESERVATION_STATUS);

          const checkRooms = await roomProvider.checkRooms(checkReservations[0].roomIdx);
          if(checkUsers[0].hostStatus === 'Y') {
              if(checkRooms[0].userIdx != userIdx) return errResponse(baseResponse.NOT_ROOM_HOST_USER);
          }else if(checkUsers[0].hostStatus === 'N') {
              if(checkReservations[0].userIdx != userIdx) return errResponse(baseResponse.NOT_RESERVATION_USER);
          }

          const connection = await pool.getConnection(async (conn) => conn);
          const deleteRoomReservationResult = await roomDao.deleteRoomReservation(connection, reservationIdx);

          return response(baseResponse.DELETE_RESERVATION_SUCCESS, deleteRoomReservationResult[0].info);
      } catch (err) {
          logger.error(`App - updateUserRoomReservation Service error\n: ${err.message}`);
          return errResponse(baseResponse.DB_ERROR);
      }
};

// 신고하기 API
exports.insertReports = async function (reportIdx, roomIdx, userIdx) {
    try {
        const checkUsers = await roomProvider.checkUsers(userIdx);
        if(checkUsers.length === 0 || checkUsers[0].status === 'N') return errResponse(baseResponse.USER_NOT_EXIST);

        const checkRooms = await roomProvider.checkRooms(roomIdx);
        if(checkRooms.length === 0) return errResponse(baseResponse.ROOM_NOT_EXIST);

        const connection = await pool.getConnection(async (conn) => conn);
        const insertReportResult = await roomDao.insertReports(connection, reportIdx, roomIdx, userIdx);

        return response(baseResponse.ROOM_REPORT_SUCCESS, insertReportResult[0].insertId);

    } catch (err) {
        logger.error(`App - insertReports Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
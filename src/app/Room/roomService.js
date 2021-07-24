const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const roomProvider = require("./roomProvider");
const roomDao = require("./roomDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");
const {transporter} = require('../../../config/resEmail');

// 예약 하기 API
exports.insertReservation = async function(insertReservationInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const checkRooms = await roomProvider.checkRooms(insertReservationInfoParams[0]);
        console.log(checkRooms);
        if(checkRooms.length === 0)
            return errResponse(baseResponse.ROOM_NOT_EXIST); // 존재하는 숙소인지
        if(checkRooms[0].maxPeople < (Number(insertReservationInfoParams[3]) + Number(insertReservationInfoParams[4])))
            return errResponse(baseResponse.ROOM_MAX_PEOPLE); // 신청할 수 있는 최대인원을 넘었는지
        if(checkRooms[0].userIdx === insertReservationInfoParams[8])
            return errResponse(baseResponse.ROOM_HOST_USER); // 숙소의 호스트와 예약자가 같은지

        const checkRoomReservation = await roomProvider.checkRoomReservation(insertReservationInfoParams[0], insertReservationInfoParams[1], insertReservationInfoParams[2])
        if(checkRoomReservation.length > 0)
            return errResponse(baseResponse.ROOM_RESERVATION_EXITS); // 해당 숙소가 예약된 날짜가 있는지지
        await connection.beginTransaction();
        const insertReservationResult = await roomDao.insertReservation(connection, insertReservationInfoParams);

        const getUserEmail = await roomProvider.getUserEmail(insertReservationInfoParams[8]);
        if(getUserEmail.length < 1){
            await connection.commit();
            return response(baseResponse.ROOMS_RESERVATION_INSERT_SUCCESS, insertReservationResult[0].insertId);
        }else if(getUserEmail.length > 0){
            const info = await transporter.sendMail({
                from: `"Airbnb clone" <${process.env.NODEMAILER_USER}>`,
                to: getUserEmail[0].email,
                subject: 'Airbnb Reservation Info',
                text: '',
                html: `
                    <h1>Reservation Info</h1><br>
                    <b>Room Name: ${checkRooms[0].title}</b><br>
                    <b>Room Location: ${checkRooms[0].locationName}</b><br>
                    <b>Date: ${insertReservationInfoParams[1]} ~ ${insertReservationInfoParams[2]}</b><br>
                `,
            });
            await connection.commit();
            console.log('Message sent: %s', info.messageId);

            return response(baseResponse.ROOMS_RESERVATION_INSERT_EMAIL_SUCCESS, insertReservationResult[0].insertId);
        }
    } catch (err) {
        await connection.rollback();
        logger.error(`App - insertReservation Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

// 예약 확정(호스트) API
exports.updateRoomReservation = async function(userIdx, reservationIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const checkUsers = await roomProvider.checkUsers(userIdx);
        if(checkUsers.length === 0 || checkUsers[0].status === 'N') return errResponse(baseResponse.USER_NOT_EXIST);
        if(checkUsers[0].hostStatus !== 'Y') return errResponse(baseResponse.NOT_HOST_USER)

        const checkReservations = await roomProvider.checkReservations(reservationIdx);
        if(checkReservations.length === 0 || checkReservations[0].status === 'N') return errResponse(baseResponse.RESERVATION_NOT_EXIST);
        if(checkReservations[0].status === 'Y') return errResponse(baseResponse.ALREADY_RESERVATION_STATUS);

        const checkRooms = await roomProvider.checkRooms(checkReservations[0].roomIdx);
        console.log(checkRooms);
        if(checkRooms[0].userIdx != userIdx) return errResponse(baseResponse.NOT_ROOM_HOST_USER);

        await connection.beginTransaction();
        const updateRoomReservationResult = await roomDao.updateRoomReservation(connection, reservationIdx);
        const getUserEmail = await roomProvider.getUserEmail(checkReservations[0].userIdx);
        const info = await transporter.sendMail({
            from: `"Airbnb clone" <${process.env.NODEMAILER_USER}>`,
            to: getUserEmail[0].email,
            subject: 'Airbnb Reservation Complete info',
            text: '',
            html: `
                    <h1>Reservation Complete</h1><br>
                    <b>Room Name: ${checkRooms[0].title}</b><br>
                    <b>Room Location: ${checkRooms[0].locationName}</b><br>
                    <b>Date: ${checkReservations[0].startDate} ~ ${checkReservations[0].endDate}</b><br>
                `,
        });
        await connection.commit();
        console.log('Message sent: %s', info.messageId);

        return response(baseResponse.HOST_ROOMS_RESERVATION_CONFIRM_SUCCESS, updateRoomReservationResult[0].info);

    } catch (err) {
        await connection.rollback();
        logger.error(`App - updateRoomReservation Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}

exports.insertUserReviews = async function(contents, userIdx, roomIdx, accuracyGrade, communicationGrade, checkinGrade, cleanlinessGrade, locationGrade, priceSatisfactionGrade) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const insertInfo = [
            contents,
            userIdx,
            roomIdx,
            accuracyGrade,
            communicationGrade,
            checkinGrade,
            cleanlinessGrade,
            locationGrade,
            priceSatisfactionGrade
        ];

        const checkReservation = await roomProvider.checkUserReservations(userIdx, roomIdx);
        if(checkReservation.length === 0) return errResponse(baseResponse.RESERVATION_NOT_EXIST);

        const checkUserReviews = await roomProvider.checkUserReviews(userIdx, roomIdx);
        if(checkUserReviews.length > 0) return errResponse(baseResponse.REVIEWS_ALREADY_EXIST);

        await connection.beginTransaction();
        const insertReviewsResult = await roomDao.insertUserReviews(connection, insertInfo);
        await connection.commit();

        return response(baseResponse.INSERT_ROOM_REVIEWS_SUCCESS, insertReviewsResult[0].insertId);
    } catch(err) {
        await connection.rollback();
        logger.error(`App - insertUserReviews Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}

exports.insertHostReviews = async function(contents, userIdx, hostUserIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const checkHost = await roomProvider.checkUsers(hostUserIdx);
        if(checkHost[0].hostStatus === 'N') return errResponse(baseResponse.NOT_HOST_USER);

        const checkHostReviews = await roomProvider.checkHostReviews(userIdx, hostUserIdx);
        console.log(checkHostReviews.length);
        if(checkHostReviews.length > 0) return errResponse(baseResponse.REVIEWS_ALREADY_EXIST);

        await connection.beginTransaction();
        const insertHostReviewsResult = await roomDao.insertHostReviews(connection, contents, userIdx, hostUserIdx);
        await connection.commit();

        return response(baseResponse.INSERT_HOST_REVIEWS_SUCCESS, insertHostReviewsResult[0].insertId);
    }catch (err) {
        await connection.rollback();
        logger.error(`App - insertHostReviews Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}

// 위시리스트 생성 API
exports.insertRoomWishListsToPeople = async function(insertRoomWishListsInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();
        const insertRoomWishListsResult = await roomDao.insertRoomWishListsToPeople(connection, insertRoomWishListsInfoParams);
        await connection.commit();

        return response(baseResponse.WISHLIST_INSERT_SUCCESS, insertRoomWishListsResult[0].insertId);

    } catch(err) {
        await connection.rollback();
        logger.error(`App - insertRoomWishListsToPeople Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

exports.insertRoomWishListsToDate = async function(insertRoomWishListsInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {

        await connection.beginTransaction();
        const insertRoomWishListsResult = await roomDao.insertRoomWishListsToDate(connection, insertRoomWishListsInfoParams);
        await connection.commit();

        return response(baseResponse.WISHLIST_INSERT_SUCCESS, insertRoomWishListsResult[0].insertId);

    } catch(err) {
        await connection.rollback();
        logger.error(`App - insertRoomWishListsToDate Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

exports.insertRoomWishListsToWishName = async function(insertRoomWishListsInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();
        const insertRoomWishListsResult = await roomDao.insertRoomWishListsToWishName(connection, insertRoomWishListsInfoParams);
        await connection.commit();

        return response(baseResponse.WISHLIST_INSERT_SUCCESS, insertRoomWishListsResult[0].insertId);

    } catch(err) {
        await connection.rollback();
        logger.error(`App - insertRoomWishListsToWishName Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

exports.insertRoomWishLists = async function(insertRoomWishListsInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();
        const insertRoomWishListsResult = await roomDao.insertRoomWishLists(connection, insertRoomWishListsInfoParams);
        await connection.commit();

        return response(baseResponse.WISHLIST_INSERT_SUCCESS, insertRoomWishListsResult[0].insertId);

    } catch(err) {
        await connection.rollback();
        logger.error(`App - insertRoomWishLists Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

// 숙소 찜하기 API
exports.createRoomLike = async function(roomIdx, userIdx, wishIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        let status;
        const checkRooms = await roomProvider.checkRooms(roomIdx);
        if(checkRooms.length === 0) return errResponse(baseResponse.ROOM_NOT_EXIST);

        const checkWish = await roomProvider.checkWishLists(wishIdx);
        if(checkWish.length === 0) return errResponse(baseResponse.WISHLISTS_NOT_EXITS);
        if(checkWish[0].status === 'N') return errResponse(baseResponse.WISHLISTS_NOT_EXITS);
        if(checkWish[0].userIdx !== userIdx) return errResponse(baseResponse.NOT_WISHLIST_USER);

        const checkRoomLike = await roomProvider.checkRoomLike(roomIdx, userIdx, wishIdx);

        await connection.beginTransaction();
        if(checkRoomLike.length < 1){
            const insertRoomLikeResult = await roomDao.insertRoomLike(connection, roomIdx, userIdx, wishIdx);
            await connection.commit();

            return response(baseResponse.ROOM_LIKE_STATUS_SUCCESS, insertRoomLikeResult[0].insertId);
        }else if(checkRoomLike.length > 0){
            if(checkRoomLike[0].status === 'N') {
                status = 'Y';
            }else if(checkRoomLike[0].status === 'Y'){
                status = 'N';
            }
            const updateRoomLikeResult = await roomDao.updateRoomLike(connection, status, roomIdx, userIdx, wishIdx);
            await connection.commit();

            return response(baseResponse.ROOM_LIKE_STATUS_SUCCESS, updateRoomLikeResult[0].info);
        }
    } catch (err) {
        await connection.rollback();
        logger.error(`App - createRoomLike Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

// 숙소 예약 취소 API
exports.cancelUserRoomReservation = async function (userIdx, reservationIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
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

          await connection.beginTransaction();
          const deleteRoomReservationResult = await roomDao.deleteRoomReservation(connection, reservationIdx);
          await connection.commit();

          return response(baseResponse.DELETE_RESERVATION_SUCCESS, deleteRoomReservationResult[0].info);
      } catch (err) {
          await connection.rollback();
          logger.error(`App - updateUserRoomReservation Service error\n: ${err.message}`);
          return errResponse(baseResponse.DB_ERROR);
      } finally {
          connection.release();
      }
};

// 신고하기 API
exports.insertReports = async function (reportIdx, roomIdx, userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const checkUsers = await roomProvider.checkUsers(userIdx);
        if(checkUsers.length === 0 || checkUsers[0].status === 'N') return errResponse(baseResponse.USER_NOT_EXIST);

        const checkRooms = await roomProvider.checkRooms(roomIdx);
        if(checkRooms.length === 0) return errResponse(baseResponse.ROOM_NOT_EXIST);

        await connection.beginTransaction();
        const insertReportResult = await roomDao.insertReports(connection, reportIdx, roomIdx, userIdx);
        await connection.commit();

        return response(baseResponse.ROOM_REPORT_SUCCESS, insertReportResult[0].insertId);
    } catch (err) {
        await connection.rollback();
        logger.error(`App - insertReports Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}
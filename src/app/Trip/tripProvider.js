const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const tripDao = require("./tripDao");

exports.selectPastReservations = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const pastReservationResult = await tripDao.selectPastReservations(connection, userIdx);
    connection.release();

    return pastReservationResult;
};

exports.selectFutureReservation = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const futureReservationResult = await tripDao.selectFutureReservations(connection, userIdx);
    connection.release();

    return futureReservationResult;
};

exports.selectUserReservations = async function (reservationIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userReservationInfo = await tripDao.selectUserReservations(connection, reservationIdx);
    connection.release();

    return userReservationInfo;
};

exports.selectReservationImage = async function (reservationIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reservationImageInfo = await tripDao.selectReservationImage(connection, reservationIdx);
    connection.release();

    return reservationImageInfo;
};

//check
exports.checkReservationInfo = async function (reservationIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkReservationResult = await tripDao.checkReservationInfo(connection, reservationIdx);
    connection.release();

    return checkReservationResult;
}

exports.checkReservationDate = async function (startDate, endDate, roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkDateResult = await tripDao.checkReservationDate(connection, startDate, endDate, roomIdx);
    connection.release();

    return checkDateResult;
};

const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const tripProvider = require("./tripProvider");
const roomProvider = require("../Room/roomProvider");
const tripDao = require("./tripDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");
const {transporter} = require('../../../config/resEmail');

exports.updateReservationInfo = async function (userIdx, reservationIdx, startDate, endDate, adultNum, chileNum, infantNum) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        const checkReservationUsers = await tripProvider.checkReservationInfo(reservationIdx);
        if(checkReservationUsers.length === 0) return errResponse(baseResponse.RESERVATION_NOT_EXIST);
        if(userIdx != checkReservationUsers[0].userIdx) return errResponse(baseResponse.NOT_RESERVATION_USER);

        const checkReservationDate = await tripProvider.checkReservationDate(startDate, endDate, checkReservationUsers[0].roomIdx);
        console.log(checkReservationDate);
        if(checkReservationDate.length > 0) return errResponse(baseResponse.ROOM_RESERVATION_EXITS);

        const checkRooms = await roomProvider.checkRooms(checkReservationUsers[0].roomIdx);

        await connection.beginTransaction();
        const updateReservationInfoResult = await tripDao.updateReservationInfo(connection, userIdx, reservationIdx, startDate, endDate, adultNum, chileNum, infantNum);
        const getUserEmail = await roomProvider.getUserEmail(userIdx);
        const info = await transporter.sendMail({
            from: `"Airbnb clone" <${process.env.NODEMAILER_USER}>`,
            to: getUserEmail[0].email,
            subject: 'Airbnb Reservation Change info',
            text: '',
            html: `
                    <h1>Reservation Change</h1><br>
                    <b>Room Name: ${checkRooms[0].title}</b><br>
                    <b>Room Location: ${checkRooms[0].locationName}</b><br>
                    <b>ChangeDate:${checkReservationUsers[0].startDate} ~ ${checkReservationUsers[0].endDate} -> ${startDate} ~ ${endDate}</b><br>
                `,
        });
        await connection.commit();

        return response(baseResponse.RESERVATION_UPDATE_SUCCESS, updateReservationInfoResult[0].info);
    } catch (err) {
        await connection.rollback();
        logger.error(`App - updateReservationInfo Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};
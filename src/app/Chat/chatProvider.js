 const {response, errResponse} = require("../../../config/response");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");

const chatDao = require("./chatDao");

// 채팅방 정보 조회 
exports.selectChatRoomInfo = async function (roomIdx, userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reservationInfoListResult = await chatDao.selectChatRoomInfo(connection, roomIdx, userIdx);
    connection.release();

    return reservationInfoListResult;
}

// host 찾기
exports.retrieveUserByRoom = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomListResult = await chatDao.selectUserByRoom(connection, roomIdx);
    connection.release();

    return roomListResult;
};

// chatRoomIdx 찾기
exports.retrieveChatRoomByRoom = async function (roomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const chatRoomIdxResult = await chatDao.checkChatRoomByRoom(connection, roomIdx);
    connection.release();

    return chatRoomIdxResult;
};

// 채팅방 조회
exports.retrieveChatRoom = async function(userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);

        // 유저별 채팅방 조회
        const chatRoomResult = await chatDao.selectChatRoom(connection, userIdx);

        connection.release();        
        return response(baseResponse.CHATROOM_SELECT_SUCCESS, chatRoomResult);
};

// 채팅 조회
exports.retrieveChatBychatRoomIdx = async function(chatRoomIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        // 채팅에 필요한 숙소 정보 가져오기
        const chatRoomResult = await chatDao.selectRoomByChatRoom(connection, chatRoomIdx);

        // 채팅에 필요한 예약 정보 가져오기
        const ReservationResult = await chatDao.selectReservationByChatRoom(connection, chatRoomIdx);

        // 채팅 내역 가져오기
        const chatResult = await chatDao.selectChatByChatRoomIdx(connection, chatRoomIdx);

        await connection.commit();
        connection.release();

        return response(baseResponse.CHAT_SELECT_SUCCESS, {"Room": chatRoomResult[0], "Reservation":ReservationResult[0], "Chat": chatResult});
    } catch (err) {
        logger.error(`App - retrieveRoom Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};


// 예약 있는지 조회
exports.checkReservations = async function (roomIdx, senderIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkReservationsResult = await chatDao.checkReservations(connection, roomIdx, senderIdx);
    connection.release();

    return checkReservationsResult;
}

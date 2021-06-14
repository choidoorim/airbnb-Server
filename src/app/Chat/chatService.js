const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const chatProvider = require("./chatProvider");
const chatDao = require("./chatDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const roomProvider = require("../Room/roomProvider");

exports.createFirstChat = async function(chatRoomIdx, roomIdx, senderIdx, content, startDate, endDate, adultGuestNum, childGuestNum, infantGuestNum) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        // roomIdx 유효한지 검사
        const checkRooms = await roomProvider.checkRooms(roomIdx);
        if(checkRooms.length === 0)
            return errResponse(baseResponse.ROOM_NOT_EXIST);

        // host의 userIdx 찾기
        var host = await chatProvider.retrieveUserByRoom(roomIdx);
        host = host[0].userIdx;

        // chatRoomIdx 찾기
        var chatroom = await chatProvider.retrieveChatRoomByRoom(roomIdx);
        if (chatroom[0] != null){
            chatRoomIdx = chatroom[0].idx
        }

        const checkReservations = await chatProvider.checkReservations(roomIdx, senderIdx);
        if(!checkReservations[0]) { // 예약이 없다면
            // 예약 문의 생성
            const insertQuestionInfoParams = [roomIdx, startDate, endDate, adultGuestNum, childGuestNum, infantGuestNum, senderIdx];
            const insertQuestionResult = await chatDao.insertReservation(connection, insertQuestionInfoParams);
        }
        if(checkReservations[0] != null) { // 예약이 없다면
            if(checkReservations[0].status === 'N') { // 예약이 없다면
            // 예약 문의 생성
            const insertQuestionInfoParams = [roomIdx, startDate, endDate, adultGuestNum, childGuestNum, infantGuestNum, senderIdx];
            const insertQuestionResult = await chatDao.insertReservation(connection, insertQuestionInfoParams);
            }
        }

        console.log(checkReservations);
        console.log(checkReservations[0]);


        if (!chatRoomIdx) {
            // 채팅방 생성
            const createChatRoom = await chatDao.createChatRoom(connection, roomIdx, senderIdx, host);
            const newChatRoomIdx = createChatRoom[0].insertId;
            const createChatParams = [newChatRoomIdx, senderIdx, content];

            // 채팅 생성
            const createChat = await chatDao.createChat(connection, createChatParams);
            await connection.commit();
            connection.release();
            return response(baseResponse.CHATROOM_INSERT_SUCCESS, {"addedchatRoomIdx": newChatRoomIdx});
        } else {
            const createChatParams = [chatRoomIdx, senderIdx, content];
            const createChat = await chatDao.createChat(connection, createChatParams);

            await connection.commit();
            connection.release();

            return response(baseResponse.CHATROOM_INSERT_SUCCESS);
        }
    } catch(err) {
        logger.error(`App - createChat Service error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.createChat = async function(chatRoomIdx, roomIdx, senderIdx, content) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        // roomIdx 유효한지 검사
        const checkRooms = await roomProvider.checkRooms(roomIdx);
        console.log(checkRooms);
        if(checkRooms.length === 0)
            return errResponse(baseResponse.ROOM_NOT_EXIST);

        // host의 userIdx 찾기
        var host = await chatProvider.retrieveUserByRoom(roomIdx);
        host = host[0].userIdx;

        // chatRoomIdx 찾기
        var chatroom = await chatProvider.retrieveChatRoomByRoom(roomIdx);
        if (chatroom[0] != null){
            chatRoomIdx = chatroom[0].idx
        }

        if (!chatRoomIdx) {
            // 채팅방 생성
            const createChatRoom = await chatDao.createChatRoom(connection, roomIdx, senderIdx, host);
            const newChatRoomIdx = createChatRoom[0].insertId;
            const createChatParams = [newChatRoomIdx, senderIdx, content];

            // 채팅 생성
            const createChat = await chatDao.createChat(connection, createChatParams);
            await connection.commit();
            connection.release();
            return response(baseResponse.CHAT_INSERT_SUCCESS, {"addedchatRoomIdx": newChatRoomIdx});
        } else {
            const createChatParams = [chatRoomIdx, senderIdx, content];
            const createChat = await chatDao.createChat(connection, createChatParams);

            await connection.commit();
            connection.release();

            return response(baseResponse.CHAT_INSERT_SUCCESS);
        }
    } catch(err) {
        logger.error(`App - createChat Service error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};
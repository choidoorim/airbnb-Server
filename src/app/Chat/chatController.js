const jwtMiddleware = require("../../../config/jwtMiddleware");
const chatProvider = require("./chatProvider");
const chatService = require("./chatService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const userProvider = require("../User/userProvider");


/**
 * API No.
 * API Name : 채팅방 정보 조회 API
 * [GET] /app/rooms/:roomIdx/question-chat
 **/
 exports.getFirstChat = async function(req, res) {
    const userIdx = req.verifiedToken.userIdx;
    const roomIdx = Number(req.params.roomIdx);
    // const userIdx = 1;

    if(!roomIdx) return res.send(errResponse(baseResponse.ROOM_ID_EMPTY))
    if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY))

    const selectChatRoomInfo = await chatProvider.selectChatRoomInfo(roomIdx, userIdx);

    return res.send(response(baseResponse.CHAT_INFO_SELECT_SUCCESS, selectChatRoomInfo));
}

/*
    API No. 
    API Name : 문의 채팅 전송 API
    [POST] /app/question-chat
*/
exports.postFirstChat = async function (req, res) {
    /*
        Body : chatRoomIdx, roomIdx, content
    */
    const { chatRoomIdx, roomIdx, content, startDate, endDate, adultGuestNum, childGuestNum, infantGuestNum} = req.body;
    
    const userIdxFromJWT = req.verifiedToken.userIdx;

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdxFromJWT);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    } 

    if(!roomIdx) {
        return res.send(response(baseResponse.CHAT_ROOMIDX_EMPTY));
    } else if (!content) {
        return res.send(response(baseResponse.CHAT_CONTENT_EMPTY));
    }

    let DateFormatResult = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/; //dateformat 정규식

    if(!startDate || startDate === "") return res.send(errResponse(baseResponse.START_DATE_EMPTY))
    if(!endDate || endDate === "") return res.send(errResponse(baseResponse.END_DATE_EMPTY))

    let startDateResult = DateFormatResult.exec(startDate);
    let endDateResult = DateFormatResult.exec(endDate);
    if(startDateResult === null) return res.send(errResponse(baseResponse.DATE_TYPE));
    if(endDateResult === null) return res.send(errResponse(baseResponse.DATE_TYPE));

    if(!adultGuestNum) return res.send(errResponse(baseResponse.ADULT_EMPTY))
    if(childGuestNum < 0) return res.send(errResponse(baseResponse.CHILD_EMPTY))
    if(infantGuestNum < 0) return res.send(errResponse(baseResponse.INFANT_EMPTY))

    //const postChatInfoParams = [chatRoomIdx, roomIdx, userIdxFromJWT, content, startDate, endDate, adultGuestNum, childGuestNum, infantGuestNum];

    const postChatResponse = await chatService.createFirstChat(chatRoomIdx, roomIdx, userIdxFromJWT, content, startDate, endDate, adultGuestNum, childGuestNum, infantGuestNum);

    res.send(postChatResponse);
};


/*
    API No. 
    API Name : 채팅 전송 API
    [POST] /app/chat
*/
exports.postChat = async function (req, res) {
    /*
        Body : chatRoomIdx, roomIdx, content
    */
    const { chatRoomIdx, roomIdx, content } = req.body;
    
    const userIdxFromJWT = req.verifiedToken.userIdx;

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdxFromJWT);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    } 

    if(!roomIdx) {
        return res.send(response(baseResponse.CHAT_ROOMIDX_EMPTY));
    } else if (!content) {
        return res.send(response(baseResponse.CHAT_CONTENT_EMPTY));
    }

    const postChatResponse = await chatService.createChat(chatRoomIdx, roomIdx, userIdxFromJWT, content);

    res.send(postChatResponse);
};

/*
    API No. 
    API Name : 채팅방 조회 API
    [GET] /app/chatroom
*/
exports.getChatRooms = async function(req, res) {
    const userIdxFromJWT = req.verifiedToken.userIdx;


    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdxFromJWT);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    } 

    const chatRoomResult = await chatProvider.retrieveChatRoom(userIdxFromJWT);

    return res.send(chatRoomResult);
};

/*
    API No.
    API Name : 채팅 조회 API
    [GET] /app/chat/{chatRoomIdx}
*/
exports.getChat = async function (req, res) {
    // Path Variable : chatRoomIdx
    const chatRoomIdx = req.params.chatRoomIdx;

    const userIdxFromJWT = req.verifiedToken.userIdx;
  
    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdxFromJWT);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    } 

    if (!chatRoomIdx) {
        return res.send(response(baseResponse.CHAT_CHATROOMIDX_EMPTY));
    }

    const chatResult = await chatProvider.retrieveChatBychatRoomIdx(chatRoomIdx);

    return res.send(chatResult);
};
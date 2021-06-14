module.exports = function(app) {
    const chat = require('./chatController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 채팅방 정보 조회 API
    app.get('/app/rooms/:roomIdx/question-chat', jwtMiddleware, chat.getFirstChat);

    // 채팅방 생성 API
    app.post('/app/question-chat', jwtMiddleware, chat.postFirstChat);

    // 채팅 보내기 API
    app.post('/app/chat', jwtMiddleware, chat.postChat);

    // 채팅방 조회 API
    app.get('/app/chatrooms', jwtMiddleware, chat.getChatRooms);

    // 채팅 조회 API
    app.get('/app/chat/:chatRoomIdx', jwtMiddleware, chat.getChat);
};
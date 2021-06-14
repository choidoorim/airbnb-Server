// 채팅방 정보 조회
async function selectChatRoomInfo(connection, roomIdx, userIdx) {
    const selectChatRoomInfoQuery = `
        SELECT RT.idx
            , IFNULL((SELECT imageUrl FROM RoomImageTB RIT WHERE RIT.roomIdx = RT.idx), '') as imageUrl
            , RT.titleSummary
            , RT.title
            , IFNULL((SELECT ROUND(AVG(RRT.communicationGrade), 2)
                    FROM RoomReviewTB RRT
                    where RRT.roomIdx = RT.idx), '') as reviewGrade
            , (SELECT COUNT(RRT.communicationGrade)
            FROM RoomReviewTB RRT
            where RRT.roomIdx = RT.idx) as reviewCount
        FROM RoomTB RT
        WHERE RT.status = 'Y'
        AND RT.idx = ?;
    `
    const selectChatRoomInfoResult = await connection.query(selectChatRoomInfoQuery, roomIdx, userIdx);

    return selectChatRoomInfoResult[0];
}
// RRT.communicationGrade,RRT.accuracyGrade, RRT.communicationGrade,RRT.checkinGrade, RRT.cleanlinessGrade, RRT.locationGrade, RRT.priceSatisfactionGrade

// host 찾기
async function selectUserByRoom(connection, roomIdx) {
    const selectUserByRoomQuery = `
                SELECT userIdx
                FROM RoomTB
                WHERE idx = ?;
                `;
    const [userResult] = await connection.query(selectUserByRoomQuery, roomIdx);

    return userResult;
};

// chatRoomIdx 찾기
async function checkChatRoomByRoom(connection, roomIdx) {
    const selectChatRoomByRoomQuery = `
                SELECT idx
                FROM ChatRoomTB
                WHERE roomIdx = ?;
                `;
    const [userResult] = await connection.query(selectChatRoomByRoomQuery, roomIdx);

    return userResult;
};

// 채팅방 생성
async function createChatRoom(connection, roomIdx, senderIdx, hostIdx) {
    const createChatRoomQuery = `
                INSERT INTO ChatRoomTB(roomIdx, senderIdx, hostIdx)
                VALUES (${roomIdx}, ${senderIdx}, ${hostIdx});
                `; 
    const createChatRoomRow = await connection.query(createChatRoomQuery, roomIdx, senderIdx, hostIdx);

    return createChatRoomRow;
};

// 채팅 생성
async function createChat(connection, createChatParams) {
    const createChatQuery = `
                INSERT INTO ChatTB(chatRoomIdx, senderIdx, content)
                VALUES (?, ?, ?);
                `;
    const createChatRow = await connection.query(createChatQuery, createChatParams);

    return createChatRow;
};

// 채팅 조회
async function selectRoomByChatRoom(connection, chatRoomIdx) {
    const selectRoomByChatRoomQuery = `
                SELECT RoomTB.idx as roomIdx,
                    chatRoomIdx,
                    UserTB.name,
                    RoomTB.title
                FROM UserTB
                    join RoomTB on RoomTB.userIdx = UserTB.idx
                    join ChatRoomTB on ChatRoomTB.roomIdx = RoomTB.idx
                    join ChatTB on ChatTB.chatRoomIdx = ChatRoomTB.idx
                WHERE ChatRoomTB.idx = ?
                group by RoomTB.idx;
                `;
    const [roomRow] = await connection.query(selectRoomByChatRoomQuery, chatRoomIdx);

    return roomRow;
};

async function selectReservationByChatRoom(connection, chatRoomIdx) {
    const selectReservationByChatRoomQuery = `
                SELECT
                case 
                    when ReservationTB.status = 'N' then '문의'
                    when ReservationTB.status = 'A' then '임시 예약' 
                    when ReservationTB.status = 'Y' then '예약 확정'
                end as ResevationStatus,
                date_format(startDate, '%c월 %d일') as startDate,
                date_format(endDate, '%c월 %d일') as endDate
                FROM ChatRoomTB
                    join ReservationTB
                        on  ChatRoomTB.senderIdx  = ReservationTB.userIdx
                        and  ChatRoomTB.roomIdx  = ReservationTB.roomIdx
                WHERE ChatRoomTB.idx = ?;
                `;
    const [reservationRow] = await connection.query(selectReservationByChatRoomQuery, chatRoomIdx);

    return reservationRow;
};

async function selectChatByChatRoomIdx(connection, chatRoomIdx) {
    const selectChatByChatRoomIdxQuery = `
                SELECT 
                    senderIdx,
                    content,
                    case when timestampdiff(year, createdAt, current_timestamp) > 1
                            then date_format(createdAt, '%Y년 %c월 %d일')
                        when timestampdiff(hour, createdAt, current_timestamp) > 24
                            then date_format(createdAt, '%c월 %d일')
                        else
                            case when date_format(createdAt, '%p') = 'AM'
                                    then concat('오전 ', date_format(createdAt, '%h:%i'))
                                    else concat('오후 ', date_format(createdAt, '%h:%i'))
                                end
                    end as sendTime
                FROM ChatTB
                WHERE chatRoomIdx = ${chatRoomIdx} 
                order by createdAt;
                `;
    const [chatRow] = await connection.query(selectChatByChatRoomIdxQuery, chatRoomIdx);

    return chatRow;
};

// 채팅방 조회
async function selectChatRoom(connection, userIdx) {
    const selectChatRoomQuery = `
            SELECT ChatRoomTB.idx,
                lastChatMessage,
                UserTB.profileImage as myprofile,
                h.profileImage as hostprofile,
                h.name,
                ChatRoomTB.roomIdx
            FROM UserTB
                join ChatRoomTB on ChatRoomTB.senderIdx = UserTB.idx or ChatRoomTB.hostIdx = UserTB.idx
                join (select userIdx, profileImage, name, RoomTB.idx from UserTB join RoomTB on RoomTB.userIdx = UserTB.idx) h on h.idx = ChatRoomTB.roomIdx
                join (select ChatTB.chatRoomIdx,
                            content as lastChatMessage,
                            createdAt
                        from ChatTB join (select ChatTB.chatRoomIdx, max(idx) from ChatTB group by ChatTB.chatRoomIdx) currentMessage) as d on d.chatRoomIdx = ChatRoomTB.idx
            WHERE UserTB.idx = ?
            group by ChatRoomTB.idx
            order by d.createdAt DESC;
                `;
    const [chatRoomRows] = await connection.query(selectChatRoomQuery, userIdx);

    return chatRoomRows;
};

// 예약 문의 생성
async function insertReservation(connection, insertQuestionInfoParams) {
    const insertReservationQuery = `
        INSERT INTO ReservationTB (status, roomIdx, startDate, endDate, adultGuestNum, childGuestNum, infantGuestNum, userIdx)
        VALUES ('N', ?, ?, ?,
                ?, ?, ?,
                ?);
    `;

    const insertReservationResult = await connection.query(
        insertReservationQuery,
        insertQuestionInfoParams
    );

    return insertReservationResult;
}

// 예약 확인 
async function checkReservations(connection, roomIdx, senderIdx) {
    const checkReservationsQuery =`
        SELECT status
             , roomIdx
             , startDate
             , endDate
             , adultGuestNum
             , childGuestNum
             , infantGuestNum
             , businessStatus
             , paymentStatus
             , userIdx
             , paymentPrice
        FROM ReservationTB
        WHERE roomidx = ${roomIdx} and userIdx = ${senderIdx};
    `;

    const checkReservationsResult = await connection.query(
        checkReservationsQuery,
        roomIdx, senderIdx
    );

    return checkReservationsResult[0];
}

module.exports = {
    selectChatRoomInfo,
    selectUserByRoom,
    checkChatRoomByRoom,
    createChatRoom,
    createChat,
    selectRoomByChatRoom,
    selectReservationByChatRoom,
    selectChatByChatRoomIdx,
    selectChatRoom,
    insertReservation,
    checkReservations
};
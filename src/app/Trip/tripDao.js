async function selectPastReservations(connection, userIdx) {
    const selectPastReservationsQuery = `
        SELECT RVT.idx                                                                                       as reservationIdx
             , RT.idx                                                                                        as roomIdx
             , IFNULL((SELECT imageUrl FROM RoomImageTB RIT WHERE RIT.roomIdx = RT.idx group by RT.idx), '') as imageUrl
             , date_format(RVT.startDate, '%Y년 %m월 %d일')                                                     as startDate
             , date_format(RVT.endDate, '%Y년 %m월 %d일')                                                       as endDate
             , RT.state                                                                                      as state
             , RT.city                                                                                       as city
             , RT.title                                                                                      as title
        FROM ReservationTB RVT
                 INNER JOIN RoomTB RT on RVT.roomIdx = RT.idx
        WHERE RVT.userIdx = ?
          AND RVT.status = 'Y'
          AND RVT.startDate <= NOW();
    `;

    const selectPastReservationsResult = await connection.query(
        selectPastReservationsQuery,
        userIdx
    );

    return selectPastReservationsResult[0];
}

async function selectFutureReservations(connection, userIdx) {
    const selectFutureReservationsQuery = `
        SELECT RVT.idx                                                                                       as reservationIdx
             , RT.idx                                                                                        as roomIdx
             , IFNULL((SELECT imageUrl FROM RoomImageTB RIT WHERE RIT.roomIdx = RT.idx group by RT.idx), '') as imageUrl
             , date_format(RVT.startDate, '%Y년 %m월 %d일')                                                     as startDate
             , date_format(RVT.endDate, '%Y년 %m월 %d일')                                                       as endDate
             , RT.state                                                                                      as state
             , RT.city                                                                                       as city
             , RT.title                                                                                      as title
             , RVT.status
        FROM ReservationTB RVT
                 INNER JOIN RoomTB RT on RVT.roomIdx = RT.idx
        WHERE RVT.userIdx = ?
          AND RVT.status NOT IN ('N')
          AND RVT.startDate > NOW();
    `;

    const selectFutureReservationsResult = await connection.query(
        selectFutureReservationsQuery,
        userIdx
    );

    return selectFutureReservationsResult[0];
}

async function selectUserReservations(connection, reservationIdx) {
    const selectUserReservationsQuery = `
        SELECT RT.state                                            as state
             , date_format(RVT.startDate, '%Y년 %m월 %d일')           as startDate
             , SUBSTR(_UTF8'일월화수목금토', DAYOFWEEK(RVT.startDate), 1) AS startDay
             , date_format(RVT.endDate, '%Y년 %m월 %d일')             as endDate
             , SUBSTR(_UTF8'일월화수목금토', DAYOFWEEK(RVT.endDate), 1)   AS endDay
             , (SELECT name FROM UserTB WHERE idx = RT.userIdx)    as hostName
             , date_format(RT.fromCheckinTime, '%p %I시 %i분')       as checkinTime
             , date_format(RT.checkoutTime, '%p %I시 %i분')          as checkoutTime
             , RVT.userIdx
        FROM ReservationTB RVT
                 INNER JOIN RoomTB RT on RVT.roomIdx = RT.idx
        WHERE RVT.idx = ?;
    `;

    const selectUserReservationsResult = await connection.query(
        selectUserReservationsQuery,
        reservationIdx
    );

    return selectUserReservationsResult[0];
}

async function selectReservationImage(connection, reservationIdx) {
    const selectReservationImageQuery = `
        SELECT imageUrl
             , roomIdx
        FROM RoomImageTB
        WHERE roomIdx = (SELECT roomIdx FROM ReservationTB WHERE idx = ?)
          AND status = 'Y';
    `

    const selectReservationImageResult = await connection.query(
        selectReservationImageQuery,
        reservationIdx
    );

    return selectReservationImageResult[0];
}

//insert, update
async function updateReservationInfo(connection, userIdx, reservationIdx, startDate, endDate, adultNum, chileNum, infantNum) {
    const updateReservationInfoQuery = `
        UPDATE ReservationTB
        SET startDate = ?,
            endDate   = ?,
            adultGuestNum = ?,
            childGuestNum = ?,
            infantGuestNum = ?
        WHERE userIdx = ?
          AND idx = ?;
    `;

    const updateReservationInfoResult = await connection.query(
        updateReservationInfoQuery,
        [startDate, endDate, adultNum, chileNum, infantNum, userIdx, reservationIdx]
    );

    return updateReservationInfoResult;
}

//check
async function checkReservationInfo(connection, reservationIdx) {
    const checkReservationInfoQuery = `
        SELECT status
             , roomIdx
             , date_format(startDate, '%Y-%m-%d') as startDate
             , date_format(endDate, '%Y-%m-%d') as endDate
             , adultGuestNum
             , childGuestNum
             , infantGuestNum
             , businessStatus
             , paymentStatus
             , userIdx
             , paymentPrice
        FROM ReservationTB
        WHERE idx = ?;
    `;

    const checkReservationInfoResult = await connection.query(
        checkReservationInfoQuery,
        reservationIdx
    );

    return checkReservationInfoResult[0];
}

async function checkReservationDate(connection, startDate, endDate, roomIdx) {
    const checkReservationDateQuery = `
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
        WHERE roomIdx = ?
          AND status NOT IN ('N')
          AND (startDate < ?
            and endDate > ?);
    `;

    const checkReservationDateResult = await connection.query(
        checkReservationDateQuery,
        [roomIdx, endDate, startDate]
    );

    return checkReservationDateResult[0];
}


module.exports = {
    selectPastReservations,
    selectFutureReservations,
    selectUserReservations,
    selectReservationImage,
    updateReservationInfo,
    checkReservationInfo,
    checkReservationDate
}
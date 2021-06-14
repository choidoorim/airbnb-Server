//select
async function selectTestRooms(connection, userIdx){
    const selectRoomsQuery = `
        SELECT RT.idx
             , IFNULL((SELECT LRT.status FROM LikeRoomTB LRT where LRT.userIdx = ?), '')     as LikeStatus
             , IFNULL((SELECT imageUrl FROM RoomImageTB RIT WHERE RIT.roomIdx = RT.idx group by RT.idx), '') as imageUrl
             , IFNULL((SELECT ROUND(AVG((RRT.accuracyGrade + RRT.checkinGrade + RRT.cleanlinessGrade + RRT.locationGrade +
                                         RRT.communicationGrade +
                                         RRT.priceSatisfactionGrade) / 6), 2)
                       FROM RoomReviewTB RRT
                       where RRT.roomIdx = RT.idx), '')                                      as reviewGrade
             , (SELECT COUNT(*)
                FROM RoomReviewTB RRT
                where RRT.roomIdx = RT.idx)                                                  as reviewCount
             , RT.title
             , RT.regionLatitue
             , RT.regionLongitude
             , RT.price
        FROM RoomTB RT
        WHERE RT.status = 'Y';
    `;

    const selectRoomsResult = await connection.query(
        selectRoomsQuery,
        userIdx
    );

    return selectRoomsResult[0];
}

async function selectRooms(connection, selectRoomsInfoParams) {
    const selectRoomQuery = `
        SELECT RT.idx
             , IF((SELECT COUNT(*)
                   FROM ReservationTB
                   WHERE roomIdx = RT.idx
                     AND status = 'Y'
                     AND (endDate > NOW() and endDate < DATE_ADD(NOW(), INTERVAL 1 MONTH))) > 20, '예약이 금방 마감되는 숙소',
                  '')                                                                                        as bookQuickly
             , IFNULL((SELECT LRT.status FROM LikeRoomTB LRT where LRT.userIdx = ? and RT.idx = LRT.roomIdx), '')                     as likeStatus
             , IFNULL((SELECT imageUrl FROM RoomImageTB RIT WHERE RIT.roomIdx = RT.idx group by RT.idx), '') as imageUrl
             , IFNULL((SELECT ROUND(AVG((RRT.accuracyGrade + RRT.checkinGrade + RRT.cleanlinessGrade + RRT.locationGrade +
                                         RRT.communicationGrade +
                                         RRT.priceSatisfactionGrade) / 6), 2)
                       FROM RoomReviewTB RRT
                       where RRT.roomIdx = RT.idx), '아직 후기 없음')                                              as reviewGrade
             , (SELECT COUNT(*)
                FROM RoomReviewTB RRT
                where RRT.roomIdx = RT.idx)                                                                  as reviewCount
             , RT.titleSummary
             , RT.city
             , RT.state
             , RT.title
             , RT.regionLatitue
             , RT.regionLongitude
             , RT.price
        FROM RoomTB RT
        WHERE (6371 * acos(cos(radians(?)) * cos(radians(RT.regionLatitue)) *
                           cos(radians(RT.regionLongitude)
                               - radians(?)) + sin(radians(?)) *
                                               sin(radians(RT.regionLatitue)))) < 10
          AND RT.status = 'Y';
    `;

    const selectRoomResult = await connection.query(
        selectRoomQuery,
        selectRoomsInfoParams
    );

    return selectRoomResult[0];
}

async function selectRoomsToDate(connection, selectRoomsInfoParams) { //userIdx, Lat, Long, Lat, userIdx, Lat, Long, Lat, endDate, startDate
    const selectRoomsToDateQuery = `
        SELECT RT.idx
             , IF((SELECT COUNT(*)
                   FROM ReservationTB
                   WHERE roomIdx = RT.idx
                     AND status = 'Y'
                     AND (endDate > NOW() and endDate < DATE_ADD(NOW(), INTERVAL 1 MONTH))) > 20, '예약이 금방 마감되는 숙소',
                  '')                                                                                        as bookQuickly
             , IFNULL((SELECT LRT.status FROM LikeRoomTB LRT where LRT.userIdx = ? and RT.idx = LRT.roomIdx), '')     as likeStatus
             , IFNULL((SELECT imageUrl FROM RoomImageTB RIT WHERE RIT.roomIdx = RT.idx group by RT.idx), '') as imageUrl
             , IFNULL((SELECT ROUND(AVG((RRT.accuracyGrade + RRT.checkinGrade + RRT.cleanlinessGrade + RRT.locationGrade +
                                         RRT.communicationGrade +
                                         RRT.priceSatisfactionGrade) / 6), 2) 
                       FROM RoomReviewTB RRT
                       where RRT.roomIdx = RT.idx), '아직 후기 없음')                                      as reviewGrade
             , (SELECT COUNT(*)
                FROM RoomReviewTB RRT
                where RRT.roomIdx = RT.idx)                                                  as reviewCount
             , RT.titleSummary
             , RT.city
             , RT.state
             , RT.title
             , RT.regionLatitue
             , RT.regionLongitude
             , RT.price                                                                      as price
        FROM RoomTB RT
                 left join ReservationTB RVT on RT.idx = RVT.roomIdx
        WHERE RVT.roomIdx is null
          AND 6371 * acos(cos(radians(?)) * cos(radians(RT.regionLatitue)) *
                          cos(radians(RT.regionLongitude)
                              - radians(?)) + sin(radians(?)) *
                                              sin(radians(RT.regionLatitue))) < 10
          and RT.status = 'Y'
        UNION
        SELECT RT.idx
             , IF((SELECT COUNT(*)
                   FROM ReservationTB
                   WHERE roomIdx = RT.idx
                     AND status = 'Y'
                     AND (endDate > NOW() and endDate < DATE_ADD(NOW(), INTERVAL 1 MONTH))) > 20, '예약이 금방 마감되는 숙소',
                  '')                                                                                        as bookQuickly
             , IFNULL((SELECT LRT.status FROM LikeRoomTB LRT where LRT.userIdx = ? and RT.idx = LRT.roomIdx), '')     as likeStatus
             , IFNULL((SELECT imageUrl FROM RoomImageTB RIT WHERE RIT.roomIdx = RT.idx group by RT.idx), '') as imageUrl
             , IFNULL((SELECT ROUND(AVG((RRT.accuracyGrade + RRT.checkinGrade + RRT.cleanlinessGrade + RRT.locationGrade +
                                         RRT.communicationGrade +
                                         RRT.priceSatisfactionGrade) / 6), 2) as grade
                       FROM RoomReviewTB RRT
                       where RRT.roomIdx = RT.idx), '아직 후기 없음')                                      as reviewGrade
             , (SELECT COUNT(*)
                FROM RoomReviewTB RRT
                where RRT.roomIdx = RT.idx)                                                  as reviewCount
             , RT.titleSummary
             , RT.city
             , RT.state
             , RT.title
             , RT.regionLatitue
             , RT.regionLongitude
             , RT.price                                                                      as price
        FROM ReservationTB RVT
                 inner join RoomTB RT on RVT.roomIdx = RT.idx
        where (6371 * acos(cos(radians(?)) * cos(radians(RT.regionLatitue)) *
                           cos(radians(RT.regionLongitude)
                               - radians(?)) + sin(radians(?)) *
                                               sin(radians(RT.regionLatitue)))) < 10
          and IFNULL(RT.idx NOT IN (select roomIdx
                        from ReservationTB
                        where startDate < ?
                          and endDate > ? group by roomIdx), 1 = 1)
          and RT.status = 'Y';
    `;

    const selectRoomsToDateResult = await connection.query(
        selectRoomsToDateQuery,
        selectRoomsInfoParams
    );

    return selectRoomsToDateResult[0];
}

async function selectRoomsToGuest(connection, selectRoomsInfoParams) {
    const selectRoomsToGuestQuery = `
        SELECT RT.idx
             , IF((SELECT COUNT(*)
                   FROM ReservationTB
                   WHERE roomIdx = RT.idx
                     AND status = 'Y'
                     AND (endDate > NOW() and endDate < DATE_ADD(NOW(), INTERVAL 1 MONTH))) > 20, '예약이 금방 마감되는 숙소',
                  '')                                                                                        as bookQuickly
             , IFNULL((SELECT LRT.status FROM LikeRoomTB LRT where LRT.userIdx = ? and RT.idx = LRT.roomIdx), '')     as likeStatus
             , IFNULL((SELECT imageUrl FROM RoomImageTB RIT WHERE RIT.roomIdx = RT.idx group by RT.idx), '') as imageUrl
             , IFNULL((SELECT ROUND(AVG((RRT.accuracyGrade + RRT.checkinGrade + RRT.cleanlinessGrade + RRT.locationGrade +
                                         RRT.communicationGrade +
                                         RRT.priceSatisfactionGrade) / 6), 2) 
                       FROM RoomReviewTB RRT
                       where RRT.roomIdx = RT.idx), '아직 후기 없음')                                      as reviewGrade
             , (SELECT COUNT(*)
                FROM RoomReviewTB RRT
                where RRT.roomIdx = RT.idx)                                                  as reviewCount
             , RT.titleSummary
             , RT.city
             , RT.state
             , RT.title
             , RT.regionLatitue
             , RT.regionLongitude
             , RT.price                                                                      as price
        FROM RoomTB RT
        WHERE (6371 * acos(cos(radians(?)) * cos(radians(RT.regionLatitue)) *
                           cos(radians(RT.regionLongitude)
                               - radians(?)) + sin(radians(?)) *
                                               sin(radians(RT.regionLatitue)))) < 10
          AND RT.maxPeople >= ?
          and RT.status = 'Y';
    `;

    const selectRoomsToGuestResult = await connection.query(
        selectRoomsToGuestQuery,
        selectRoomsInfoParams
    );

    return selectRoomsToGuestResult[0];
}

async function selectRoomsToDateGuest(connection, selectRoomsInfoParams) { //userIdx, Lat, Long, Lat, maxPeople, userIdx, Lat, Long, Lat, endDate, startDate, maxPeople
    const selectRoomsToDateGuestQuery = `
        SELECT RT.idx
             , IF((SELECT COUNT(*)
                   FROM ReservationTB
                   WHERE roomIdx = RT.idx
                     AND status = 'Y'
                     AND (endDate > NOW() and endDate < DATE_ADD(NOW(), INTERVAL 1 MONTH))) > 20, '예약이 금방 마감되는 숙소',
                  '')                                                                                        as bookQuickly
             , IFNULL((SELECT LRT.status FROM LikeRoomTB LRT where LRT.userIdx = ? and RT.idx = LRT.roomIdx), '')     as likeStatus
             , IFNULL((SELECT imageUrl FROM RoomImageTB RIT WHERE RIT.roomIdx = RT.idx group by RT.idx), '') as imageUrl
             , IFNULL((SELECT ROUND(AVG((RRT.accuracyGrade + RRT.checkinGrade + RRT.cleanlinessGrade + RRT.locationGrade +
                                         RRT.communicationGrade +
                                         RRT.priceSatisfactionGrade) / 6), 2)
                       FROM RoomReviewTB RRT
                       where RRT.roomIdx = RT.idx), '아직 후기 없음')                                      as reviewGrade
             , (SELECT COUNT(*)
                FROM RoomReviewTB RRT
                where RRT.roomIdx = RT.idx)                                                  as reviewCount
             , RT.titleSummary
             , RT.city
             , RT.state
             , RT.title
             , RT.regionLatitue
             , RT.regionLongitude
             , RT.price                                                                      as price
        FROM RoomTB RT
                 left join ReservationTB RVT on RT.idx = RVT.roomIdx
        WHERE RVT.roomIdx is null
          AND 6371 * acos(cos(radians(?)) * cos(radians(RT.regionLatitue)) *
                          cos(radians(RT.regionLongitude)
                              - radians(?)) + sin(radians(?)) *
                                              sin(radians(RT.regionLatitue))) < 10
          and RT.maxPeople >= ?
          and RT.status = 'Y'
        UNION
        SELECT RT.idx
             , IF((SELECT COUNT(*)
                   FROM ReservationTB
                   WHERE roomIdx = RT.idx
                     AND status = 'Y'
                     AND (endDate > NOW() and endDate < DATE_ADD(NOW(), INTERVAL 1 MONTH))) > 20, '예약이 금방 마감되는 숙소',
                  '')                                                                                        as bookQuickly
             , IFNULL((SELECT LRT.status FROM LikeRoomTB LRT where LRT.userIdx = ? and RT.idx = LRT.roomIdx), '')     as likeStatus
             , IFNULL((SELECT imageUrl FROM RoomImageTB RIT WHERE RIT.roomIdx = RT.idx group by RT.idx), '') as imageUrl
             , IFNULL((SELECT ROUND(AVG((RRT.accuracyGrade + RRT.checkinGrade + RRT.cleanlinessGrade + RRT.locationGrade +
                                         RRT.communicationGrade +
                                         RRT.priceSatisfactionGrade) / 6), 2) as grade
                       FROM RoomReviewTB RRT
                       where RRT.roomIdx = RT.idx), '아직 후기 없음')                                      as reviewGrade
             , (SELECT COUNT(*)
                FROM RoomReviewTB RRT
                where RRT.roomIdx = RT.idx)                                                  as reviewCount
             , RT.titleSummary
             , RT.city
             , RT.state
             , RT.title
             , RT.regionLatitue
             , RT.regionLongitude
             , RT.price                                                                      as price
        FROM ReservationTB RVT
                 inner join RoomTB RT on RVT.roomIdx = RT.idx
        where (6371 * acos(cos(radians(?)) * cos(radians(RT.regionLatitue)) *
                           cos(radians(RT.regionLongitude)
                               - radians(?)) + sin(radians(?)) *
                                               sin(radians(RT.regionLatitue)))) < 10
          and IFNULL(RT.idx NOT IN (select roomIdx
                        from ReservationTB
                        where startDate < ?
                          and endDate > ? group by roomIdx), 1 = 1)
          and RT.maxPeople >= ?
          and RT.status = 'Y';
    `;

    const selectRoomsToDateGuestResult = await connection.query(
        selectRoomsToDateGuestQuery,
        selectRoomsInfoParams
    );

    return selectRoomsToDateGuestResult[0];
}

// 숙소 상세 조회 API
//client
async function selectRoomInfo(connection, roomIdx) {
    const selectRoomInfoQuery = `
        SELECT
            IFNULL((SELECT imageUrl FROM RoomImageTB RIT WHERE RIT.roomIdx = RT.idx group by RT.idx), '') as imageUrl
             , RT.title
             , IFNULL((SELECT ROUND(AVG((RRT.accuracyGrade + RRT.checkinGrade + RRT.cleanlinessGrade + RRT.locationGrade +
                                         RRT.communicationGrade +
                                         RRT.priceSatisfactionGrade) / 6), 2)
                       FROM RoomReviewTB RRT
                       where RRT.roomIdx = RT.idx),
                      '')                                    as reviewGrade
             , (SELECT COUNT(*)
                FROM RoomReviewTB RRT
                where RRT.roomIdx = RT.idx)                  as reviewCount
             , RT.city                                       as city
             , RT.state                                      as state
             , RT.locationName                               as locationName
             , RT.titleSummary                               as titleSummary
             , UT.name                                       as hostName
             , RT.maxPeople
             , RT.bedroomNum
             , RT.bedNum
             , RT.bathroomNum
             , RT.contents
             , RT.regionLatitue
             , RT.regionLongitude
             , RT.locationExplanation
             , RT.price
        FROM RoomTB RT
                 INNER JOIN UserTB UT ON UT.idx = RT.userIdx
        WHERE RT.status = 'Y'
          AND RT.idx = ?;
    `;

    const selectRoomInfoResult = await connection.query(
        selectRoomInfoQuery,
        roomIdx
    );

    return selectRoomInfoResult[0];
}

async function selectRoomContents(connection, roomIdx, userIdx) {
    const selectRoomContentsQuery = `
        SELECT RT.idx                                        as roomIdx
             , IFNULL((select LRT.status from LikeRoomTB LRT where LRT.userIdx = ? and LRT.roomIdx = RT.idx),
                      'N')                                   as userLikeStatus
             , RT.title
             , IFNULL((SELECT ROUND(AVG((RRT.accuracyGrade + RRT.checkinGrade + RRT.cleanlinessGrade + RRT.locationGrade +
                                         RRT.communicationGrade +
                                         RRT.priceSatisfactionGrade) / 6), 2)
                       FROM RoomReviewTB RRT
                       where RRT.roomIdx = RT.idx),
                      '')                                    as reviewGrade
             , (SELECT COUNT(*)
                FROM RoomReviewTB RRT
                where RRT.roomIdx = RT.idx)                  as reviewCount
             , RT.city                                       as city
             , RT.state                                      as state
             , RT.locationName                               as locationName
             , IF((SELECT COUNT(*)
                   FROM ReservationTB
                   WHERE roomIdx = RT.idx
                     AND status = 'Y'
                     AND (endDate > NOW() and endDate < DATE_ADD(NOW(), INTERVAL 1 MONTH))) > 25, '흔치 않은 기회입니다.',
                  '')                                        as bookQuickly
             , RT.titleSummary                               as titleSummary
             , UT.idx                                        as hostUserIdx
             , UT.name                                       as hostName
             , date_format(UT.createdAt, '%Y년 %m월')          as hostCreatedAt
             , IF(UT.hostStatus = 'Y', UT.hostStatus, 'N')   as superHostStatus
             , IFNULL((select BT.badgeName
                       from UserBadgeTB UBT
                                inner join BadgeTB BT on UBT.badgeIdx = BT.idx
                       where UBT.userIdx = UT.idx
                         and UBT.badgeIdx = 1), '')          as selfAuth
             , (select count(*)
                from HostReviewTB
                WHERE reviewedUserIdx = UT.idx
                  AND status = 'Y')                          as hostReviewCount
             , IFNULL(UT.introduce, '')                      as hostIntroduce
             , IFNULL(UT.language, '')                       as hostLanguage
             , RT.maxPeople
             , RT.bedroomNum
             , RT.bedNum
             , RT.bathroomNum
             , RT.contents
             , RT.regionLatitue
             , RT.regionLongitude
             , RT.locationExplanation
             , RT.roomRule
             , RT.price
             , date_format(RT.toCheckinTime, '%I시 %i분 %p')   as toCheckinTime
             , date_format(RT.fromCheckinTime, '%I시 %i분 %p') as fromCheckinTime
             , date_format(RT.checkoutTime, '%I시 %i분 %p')    as checkoutTime
        FROM RoomTB RT
                 INNER JOIN UserTB UT ON UT.idx = RT.userIdx
        WHERE RT.status = 'Y'
          AND RT.idx = ?;
    `;

    const selectRoomContentsResult = await connection.query(
      selectRoomContentsQuery,
      [userIdx, roomIdx]
    );

    return selectRoomContentsResult[0];
}

async function selectRoomImages(connection, roomIdx) {
    const selectRoomImagesQuery = `
        select idx as imageIdx, imageUrl
        from RoomImageTB
        where roomIdx = ?;
    `;

    const selectRoomImagesResult = await connection.query(
        selectRoomImagesQuery,
        roomIdx
    );

    return selectRoomImagesResult[0];
}

async function selectRoomFacilities(connection, roomIdx) {
    const selectRoomFacilitiesQuery = `
        SELECT FT.facilitiyName
        FROM RoomFacilitiesTB RFT
                 INNER JOIN FacilitiesTB FT on RFT.facilitiyIdx = FT.idx
        WHERE RFT.roomIdx = ?
          AND RFT.status = 'Y';
    `;

    const selectRoomFacilitiesResult = await connection.query(
        selectRoomFacilitiesQuery,
        roomIdx
    );

    return selectRoomFacilitiesResult[0];
}

async function selectRoomBadges(connection, roomIdx) {
    const selectRoomBadgesQuery = `
        SELECT BT.badgeName
             , BT.badgeContents
        FROM RoomBadgeTB RBT
                 INNER JOIN BadgeTB BT on RBT.badgeIdx = BT.idx
        WHERE roomIdx = ?
        AND RBT.status = 'Y';
    `;

    const selectRoomBadgesResult = await connection.query(
        selectRoomBadgesQuery,
        roomIdx
    );

    return selectRoomBadgesResult[0];
}

async function selectRoomReviews(connection, roomIdx) {
    const selectRoomReviewsQuery = `
        SELECT IFNULL(UT.profileImage, '') as userProfileImage,
               case
                   when TIMESTAMPDIFF(second, RRT.createdAt, current_timestamp()) < 60
                       then concat(TIMESTAMPDIFF(second, RRT.createdAt, current_timestamp()), '초 전')
                   when TIMESTAMPDIFF(minute, RRT.createdAt, current_timestamp()) < 60
                       then concat(TIMESTAMPDIFF(minute, RRT.createdAt, current_timestamp()), '분 전')
                   when TIMESTAMPDIFF(hour, RRT.createdAt, current_timestamp()) < 24
                       then concat(TIMESTAMPDIFF(hour, RRT.createdAt, current_timestamp()), '시간 전')
                   when TIMESTAMPDIFF(day, RRT.createdAt, current_timestamp()) < 7
                       then concat(TIMESTAMPDIFF(day, RRT.createdAt, current_timestamp()), '일 전')
                   when TIMESTAMPDIFF(week, RRT.createdAt, current_timestamp()) < 4
                       then concat(TIMESTAMPDIFF(week, RRT.createdAt, current_timestamp()), '주 전')
                   when TIMESTAMPDIFF(month, RRT.createdAt, current_timestamp()) < 12
                       then concat(TIMESTAMPDIFF(month, RRT.createdAt, current_timestamp()), '달 전')
                   else concat(TIMESTAMPDIFF(year, RRT.createdAt, current_timestamp()), '년 전')
                   end                     as createAt,
               UT.name as userName,
               RRT.contents
        FROM RoomReviewTB RRT
                 INNER JOIN UserTB UT on RRT.userIdx = UT.idx
        WHERE RRT.roomIdx = ?
          AND RRT.status = 'Y'
            LIMIT 20;
    `;

    const selectRoomReviewsResult = await connection.query(
        selectRoomReviewsQuery,
        roomIdx
    );

    return selectRoomReviewsResult[0];
}

//숙소 리뷰 상세 조회 API
async function selectReviewGradeAll(connection, roomIdx) {
    const selectReviewGradeAllQuery = `
        SELECT ROUND(AVG((accuracyGrade + checkinGrade + cleanlinessGrade + locationGrade +
                          communicationGrade +
                          priceSatisfactionGrade) / 6), 2) as reviewGrade
             , COUNT(*)                                    as reviewCount
             , ROUND(AVG(accuracyGrade), 2)                as accuracyGrade
             , ROUND(AVG(communicationGrade), 2)           as communicationGrade
             , ROUND(AVG(checkinGrade), 2)                 as checkinGrade
             , ROUND(AVG(cleanlinessGrade), 2)             as cleanlinessGrade
             , ROUND(AVG(locationGrade), 2)                as locationGrade
             , ROUND(AVG(priceSatisfactionGrade), 2)       as priceSatisfactionGrade
        FROM RoomReviewTB
        WHERE roomIdx = ?
        AND status = 'Y';
    `;

    const selectReviewGradeAllResult = await connection.query(
        selectReviewGradeAllQuery,
        roomIdx
    );

    return selectReviewGradeAllResult[0];
}

async function selectRoomReviewsAll(connection, roomIdx) {
    const selectReviewGradeAllQuery = `
        SELECT IFNULL(UT.profileImage, '')           as profileImage
             , date_format(RRT.createdAt, '%Y년 %m월') as createdAt
             , UT.name
             , RRT.contents
        FROM RoomReviewTB RRT
                 INNER JOIN UserTB UT on RRT.userIdx = UT.idx
        WHERE RRT.roomIdx = ?
          AND RRT.status = 'Y';
    `;

    const selectReviewGradeAllResult = await connection.query(
        selectReviewGradeAllQuery,
        roomIdx
    );

    return selectReviewGradeAllResult[0];
}

// 숙소 예약 현황 조회 API
async function selectRoomReservation(connection, roomIdx) {
    const selectRoomReservationQuery = `
        SELECT idx                                as reservatioinIdx
             , date_format(startDate, '%Y-%m-%d') as startDate
             , date_format(endDate, '%Y-%m-%d')   as endDate
        FROM ReservationTB
        WHERE roomIdx = ?
          AND status = 'Y'
          AND startDate > NOW();
    `;

    const selectRoomReservationResult = await connection.query(
        selectRoomReservationQuery,
        roomIdx
    );

    return selectRoomReservationResult[0];
}

async function selectRoomReviewGrade(connection, roomIdx) {
    const selectRoomReviewQuery = `
        SELECT IFNULL((SELECT ROUND(AVG((RRT.accuracyGrade + RRT.checkinGrade + RRT.cleanlinessGrade + RRT.locationGrade +
                                         RRT.communicationGrade +
                                         RRT.priceSatisfactionGrade) / 6), 2)
                       FROM RoomReviewTB RRT
                       where RRT.roomIdx = ?), '')      as reviewGrade
             , (SELECT COUNT(*)
                FROM RoomReviewTB RRT
                where RRT.roomIdx = ?)                  as reviewCount
             , (select price from RoomTB where idx = ?) as price
        FROM RoomReviewTB RRT
        WHERE RRT.roomIdx = ?
          AND RRT.status = 'Y'
        group by RRT.roomIdx;
    `;

    const selectRoomReviewResult = await connection.query(
        selectRoomReviewQuery,
        [roomIdx, roomIdx, roomIdx, roomIdx]
    );

    return selectRoomReviewResult[0];
}

async function selectRoomReservationInfo(connection, roomIdx, userIdx) {
    const selectRoomReservationInfoQuery = `
        SELECT RT.idx                                                                         as roomIdx
             , IF((SELECT COUNT(*)
                   FROM ReservationTB
                   WHERE roomIdx = RT.idx
                     AND status = 'Y'
                     AND (endDate > NOW() and endDate < DATE_ADD(NOW(), INTERVAL 1 MONTH))) > 25, '흔치 않은 기회입니다.',
                  '')                                                                         as bookQuickly
             , IFNULL((SELECT RIT.imageUrl FROM RoomImageTB RIT WHERE RIT.roomIdx = RT.idx group by RIT.roomIdx),
                      '')                                                                     as imageUrl
             , RT.locationName
             , RT.titleSummary
             , RT.title
             , RT.bedNum
             , RT.bathroomNum
             , IFNULL((SELECT ROUND(AVG((RRT.accuracyGrade + RRT.checkinGrade + RRT.cleanlinessGrade + RRT.locationGrade +
                                         RRT.communicationGrade +
                                         RRT.priceSatisfactionGrade) / 6), 2)
                       FROM RoomReviewTB RRT
                       where RRT.roomIdx = RT.idx), '')                                       as reviewGrade
             , (SELECT COUNT(*)
                FROM RoomReviewTB RRT
                where RRT.roomIdx = RT.idx)                                                   as reviewCount
             , RT.price
             , ROUND(RT.price * 0.14)                                                         as serviceFees
             , ROUND(RT.price * 0.014)                                                        as totFees
             , RT.price + ROUND(RT.price * 0.14) + ROUND(RT.price * 0.014)                    as totalPrice
             , IFNULL((select RIGHT(CT.cardNum, 4) from mCardTB CT where CT.userIdx = ?), '') as userCardInfo
             , IFNULL((select phoneNumber from UserTB UT where UT.idx = ?), '')               as userPhoneNum
        FROM RoomTB RT
        WHERE RT.status = 'Y'
          AND RT.idx = ?;
    `

    const selectRoomReservationInfoResult = await connection.query(
        selectRoomReservationInfoQuery,
        [userIdx, userIdx, roomIdx]
    );

    return selectRoomReservationInfoResult[0];
}

async function selectHostInfo(connection, hostUserIdx) {
    const selectHostInfoQuery = `
        SELECT UT.name
             , IFNULL(UT.profileImage, '')                                                         as profileImage
             , date_format(UT.createdAt, '%Y년 가입')                                                 as createdAt
             , UT.introduce
             , UT.locationName
             , UT.language
             , UT.job
             , IF(UT.hostStatus = 'Y', UT.hostStatus, 'N')                                         as superHostStatus
             , (select count(*) from HostReviewTB WHERE reviewedUserIdx = UT.idx AND status = 'Y') as hostReviewCount
        FROM UserTB UT
        WHERE UT.idx = ?;
    `;

    const selectHostInfoResult = await connection.query(
        selectHostInfoQuery,
        hostUserIdx
    );

    return selectHostInfoResult[0];
}

async function selectHostRooms(connection, userIdx, hostUserIdx) {
    const selectHostRoomsQuery = `
        SELECT RT.idx                                                                     as roomIdx
             , RT.title
             , IFNULL((select LRT.status from LikeRoomTB LRT where LRT.userIdx = ? and LRT.roomIdx = RT.idx), 'N') as userLikeStatus
             , IFNULL((SELECT ROUND(AVG((RRT.accuracyGrade + RRT.checkinGrade + RRT.cleanlinessGrade + RRT.locationGrade +
                                         RRT.communicationGrade +
                                         RRT.priceSatisfactionGrade) / 6), 2)
                       FROM RoomReviewTB RRT
                       where RRT.roomIdx = RT.idx), '')                                   as reviewGrade
             , (SELECT COUNT(*)
                FROM RoomReviewTB RRT
                where RRT.roomIdx = RT.idx)                                               as reviewCount
        FROM RoomTB RT
        WHERE RT.userIdx = ?
          AND RT.status = 'Y';
    `;

    const selectHostRoomsResult = await connection.query(
        selectHostRoomsQuery,
        [userIdx, hostUserIdx]
    );

    return selectHostRoomsResult[0];
}

async function selectHostReviews(connection, hostUserIdx) {
    const selectHostReviewsQuery = `
        SELECT HRT.idx                                                                                         as hostReviewIdx
             , date_format(HRT.createdAt, '%Y년 %m월')                                                           as reviewCreatedAt
             , HRT.contents
             , IFNULL((select profileImage from UserTB where idx = HRT.reviewUserIdx), '')                     as userProfile
             , (select name from UserTB where idx = HRT.reviewUserIdx)                                         as userName
             , date_format((select UT.createdAt from UserTB UT where UT.idx = HRT.reviewUserIdx), '회원 가입:%Y년') as userCreatedAt
        FROM HostReviewTB HRT
        WHERE HRT.reviewedUserIdx = ?
          AND HRT.status = 'Y';
    `;

    const selectHostReviewsResult = await connection.query(
        selectHostReviewsQuery,
        hostUserIdx
    );

    return selectHostReviewsResult[0];
}

// insert, update
async function insertReservation(connection, insertReservationInfoParams) {
    const insertReservationQuery = `
        INSERT INTO ReservationTB
        (status, roomIdx, startDate, endDate,
         adultGuestNum, childGuestNum, infantGuestNum,
         businessStatus, paymentStatus, userIdx, paymentPrice)
        VALUES ('A', ?, ?, ?,
                ?, ?, ?,
                ?, ?, ?, ?);
    `;

    const insertReservationResult = await connection.query(
        insertReservationQuery,
        insertReservationInfoParams
    );

    return insertReservationResult;
}

async function insertRoomWishListsToPeople(connection, insertRoomWishListsInfoParams) {
    const insertRoomWishListsToPeopleQuery = `
        INSERT INTO WishListTB
        (status, wishName, adultGuestNum, childGuestNum, infantGuestNum, userIdx)
        VALUES ('Y', ?, ?, ?, ?, ?);
    `;

    const insertRoomWishListsToPeopleResult = await connection.query(
        insertRoomWishListsToPeopleQuery,
        insertRoomWishListsInfoParams
    );

    return insertRoomWishListsToPeopleResult;
}

async function insertRoomWishListsToDate(connection, insertRoomWishListsInfoParams) {
    const insertRoomWishListsToDateQuery = `
        INSERT INTO WishListTB
        (status, wishName, startDate, endDate, userIdx)
        VALUES ('Y', ?, ?, ?, ?);
    `;

    const insertRoomWishListsToDateResult = await connection.query(
        insertRoomWishListsToDateQuery,
        insertRoomWishListsInfoParams
    );

    return insertRoomWishListsToDateResult;
}

async function insertRoomWishListsToWishName(connection, insertRoomWishListsInfoParams) {
    const insertRoomWishListsToWishNameQuery = `
        INSERT INTO WishListTB
        (status, wishName, userIdx)
        VALUES ('Y', ?, ?);
    `;

    const insertRoomWishListsToWishNameResult = await connection.query(
        insertRoomWishListsToWishNameQuery,
        insertRoomWishListsInfoParams
    );

    return insertRoomWishListsToWishNameResult;
}

async function insertRoomWishLists(connection, insertRoomWishListsInfoParams) {
    const insertRoomWishListsQuery = `
        INSERT INTO WishListTB
        (status, wishName, startDate, endDate,
         adultGuestNum, childGuestNum, infantGuestNum, userIdx)
        VALUES
        ('Y', ?, ? ,?,
         ?, ?, ?, ?);
    `;

    const insertRoomWishListsResult = await connection.query(
        insertRoomWishListsQuery,
        insertRoomWishListsInfoParams
    );

    return insertRoomWishListsResult;
}

async function insertRoomLike(connection, roomIdx, userIdx, wishIdx) {
    const insertRoomLikeQuery = `
        INSERT INTO LikeRoomTB(status, roomIdx, userIdx, wishIdx)
        VALUES ('Y', ?, ?, ?);
    `;

    const insertRoomLikeResult = await connection.query(
        insertRoomLikeQuery,
        [roomIdx, userIdx, wishIdx]
    );

    return insertRoomLikeResult;
}

async function insertReports(connection, reportIdx, roomIdx, userIdx) {
    const insertReportsQuery = `
        INSERT INTO RoomReportTB(status, reportIdx, roomIdx, userIdx)
        VALUES ('Y', ?, ?, ?);
    `;

    const insertReportsResult = await connection.query(
        insertReportsQuery,
        [reportIdx, roomIdx, userIdx]
    );

    return insertReportsResult;
}

async function insertUserReviews(connection, insertInfo) {
    const insertUserReviewsQuery = `
        INSERT INTO RoomReviewTB(status, contents, userIdx, roomIdx,
                                 accuracyGrade, communicationGrade, checkinGrade,
                                 cleanlinessGrade, locationGrade, priceSatisfactionGrade)
        VALUES ('Y', ?, ?, ?,
                ?, ?, ?,
                ?, ?, ?);
    `;

    const insertUserReviewsResult = await connection.query(
        insertUserReviewsQuery,
        insertInfo
    );

    return insertUserReviewsResult;
}

async function insertHostReviews(connection, contents, userIdx, hostUserIdx) {
    const insertHostReviewsQuery = `
        INSERT INTO HostReviewTB(status, contents, reviewUserIdx, reviewedUserIdx)
        VALUES ('Y', ?, ?, ?);
    `;

    const insertHostReviewsResult = await connection.query(
        insertHostReviewsQuery,
        [contents, userIdx, hostUserIdx]
    );

    return insertHostReviewsResult;
}

async function updateRoomLike(connection, status, roomIdx, userIdx, wishIdx) {
    const updateRoomLikeQuery = `
        UPDATE LikeRoomTB
        SET status = ?, wishIdx = ?
        WHERE roomIdx = ?
          AND userIdx = ?;
    `;

    const updateRoomLikeResult = await connection.query(
        updateRoomLikeQuery,
        [status, wishIdx, roomIdx, userIdx]
    );

    return updateRoomLikeResult;
}

async function updateRoomReservation(connection, reservationIdx) {
    const updateRoomReservationQuery = `
        UPDATE ReservationTB
        SET status = 'Y'
        WHERE idx = ?
    `;

    const updateRoomReservationResult = await connection.query(
        updateRoomReservationQuery,
        reservationIdx
    );

    return updateRoomReservationResult;
}

async function deleteRoomReservation(connection, reservationIdx) {
    const updateRoomReservationQuery = `
        UPDATE ReservationTB
        SET status = 'N'
        WHERE idx = ?;
    `;

    const updateRoomReservationResult = await connection.query(
        updateRoomReservationQuery,
        reservationIdx
    );

    return updateRoomReservationResult;
}

//체크 쿼리
async function checkRooms(connection, roomIdx) {
    const checkRoomsQuery = `
        select status,
               regionLatitue,
               regionLongitude,
               locationName,
               titleSummary,
               title,
               contents,
               userIdx,
               maxPeople,
               bedroomNum,
               bedNum,
               bathroomNum,
               price,
               locationExplanation
        from RoomTB where idx = ?;
    `;

    const checkRoomsResult = await connection.query(
        checkRoomsQuery,
        roomIdx
    );

    return checkRoomsResult[0];
}

async function checkRoomReservation(connection, roomIdx, startDate, endDate) {
    const checkRoomReservationQuery = `
        select *
        from ReservationTB RVT
        where roomIdx = ?
          and startDate < ?
          and endDate > ?;
    `;

    const checkRoomReservationResult = await connection.query(
        checkRoomReservationQuery,
        [roomIdx, endDate, startDate]
    );

    return checkRoomReservationResult[0];
}

async function checkWishLists(connection, wishIdx) {
    const checkWishListsQuery = `
        SELECT status,
               wishName,
               startDate,
               endDate,
               adultGuestNum,
               childGuestNum,
               infantGuestNum,
               link,
               userIdx
        FROM WishListTB
        WHERE idx = ?;
    `;

    const checkWishListsResult = await connection.query(
        checkWishListsQuery,
        wishIdx
    );

    return checkWishListsResult[0];
}

async function checkRoomLike(connection, roomIdx, userIdx, wishIdx) {
    const checkRoomLikeQuery = `
        SELECT status
             , roomIdx
             , userIdx
             , wishIdx
        FROM LikeRoomTB
        WHERE roomIdx = ?
          AND userIdx = ?
          AND wishIdx = ?;
    `;

    const checkRoomLikeResult = await connection.query(
        checkRoomLikeQuery,
        [roomIdx, userIdx, wishIdx]
    );

    return checkRoomLikeResult[0];
}

async function checkUsers(connection, userIdx) {
    const checkUsersQuery = `
        SELECT idx
             , status
             , phoneNumber
             , badgeStatus
             , hostStatus
        FROM UserTB
        WHERE idx = ?;
    `;

    const checkUsersResult = await connection.query(
        checkUsersQuery,
        userIdx
    );

    return checkUsersResult[0];
}

async function checkReservations(connection, reservationIdx) {
    const checkReservationsQuery =`
        SELECT status
             , roomIdx
             , date_format(startDate, '%Y-%m-%d') as startDate
             , date_format(endDate, '%Y-%m-%d')   as endDate
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

    const checkReservationsResult = await connection.query(
        checkReservationsQuery,
        reservationIdx
    );

    return checkReservationsResult[0];
}

async function checkUserReservations(connection, userIdx, roomIdx) {
    const checkUserReservationsQuery = `
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
        WHERE userIdx = ?
          AND roomIdx = ?
          AND status = 'Y'
          AND endDate < NOW();
    `;

    const checkUserReservationsResult = await connection.query(
        checkUserReservationsQuery,
        [userIdx, roomIdx]
    );

    return checkUserReservationsResult[0];
}

async function checkUserReviews(connection, userIdx, roomIdx) {
    const checkUserReviewsQuery = `
        SELECT status
             , contents
             , userIdx
             , roomIdx
             , accuracyGrade
             , communicationGrade
             , checkinGrade
             , cleanlinessGrade
             , locationGrade
             , priceSatisfactionGrade
        FROM RoomReviewTB
        WHERE userIdx = ?
          AND roomIdx = ?
          AND status = 'Y';
    `;

    const checkUserReviewsResult = await connection.query(
        checkUserReviewsQuery,
        [userIdx, roomIdx]
    );

    return checkUserReviewsResult[0];
}

async function checkHostReviews(connection, userIdx, hostUserIdx) {
    const checkHostReviewsQuery = `
        SELECT status
             , contents
             , reviewUserIdx
             , reviewedUserIdx
        FROM HostReviewTB
        WHERE reviewUserIdx = ?
          AND reviewedUserIdx = ?
          AND status = 'Y';
    `;

    const checkHostReviewsResult = await connection.query(
        checkHostReviewsQuery,
        [userIdx, hostUserIdx]
    )

    return checkHostReviewsResult[0];
}

async function getUserEmail(connection, userIdx) {
    const getUserEmailQuery = `
        SELECT email
        FROM UserTB
        WHERE idx = ?;
    `;

    const getUserEmailResult = await connection.query(
        getUserEmailQuery,
        userIdx
    );

    return getUserEmailResult[0];
}

module.exports = {
    selectTestRooms,
    selectRooms,
    selectRoomsToDate,
    selectRoomsToGuest,
    selectRoomsToDateGuest,
    selectRoomInfo,
    selectRoomContents,
    selectRoomImages,
    selectRoomFacilities,
    selectRoomBadges,
    selectRoomReviews,
    selectReviewGradeAll,
    selectRoomReviewsAll,
    selectRoomReservation,
    selectRoomReviewGrade,
    selectRoomReservationInfo,
    selectHostInfo,
    selectHostRooms,
    selectHostReviews,
    insertReservation,
    insertRoomWishListsToPeople,
    insertRoomWishListsToDate,
    insertRoomWishLists,
    insertRoomWishListsToWishName,
    insertRoomLike,
    insertReports,
    insertUserReviews,
    insertHostReviews,
    updateRoomLike,
    updateRoomReservation,
    deleteRoomReservation,
    checkRooms,
    checkRoomReservation,
    checkWishLists,
    checkRoomLike,
    checkUsers,
    checkReservations,
    checkUserReservations,
    checkUserReviews,
    checkHostReviews,
    getUserEmail
}
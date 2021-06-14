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
             , IFNULL((SELECT LRT.status FROM LikeRoomTB LRT where LRT.userIdx = ?), '')     as LikeStatus
             , IFNULL((SELECT imageUrl FROM RoomImageTB RIT WHERE RIT.roomIdx = RT.idx group by RT.idx), '') as imageUrl
             , IFNULL((SELECT ROUND(AVG((RRT.accuracyGrade + RRT.checkinGrade + RRT.cleanlinessGrade + RRT.locationGrade +
                                         RRT.communicationGrade +
                                         RRT.priceSatisfactionGrade) / 6), 2) as grade
                       FROM RoomReviewTB RRT
                       where RRT.roomIdx = RT.idx), '')                                      as reviewGrade
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
          and IFNULL(RT.idx != (select roomIdx
                        from ReservationTB
                        where startDate < ?
                          and endDate > ?), 1 = 1)
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

async function selectRoomsToDateGuest(connection, selectRoomsInfoParams) { //userIdx, Lat, Long, Lat, maxPeople, userIdx, Lat, Long, Lat, startDate, maxPeople
    const selectRoomsToDateGuestQuery = `
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
             , IFNULL((SELECT LRT.status FROM LikeRoomTB LRT where LRT.userIdx = ?), '')     as LikeStatus
             , IFNULL((SELECT imageUrl FROM RoomImageTB RIT WHERE RIT.roomIdx = RT.idx group by RT.idx), '') as imageUrl
             , IFNULL((SELECT ROUND(AVG((RRT.accuracyGrade + RRT.checkinGrade + RRT.cleanlinessGrade + RRT.locationGrade +
                                         RRT.communicationGrade +
                                         RRT.priceSatisfactionGrade) / 6), 2) as grade
                       FROM RoomReviewTB RRT
                       where RRT.roomIdx = RT.idx), '')                                      as reviewGrade
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
          and IFNULL(RT.idx != (select roomIdx
                        from ReservationTB
                        where startDate < ?
                          and endDate > ?), 1 = 1)
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
async function selectRoomContents(connection, roomIdx, userIdx) {
    const selectRoomContentsQuery = `
        SELECT RT.idx                                                                              as roomIdx
             , IFNULL((select LRT.status from LikeRoomTB LRT where LRT.userIdx = ?), 'N')          as userLikeStatus
             , RT.title
             , IFNULL((SELECT ROUND(AVG((RRT.accuracyGrade + RRT.checkinGrade + RRT.cleanlinessGrade + RRT.locationGrade +
                                         RRT.communicationGrade +
                                         RRT.priceSatisfactionGrade) / 6), 2)
                       FROM RoomReviewTB RRT
                       where RRT.roomIdx = RT.idx), '')                                            as reviewGrade
             , (SELECT COUNT(*)
                FROM RoomReviewTB RRT
                where RRT.roomIdx = RT.idx)                                                        as reviewCount
             , RT.city                                                                             as city
             , RT.state                                                                            as state
             , RT.locationName                                                                     as locationName
             , RT.titleSummary                                                                     as titleSummary
             , UT.idx                                                                              as hostUserIdx
             , UT.name                                                                             as hostName
             , date_format(UT.createdAt, '%Y년 %m월')                                                as hostCreatedAt
             , IF(UT.hostStatus = 'Y', UT.hostStatus, 'N')                                         as superHostStatus
             , (select count(*) from HostReviewTB WHERE reviewedUserIdx = UT.idx AND status = 'Y') as hostReviewCount
             , IFNULL(UT.introduce, '')                                                            as hostIntroduce
             , IFNULL(UT.language, '')                                                             as hostLanguage
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
             , date_format(RT.toCheckinTime, '%I시 %i분 %p')                                         as toCheckinTime
             , date_format(RT.fromCheckinTime, '%I시 %i분 %p')                                       as fromCheckinTime
             , date_format(RT.checkoutTime, '%I시 %i분 %p')                                          as checkoutTime
        FROM RoomTB RT
                 INNER JOIN UserTB UT ON UT.idx = RT.idx
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
          AND status = 'Y';
    `;

    const selectRoomReservationResult = await connection.query(
        selectRoomReservationQuery,
        roomIdx
    );

    return selectRoomReservationResult[0];
}

async function selectRoomReviewGrade(connection, roomIdx) {
    const selectRoomReviewQuery = `
        SELECT ROUND(AVG((RRT.accuracyGrade + RRT.checkinGrade + RRT.cleanlinessGrade + RRT.locationGrade +
                          RRT.communicationGrade +
                          RRT.priceSatisfactionGrade) / 6), 2) as reviewGrade
             , COUNT(*)                                        as reviewCount
             , (select price from RoomTB where idx = ?)        as price
        FROM RoomReviewTB RRT
        WHERE RRT.roomIdx = ?
          AND RRT.status = 'Y';
    `;

    const selectRoomReviewResult = await connection.query(
        selectRoomReviewQuery,
        [roomIdx, roomIdx]
    );

    return selectRoomReviewResult[0];
}

async function selectRoomReservationInfo(connection, roomIdx, userIdx) {
    const selectRoomReservationInfoQuery = `
        SELECT RT.idx
             , IFNULL((SELECT imageUrl FROM RoomImageTB RIT WHERE RIT.roomIdx = RT.idx), '') as imageUrl
             , RT.locationName
             , RT.titleSummary
             , RT.title
             , RT.bedNum
             , RT.bathroomNum
             , IFNULL((SELECT ROUND(AVG(RRT.grade), 2)
                       FROM RoomReviewTB RRT
                       where RRT.roomIdx = RT.idx), '')                                      as reviewGrade
             , (SELECT COUNT(RRT.grade)
                FROM RoomReviewTB RRT
                where RRT.roomIdx = RT.idx)                                                  as reviewCount
             , RT.price
             , IFNULL((select RIGHT(CT.cardNum, 4) from CardTB CT where CT.userIdx = ?), '') as userCardInfo
             , IFNULL((select phoneNumber from UserTB UT where UT.idx = ?), '')              as userPhoneNum
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
             , IFNULL((select LRT.status from LikeRoomTB LRT where LRT.userIdx = ?), 'N') as userLikeStatus
             , IFNULL((SELECT ROUND(AVG((RRT.accuracyGrade + RRT.checkinGrade + RRT.cleanlinessGrade + RRT.locationGrade +
                                         RRT.communicationGrade +
                                         RRT.priceSatisfactionGrade) / 6), 2)
                       FROM RoomReviewTB RRT
                       where RRT.roomIdx = RT.idx), '')                                   as reviewGrade
             , (SELECT COUNT(RRT.grade)
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

// 체험 찜 API
async function insertExpLikes(connection, userIdx, experienceIdx, wishIdx) {
    const insertExpLikesQuery = `
        INSERT INTO ExperienceLikeTB(status, experienceIdx, userIdx, wishIdx)
        VALUES ('Y', ?, ?, ?);
    `;

    const insertExpLikesResult = await connection.query(
        insertExpLikesQuery,
        [experienceIdx, userIdx, wishIdx]
    );

    return insertExpLikesResult;
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

async function updateExpLikes(connection, status, userIdx, experienceIdx, wishIdx) {
    const updateRoomLikeQuery = `
        UPDATE ExperienceLikeTB
        SET status = ?
        WHERE experienceIdx = ?
          AND userIdx = ?
          AND wishIdx = ?;
    `;

    const updateRoomLikeResult = await connection.query(
        updateRoomLikeQuery,
        [status, experienceIdx, userIdx, wishIdx]
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
async function checkExp(connection, experienceIdx) {
    const checkExpQuery = `
        SELECT status,
               price,
               title,
               country,
               region,
               userIdx,
               experienceStatus,
               programContents,
               maxNum,
               notice,
               privatePrice,
               privateMaxNum,
               experienceTime,
               regionLatitue,
               regionLongitude
        FROM ExperienceTB
        WHERE idx = ?
          AND status = 'Y';
    `;

    const checkExpResult = await connection.query(
        checkExpQuery,
        experienceIdx
    );

    return checkExpResult[0];
}

async function checkRoomReservation(connection, roomIdx, startDate, endDate) {
    const checkRoomReservationQuery = `
        select *
        from ReservationTB RVT
        where roomIdx = ?
          and startDate between ? and DATE_SUB(?, INTERVAL 1 DAY);
    `;

    const checkRoomReservationResult = await connection.query(
        checkRoomReservationQuery,
        [roomIdx, startDate, endDate]
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

async function checkExpLikes(connection, userIdx, experienceIdx, wishIdx) {
    const checkRoomLikeQuery = `
        SELECT status
             , experienceIdx
             , userIdx
             , wishIdx
        FROM ExperienceLikeTB
        WHERE userIdx = ?
          AND experienceIdx = ?
          AND wishIdx = ?;
    `;

    const checkRoomLikeResult = await connection.query(
        checkRoomLikeQuery,
        [userIdx, experienceIdx, wishIdx]
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

module.exports = {
    selectTestRooms,
    selectRooms,
    selectRoomsToDate,
    selectRoomsToGuest,
    selectRoomsToDateGuest,
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
    insertExpLikes,
    insertReports,
    insertUserReviews,
    insertHostReviews,
    updateExpLikes,
    updateRoomReservation,
    deleteRoomReservation,
    checkExp,
    checkExpLikes,
    checkRoomReservation,
    checkWishLists,
    checkUsers,
    checkReservations,
    checkUserReservations,
    checkUserReviews,
    checkHostReviews
}
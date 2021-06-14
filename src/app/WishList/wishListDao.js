//select
async function selectWishLists(connection, userIdx) {
    const selectWishListsQuery = `
        SELECT WLT.idx                                           as idx
             , WLT.wishName
             , IFNULL(date_format(WLT.startDate, '%m월 %d일'), '') as startDate
             , IFNULL(date_format(WLT.endDate, '%m월 %d일'), '')   as endDate
             , WLT.adultGuestNum
             , WLT.childGuestNum
             , WLT.infantGuestNum
        FROM WishListTB WLT
        WHERE WLT.userIdx = ?
          AND WLT.status = 'Y';
    `;

    const selectWishListsResult = await connection.query(
        selectWishListsQuery,
        userIdx
    );

    return selectWishListsResult[0];
}

async function selectWishListImages(connection, userIdx) {
    const selectWishListImagesQuery = `
        SELECT RIT.imageUrl
             , WLT.idx as wishIdx
        FROM WishListTB WLT
                 LEFT JOIN LikeRoomTB LRT on WLT.idx = LRT.wishIdx
                 LEFT JOIN RoomImageTB RIT on LRT.roomIdx = RIT.roomIdx
        WHERE WLT.userIdx = ?
          AND LRT.status = 'Y'
          AND WLT.status = 'Y'
        ORDER BY WLT.idx;
    `;

    const selectWishListImagesResult = await connection.query(
        selectWishListImagesQuery,
        userIdx
    );

    return selectWishListImagesResult[0];
}

async function selectWishMember(connection, wishIdx) {
    const selectWishMemberQuery = `
        SELECT WMT.userIdx
             , IFNULL(UT.profileImage, '') as memberImage
             , UT.name                     as memberName
        FROM WishMemberTB WMT
                 INNER JOIN UserTB UT on WMT.userIdx = UT.idx
        where WMT.wishIdx = ?
          AND WMT.status = 'Y';
    `;

    const selectWishMemberResult = await connection.query(
        selectWishMemberQuery,
        wishIdx
    );

    return selectWishMemberResult[0];
}

async function selectWishListContents(connection, wishIdx) {
    const selectWishListContentsQuery = `
        SELECT IFNULL(UT.profileImage, '')           as userProfileImage
             , WLT.wishName
             , date_format(WLT.startDate, '%m월 %d일') as startDate
             , date_format(WLT.endDate, '%m월 %d일')   as endDate
             , WLT.adultGuestNum
             , WLT.childGuestNum
             , WLT.infantGuestNum
        FROM WishListTB WLT
                 INNER JOIN UserTB UT on WLT.userIdx = UT.idx
        WHERE WLT.idx = ?
          AND WLT.status = 'Y';
    `;

    const selectWishListContentsResult = await connection.query(
        selectWishListContentsQuery,
        wishIdx
    );

    return selectWishListContentsResult[0];
}

async function selectLikeRoom(connection, wishIdx) {
    const selectLikeRoomQuery = `
        SELECT LRT.status                                                                                    as likeStatus
             , RT.idx                                                                                        as roomIdx
             , RT.regionLatitue
             , RT.regionLongitude

             , IFNULL((SELECT imageUrl FROM RoomImageTB RIT WHERE RIT.roomIdx = RT.idx group by RT.idx), '') as imageUrl
             , IFNULL((SELECT ROUND(AVG((RRT.accuracyGrade + RRT.checkinGrade + RRT.cleanlinessGrade + RRT.locationGrade +
                                         RRT.communicationGrade +
                                         RRT.priceSatisfactionGrade) / 6), 2)
                       FROM RoomReviewTB RRT
                       where RRT.roomIdx = RT.idx), '')                                                      as reviewGrade
             , (SELECT COUNT(*)
                FROM RoomReviewTB RRT
                where RRT.roomIdx = RT.idx)                                                                  as reviewCount
             , RT.titleSummary
             , RT.bedNum
             , RT.title
             , RT.price
        FROM LikeRoomTB LRT
                 INNER JOIN RoomTB RT on LRT.roomIdx = RT.idx
        WHERE LRT.wishIdx = ?
          AND LRT.status = 'Y';
    `;

    const selectLikeRoomResult = await connection.query(
        selectLikeRoomQuery,
        wishIdx
    );

    return selectLikeRoomResult[0];
}

async function selectCheckReservationStatus(connection, wishIdx) {
    const selectCheckReservationStatusQuery = `
        SELECT LRT.roomIdx
        FROM LikeRoomTB LRT
                 INNER JOIN WishListTB WLT on LRT.wishIdx = WLT.idx
        WHERE LRT.wishIdx = ?
          AND LRT.status = 'Y'
          AND (IFNULL(LRT.roomIdx IN (select RSVT.roomIdx
                                      from ReservationTB RSVT
                                      where RSVT.startDate < WLT.endDate
                                        and RSVT.endDate > WLT.startDate
                                      group by RSVT.roomIdx), 1 = 1)
            OR WLT.adultGuestNum + WLT.childGuestNum > (select maxPeople from RoomTB where idx = LRT.roomIdx))
          AND WLT.status = 'Y';
    `;

    const selectCheckReservationStatusResult = await connection.query(
        selectCheckReservationStatusQuery,
        wishIdx
    );

    return selectCheckReservationStatusResult[0];
}

async function selectWishListSets(connection, wishIdx) {
    const selectWishListSetsQuery = `
        SELECT wishName
             , seeListStatus
             , IFNULL(UT.profileImage, '') as userImage
             , UT.name                     as wishOwnerName
        FROM WishListTB WLT
                 INNER JOIN UserTB UT on WLT.userIdx = UT.idx
        WHERE WLT.idx = ?
          AND WLT.status = 'Y';
    `;

    const selectWishListSetsResult = await connection.query(
        selectWishListSetsQuery,
        wishIdx
    );

    return selectWishListSetsResult[0];
}

//insert, update
async function updateWishListSet(connection, wishSetInfo) {
    const updateWishListSetQuery = `
        UPDATE WishListTB
        SET wishName = ?,seeListStatus = ?
        WHERE userIdx = ? AND idx = ?;
    `

    const updateWishListSetResult = await connection.query(
        updateWishListSetQuery,
        wishSetInfo
    );

    return updateWishListSetResult;
}

async function updateWishListStatus(connection, userIdx, wishIdx) {
    const updateWishListStatusQuery = `
        UPDATE WishListTB
        SET status = 'N'
        WHERE idx = ?
          AND userIdx = ?;
    `;

    const updateWishListStatusResult = await connection.query(
        updateWishListStatusQuery,
        [wishIdx, userIdx]
    );

    return updateWishListStatusResult;
}

async function updateWishListMemberStatus(connection, wishIdx) {
    const updateWishListMemberStatusQuery = `
        UPDATE WishMemberTB
        SET status = 'N'
        WHERE wishIdx = ?;
    `;

    const updateWishListMemberStatusResult = await connection.query(
        updateWishListMemberStatusQuery,
        wishIdx
    );

    return updateWishListMemberStatusResult;
}

async function updateRoomLikesStatus(connection, wishIdx) {
    const updateRoomLikesStatusQuery = `
        UPDATE LikeRoomTB
        SET status = 'N'
        WHERE wishIdx = ?;
    `;

    const updateRoomLikesStatusResult = await connection.query(
        updateRoomLikesStatusQuery,
        wishIdx
    );

    return updateRoomLikesStatusResult;
}

async function updateWishDates(connection, userIdx, wishIdx, startDate, endDate) {
    const updateWishDatesQuery = `
        UPDATE WishListTB
        SET startDate = ?,
            endDate   = ?
        WHERE idx = ?
          AND userIdx = ?;
    `;

    const updateWishDatesResult = await connection.query(
        updateWishDatesQuery,
        [startDate, endDate, wishIdx, userIdx]
    );

    return updateWishDatesResult;
}

async function updateWishPerson(connection, wishPersonInfo) {
    const updateWishPersonQuery = `
        UPDATE WishListTB
        SET adultGuestNum  = ?,
            childGuestNum  = ?,
            infantGuestNum = ?
        WHERE userIdx = ?
          AND idx = ?;
    `;

    const updateWishPersonResult = await connection.query(
        updateWishPersonQuery,
        wishPersonInfo
    );

    return updateWishPersonResult;
}

//check
async function checkWishList(connection, wishIdx) {
    const checkWishListQuery = `
        SELECT status
             , wishName
             , date_format(startDate, '%Y-%m-%d') as startDate
             , date_format(endDate, '%Y-%m-%d')   as endDate
             , adultGuestNum
             , childGuestNum
             , infantGuestNum
             , link
             , userIdx
             , seeListStatus
        FROM WishListTB
        WHERE idx = ?;
    `;

    const checkWishListResult = await connection.query(
        checkWishListQuery,
        wishIdx
    );

    return checkWishListResult[0];
}

async function checkWishMember(connection, wishIdx) {
    const checkWishMemberQuery = `
        SELECT status
             , wishIdx
             , userIdx
        FROM WishMemberTB
        WHERE wishIdx = ?
          AND status = 'Y';
    `;

    const checkWishMemberResult = await connection.query(
        checkWishMemberQuery,
        wishIdx
    );

    return checkWishMemberResult[0];
}

module.exports = {
    selectWishLists,
    selectWishListImages,
    selectWishMember,
    selectWishListContents,
    selectLikeRoom,
    selectCheckReservationStatus,
    selectWishListSets,
    updateWishListSet,
    updateWishListStatus,
    updateWishListMemberStatus,
    updateRoomLikesStatus,
    updateWishDates,
    updateWishPerson,
    checkWishList,
    checkWishMember
}
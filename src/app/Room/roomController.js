const jwtMiddleware = require("../../../config/jwtMiddleware");
const roomProvider = require("../../app/Room/roomProvider");
const roomService = require("../../app/Room/roomService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const geoCoder = require("../../../config/googleMap");
const DateFormatResult = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/; //status 정규식
const {transporter} = require('../../../config/resEmail');
/**
 * API No. 0
 * API Name : TEST API
 * [GET] /app/tests
 **/
exports.getTests = async function (req, res) {
    const email = req.body.email;

    const info = await transporter.sendMail({
        from: `"Airbnb clone" <${process.env.NODEMAILER_USER}>`,
        // 받는 곳의 메일 주소를 입력
        to: email,
        // 보내는 메일의 제목을 입력
        subject: 'Airbnb Reservation Info',
        text: '123123',
        html: `<h1>안녕하세요</h1><h2>예약정보입니다.
                </h2><b>12~1</b><br>
                <b>방</b>`,
    });

    console.log('Message sent: %s', info.messageId);

    res.send(response(baseResponse.SUCCESS));
}

exports.getRoominfo = async function (req, res) {
    const roomIdx = Number(req.params.roomIdx);

    if(!roomIdx) return res.send(errResponse(baseResponse.ROOM_ID_EMPTY))

    const selectRoomInfoResult = await roomProvider.selectRoomInfo(roomIdx);

    res.send(response(baseResponse.ROOM_IMAGE_SELECT_SUCCESS, selectRoomInfoResult));
}

exports.getTestRooms = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    // const userIdx = 3;
    const selectRoomsResult = await roomProvider.selectTestRooms(userIdx);

    return res.send(response(baseResponse.ROOMS_SELECT_SUCCESS, selectRoomsResult));
};

/**
 * API No. 1
 * API Name : 숙소 조회 API
 * [GET] /app/rooms
 **/
exports.getRooms = async function(req, res) {
    const userIdx = req.verifiedToken.userIdx;

    let selectRoomsInfoParams;
    const locationName = req.query.locationName;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const adultNum = req.query.adultNum;
    const childNum = req.query.childNum;
    const infantNum = req.query.infantNum;

    if(!locationName) return res.send(errResponse(baseResponse.LOCATION_NAME_EMPTY))
    if(adultNum > 16) return res.send(errResponse(baseResponse.ADULT_NUM_LENGTH))
    if(childNum > 5) return res.send(errResponse(baseResponse.CHILD_NUM_LENGTH))
    if(infantNum > 5) return res.send(errResponse(baseResponse.INFANT_NUM_LENGTH))

    let startDateResult = DateFormatResult.exec(startDate);
    let endDateResult = DateFormatResult.exec(endDate);

    //명칭으로 위도 경도 추출
    const regionLatLongResult = await geoCoder.geocoder.geocode(locationName);
    let Lat = regionLatLongResult[0].latitude;
    let Long =  regionLatLongResult[0].longitude;

    if(!adultNum && !startDate) { //지역명으로만 조회
        console.log(`1.${Lat}, ${Long}`)
        selectRoomsInfoParams = [userIdx, Lat, Long, Lat];
        const selectRoomsResult = await roomProvider.selectRooms(selectRoomsInfoParams);

        return res.send(response(baseResponse.ROOMS_SELECT_SUCCESS, selectRoomsResult));
    }
    else if(!startDate && adultNum) { //지역명 + 인원으로만 조회
        const maxPeople = Number(adultNum) + Number(childNum);
        console.log(`2.${Lat}, ${Long}, M:${maxPeople}`)
        selectRoomsInfoParams = [userIdx, Lat, Long, Lat, maxPeople];
        const selectRoomsResult = await roomProvider.selectRoomsToGuest(selectRoomsInfoParams);

        return res.send(response(baseResponse.ROOMS_SELECT_SUCCESS, selectRoomsResult));
    }
    else if(!adultNum && startDate) { //지역명 + 날짜로만 조회
        if(startDateResult === null) return res.send(errResponse(baseResponse.DATE_TYPE));
        if(endDateResult === null) return res.send(errResponse(baseResponse.DATE_TYPE));
        console.log(`3.${Lat}, ${Long}, ${startDate}, ${endDate}`)
        selectRoomsInfoParams = [userIdx, Lat, Long, Lat, userIdx, Lat, Long, Lat, endDate, startDate];
        const selectRoomsResult = await roomProvider.selectRoomsToDate(selectRoomsInfoParams);

        return res.send(response(baseResponse.ROOMS_SELECT_SUCCESS, selectRoomsResult));
    }
    else if(adultNum && startDate) { //지역명 + 날짜 + 인원으로 조회
        if(startDateResult === null) return res.send(errResponse(baseResponse.DATE_TYPE));
        if(endDateResult === null) return res.send(errResponse(baseResponse.DATE_TYPE));
        const maxPeople = Number(adultNum) + Number(childNum);
        console.log(`4.${Lat}, ${Long}, ${startDate}, ${endDate}, M:${maxPeople}`);
        selectRoomsInfoParams = [userIdx, Lat, Long, Lat, maxPeople, userIdx, Lat, Long, Lat, endDate, startDate, maxPeople];
        const selectRoomsResult = await roomProvider.selectRoomsToDateGuest(selectRoomsInfoParams);

        return res.send(response(baseResponse.ROOMS_SELECT_SUCCESS, selectRoomsResult));
    }
    else {
        return res.send(errResponse(baseResponse.SELECT_ROOMS_ERR));
    }
}

/**
 * API No. 2
 * API Name : 숙소 상세 조회 API
 * [GET] /app/rooms/:roomIdx/contents
 **/
exports.getRoomContents = async function(req, res) {
    const roomIdx = Number(req.params.roomIdx);
    const userIdx = req.verifiedToken.userIdx;

    if(!roomIdx) return res.send(errResponse(baseResponse.ROOM_ID_EMPTY))
    if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY))

    const selectRoomImage = await roomProvider.selectRoomImages(roomIdx);
    const selectRoomContentsResult = await roomProvider.selectRoomContents(roomIdx, userIdx);
    const selectRoomFacilities = await roomProvider.selectRoomFacilities(roomIdx);
    const selectRoomBadges = await roomProvider.selectRoomBadges(roomIdx);
    const selectRoomReviews = await roomProvider.selectRoomReviews(roomIdx);

    const result = {
        "roomImages" : selectRoomImage,
        "roomInfo" : selectRoomContentsResult,
        "roomFacilities" : selectRoomFacilities,
        "roomBadges" : selectRoomBadges,
        "roomReviews" : selectRoomReviews
    };

    return res.send(response(baseResponse.ROOMS_CONTENTS_SELECT_SUCCESS,  result))
};

/**
 * API No. 3
 * API Name : 숙소 리뷰 조회 API
 * [GET] /app/rooms/:roomIdx/reviews
 **/
exports.getRoomReviews = async function (req, res) {
    const roomIdx = Number(req.params.roomIdx);

    if(!roomIdx) return res.send(errResponse(baseResponse.ROOM_ID_EMPTY))

    const selectReviewGrade = await roomProvider.selectReviewGradeAll(roomIdx);
    const selectReviews = await roomProvider.selectRoomReviewsAll(roomIdx);

    const result = {
        "reviewGrades" : selectReviewGrade,
        "reviews" : selectReviews
    }

    return res.send(response(baseResponse.ROOMS_REVIEWS_SELECT_SUCCESS, result));
}

/**
 * API No.
 * API Name : 숙소 리뷰 등록 API
 * [POST] /app/users/rooms/reviews
 **/
exports.postReviews = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const {contents, userIdx, roomIdx, accuracyGrade, communicationGrade, checkinGrade, cleanlinessGrade, locationGrade, priceSatisfactionGrade} = req.body;

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!contents) return res.send(errResponse(baseResponse.REVIEWS_CONTENTS_EMPTY))
        if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY))
        if(!roomIdx) return res.send(errResponse(baseResponse.ROOM_ID_EMPTY))
        if(!accuracyGrade) return res.send(errResponse(baseResponse.ACCURACY_GRADE_EMPTY))
        if(!communicationGrade) return res.send(errResponse(baseResponse.COMMUNICATION_GRADE_EMPTY))
        if(!checkinGrade) return res.send(errResponse(baseResponse.CHECKIN_GRADE_EMPTY))
        if(!cleanlinessGrade) return res.send(errResponse(baseResponse.CLEANLINESS_GRADE_EMPTY))
        if(!locationGrade) return res.send(errResponse(baseResponse.LOCATION_GRADE_EMPTY))
        if(!priceSatisfactionGrade) return res.send(errResponse(baseResponse.PRICE_SATISFACTION_GRADE_EMPTY))

        if(accuracyGrade > 5 || accuracyGrade < 1)
            return res.send(errResponse(baseResponse.GRADE_LENGTH))
        else if(communicationGrade > 5 || communicationGrade < 1)
            return res.send(errResponse(baseResponse.GRADE_LENGTH))
        else if(checkinGrade > 5 || checkinGrade < 1)
            return res.send(errResponse(baseResponse.GRADE_LENGTH))
        else if(cleanlinessGrade > 5 || cleanlinessGrade < 1)
            return res.send(errResponse(baseResponse.GRADE_LENGTH))
        else if(locationGrade > 5 || locationGrade < 1)
            return res.send(errResponse(baseResponse.GRADE_LENGTH))
        else if(priceSatisfactionGrade > 5 || priceSatisfactionGrade < 1)
            return res.send(errResponse(baseResponse.GRADE_LENGTH))

        const insertUserReviewsResult = await roomService.insertUserReviews(
            contents, userIdx, roomIdx, accuracyGrade, communicationGrade, checkinGrade, cleanlinessGrade, locationGrade, priceSatisfactionGrade
        );

        return res.send(insertUserReviewsResult);
    }
};

/**
 * API No.
 * API Name : 호스트 리뷰 등록 API
 * [POST] /app/users/hosts/reviews
 **/
exports.postHostReviews = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const {contents, userIdx, hostUserIdx} = req.body;

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!contents) return res.send(errResponse(baseResponse.REVIEWS_CONTENTS_EMPTY))
        if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY))
        if(!hostUserIdx) return res.send(errResponse(baseResponse.HOST_USERIDX_EMPTY))

        const insertHostReviewsResult = await roomService.insertHostReviews(contents, userIdx, hostUserIdx);

        return res.send(insertHostReviewsResult);
    }
};

/**
 * API No. 4
 * API Name : 예약 현황 조회 API
 * [GET] /app/rooms/:roomIdx/reservations
 **/
exports.getRoomReservation = async function(req, res) {
    const roomIdx = Number(req.params.roomIdx);

    if(!roomIdx) return res.send(errResponse(baseResponse.ROOM_ID_EMPTY))

    const selectRoomReservation = await roomProvider.selectRoomReservation(roomIdx);
    const selectRoomReviewGrade = await roomProvider.selectRoomReviewGrade(roomIdx);

    const result = {
        "reservationStatus" : selectRoomReservation,
        "roomInfo" : selectRoomReviewGrade
    }

    return res.send(response(baseResponse.ROOMS_RESERVATION_SELECT_SUCCESS, result));
};

/**
 * API No. 5
 * API Name : 숙소 예약 정보 조회 API
 * [GET] /app/rooms/:roomIdx/reservation/info
 **/
exports.getRoomReservationInfo = async function(req, res) {
    const userIdx = req.verifiedToken.userIdx;
    // const userIdx = 3;
    const roomIdx = Number(req.params.roomIdx);

    if(!roomIdx) return res.send(errResponse(baseResponse.ROOM_ID_EMPTY))
    if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY))

    const selectRoomReservationInfo = await roomProvider.selectRoomReservationInfo(roomIdx, userIdx);

    return res.send(response(baseResponse.ROOMS_RESERVATION_INFO_SELECT_SUCCESS, selectRoomReservationInfo));
}

/**
 * API No. 6
 * API Name : 숙소 예약 API
 * [POST] /app/rooms/reservation
 **/
exports.postRoomReservation = async function(req, res) {
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const {roomIdx, startDate, endDate, adultGuestNum, childGuestNum, infantGuestNum, businessStatus, paymentStatus, userIdx, paymentPrice} = req.body;

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        let StatusTest = /^([Y|N])?$/; //status 정규식
        let businessStatusResult = StatusTest.exec(businessStatus);
        let paymentStatusResult = StatusTest.exec(paymentStatus);
        let DateFormatResult = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/; //dateformat 정규식

        if(!Number(roomIdx)) return res.send(errResponse(baseResponse.ROOM_ID_EMPTY))
        if(!startDate || startDate === "") return res.send(errResponse(baseResponse.START_DATE_EMPTY))
        if(!endDate || endDate === "") return res.send(errResponse(baseResponse.END_DATE_EMPTY))

        let startDateResult = DateFormatResult.exec(startDate);
        let endDateResult = DateFormatResult.exec(endDate);
        if(startDateResult === null) return res.send(errResponse(baseResponse.DATE_TYPE));
        if(endDateResult === null) return res.send(errResponse(baseResponse.DATE_TYPE));

        if(!adultGuestNum) return res.send(errResponse(baseResponse.ADULT_EMPTY))
        if(childGuestNum < 0) return res.send(errResponse(baseResponse.CHILD_EMPTY))
        if(infantGuestNum < 0) return res.send(errResponse(baseResponse.INFANT_EMPTY))
        if(!businessStatus) return res.send(errResponse(baseResponse.STATUS_EMPTY))
        if(businessStatusResult === null) return res.send(errResponse(baseResponse.BUSINESS_STATUS_TYPE))
        if(!paymentStatus) return res.send(errResponse(baseResponse.PAYMENT_STATUS_EMPTY))
        if(paymentStatusResult === null) return res.send(errResponse(baseResponse.PAYMENT_STATUS_TYPE))
        if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY))
        if(!paymentPrice) return res.send(errResponse(baseResponse.PAYMENT_PRICE))

        const insertReservationInfoParams = [roomIdx, startDate, endDate, adultGuestNum, childGuestNum, infantGuestNum, businessStatus, paymentStatus, userIdx, paymentPrice];

        const insertReservation = await roomService.insertReservation(insertReservationInfoParams);

        return res.send(insertReservation);
    }
};
/**
 * API No. 7
 * API Name : 예약 확정(호스트) API
 * [GET] /app/host-users/:userIdx/rooms/reservations/:reservationIdx/status
 **/
exports.patchRoomReservation = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const userIdx = req.params.userIdx;
    const reservationIdx = req.params.reservationIdx;

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY))
        if(!reservationIdx) return res.send(errResponse(baseResponse.RESERVATION_ID_EMPTY))

        const updateRoomReservation = await roomService.updateRoomReservation(userIdx, reservationIdx);

        return res.send(updateRoomReservation);
    }
}

/**
 * API No. 8
 * API Name : 위시리스트 생성 API
 * [POST] /app/rooms/wishLists
 **/
exports.postRoomWishLists = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const {wishName, startDate, endDate, adultGuestNum, childGuestNum, infantGuestNum, userIdx} = req.body;
    if (!userIdx)
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY))

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (adultGuestNum && !startDate) { //사람 수만 있을 경우
            console.log(1);
            if (!wishName)
                return res.send(errResponse(baseResponse.WISH_NAME_EMPTY))
            if (!adultGuestNum)
                return res.send(errResponse(baseResponse.ADULT_EMPTY))
            if (childGuestNum < 0)
                return res.send(errResponse(baseResponse.CHILD_EMPTY))
            if (infantGuestNum < 0)
                return res.send(errResponse(baseResponse.INFANT_EMPTY))

            const insertRoomWishListsInfoParams = [wishName, adultGuestNum, childGuestNum, infantGuestNum, userIdx];

            const insertRoomWishLists = await roomService.insertRoomWishListsToPeople(insertRoomWishListsInfoParams);

            return res.send(insertRoomWishLists);
        } else if (startDate && !adultGuestNum) { //날짜만 있을 경우
            console.log(2);
            const DateFormatResult = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/; //dateformat 정규식

            if (!wishName)
                return res.send(errResponse(baseResponse.WISH_NAME_EMPTY))
            if (!startDate || startDate === "")
                return res.send(errResponse(baseResponse.START_DATE_EMPTY))
            if (!endDate || endDate === "")
                return res.send(errResponse(baseResponse.END_DATE_EMPTY))
            const startDateResult = DateFormatResult.exec(startDate);
            const endDateResult = DateFormatResult.exec(endDate);
            if (startDateResult == null)
                return res.send(errResponse(baseResponse.DATE_TYPE))
            if (endDateResult == null)
                return res.send(errResponse(baseResponse.DATE_TYPE))

            const insertRoomWishListsInfoParams = [wishName, startDate, endDate, userIdx];

            const insertRoomWishLists = await roomService.insertRoomWishListsToDate(insertRoomWishListsInfoParams);

            return res.send(insertRoomWishLists);
        } else if (startDate && adultGuestNum) { // 사람 날짜 모두 있을 경우
            console.log(3);
            const DateFormatResult = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/; //dateformat 정규식
            if (!wishName)
                return res.send(errResponse(baseResponse.WISH_NAME_EMPTY))
            if (!adultGuestNum)
                return res.send(errResponse(baseResponse.ADULT_EMPTY))
            if (childGuestNum < 0)
                return res.send(errResponse(baseResponse.CHILD_EMPTY))
            if (infantGuestNum < 0)
                return res.send(errResponse(baseResponse.INFANT_EMPTY))
            if (!userIdx)
                return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY))
            if (!startDate || startDate === "")
                return res.send(errResponse(baseResponse.START_DATE_EMPTY))
            if (!endDate || endDate === "")
                return res.send(errResponse(baseResponse.END_DATE_EMPTY))
            const startDateResult = DateFormatResult.exec(startDate);
            const endDateResult = DateFormatResult.exec(endDate);
            if (startDateResult == null)
                return res.send(errResponse(baseResponse.DATE_TYPE))
            if (endDateResult == null)
                return res.send(errResponse(baseResponse.DATE_TYPE))

            const insertRoomWishListsInfoParams = [wishName, startDate, endDate, adultGuestNum, childGuestNum, infantGuestNum, userIdx];

            const insertRoomWishLists = await roomService.insertRoomWishLists(insertRoomWishListsInfoParams);

            return res.send(insertRoomWishLists);
        } else if (!startDate && !adultGuestNum) { //사람 날짜 모두 없을 경우
            console.log(4);
            if (!wishName)
                return res.send(errResponse(baseResponse.WISH_NAME_EMPTY))

            const insertRoomWishListsInfoParams = [wishName, userIdx];

            const insertRoomWishLists = await roomService.insertRoomWishListsToWishName(insertRoomWishListsInfoParams);

            return res.send(insertRoomWishLists);
        }
    }
};

/**
 * API No. 9
 * API Name : 숙소 찜 상태 변경 API
 * [POST] /app/rooms/like
 **/
exports.postRoomLike = async function(req, res) {
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const {roomIdx, userIdx, wishIdx} = req.body;
    if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY))

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!roomIdx) return res.send(errResponse(baseResponse.ROOM_ID_EMPTY))
        if(!wishIdx) return res.send(errResponse(baseResponse.WISH_ID_EMPTY))

        const createRoomLikeResult = await roomService.createRoomLike(roomIdx, userIdx, wishIdx);

        return res.send(createRoomLikeResult);
    }
};

/**
 * API No. 11
 * API Name : 숙소 예약 취소 API
 * [PATCH] /app/users/:userIdx/rooms/reservations/status
 **/
exports.patchUserReservationStatus = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const userIdx = req.params.userIdx;
    const reservationIdx = req.params.reservationIdx;

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY))
        if (!reservationIdx) return res.send(errResponse(baseResponse.RESERVATION_ID_EMPTY))

        const cancelRoomReservation = await roomService.cancelUserRoomReservation(userIdx, reservationIdx);

        return res.send(cancelRoomReservation);
    }
};

/**
 * API No.12
 * API Name : 숙소 신고 API
 * [PATCH] /app/rooms/reports
 **/
exports.postRoomReport = async function (req, res) {
    const {reportIdx, roomIdx, userIdx} = req.body;
    const userIdxFromJWT = req.verifiedToken.userIdx;

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY))
        if (!roomIdx) return res.send(errResponse(baseResponse.ROOM_ID_EMPTY))
        if (!reportIdx) return res.send(errResponse(baseResponse.REPORT_ID_EMPTY))
        if (reportIdx > 6 || reportIdx < 1) return res.send(errResponse(baseResponse.REPORT_ID_LENGTH))

        const insertReportResult = await roomService.insertReports(reportIdx, roomIdx, userIdx);

        return res.send(insertReportResult);
    }
};

/**
 * API No.13
 * API Name : 호스트 정보 조회 API
 * [PATCH] /app/host-users/:userIdx/information
 **/
exports.getHostInfo = async function (req, res) {
    const hostUserIdx = req.params.userIdx; //호스트 userIdx
    const userIdx = req.verifiedToken.userIdx;
    // const userIdx = 7;

    if(!hostUserIdx) return res.send(errResponse(baseResponse.HOST_ID_EMPTY));
    if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));

    const selectHostInfoResult = await roomProvider.selectHostInfo(hostUserIdx);
    if(selectHostInfoResult[0].superHostStatus === 'N') res.send(errResponse(baseResponse.NOT_HOST_USER));
    const selectHostRoomsResult = await roomProvider.selectHostRooms(userIdx, hostUserIdx);
    const selectHostReviewsResult = await roomProvider.selectHostReviews(hostUserIdx);

    const result = {
        "hostInfo": selectHostInfoResult,
        "hostRooms": selectHostRoomsResult,
        "hostReviews": selectHostReviewsResult
    };

    return res.send(response(baseResponse.SELECT_HOST_INFO_SUCCESS, result));
}

/**
 * Check Query
 **/
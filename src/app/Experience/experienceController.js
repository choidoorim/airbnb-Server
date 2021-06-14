const jwtMiddleware = require("../../../config/jwtMiddleware");
const experienceProvider = require("../../app/Experience/experienceProvider");
const experienceService = require("../../app/Experience/experienceService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const geoCoder = require("../../../config/googleMap");
const DateFormatResult = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/; //status 정규식

/**
 * API No. 1
 * API Name : 숙소 조회 API
 * [GET] /app/rooms
 **/

exports.getRooms = async function(req, res) {
    const userIdx = req.verifiedToken.userIdx;
    // const userIdx = 3;

    let selectRoomsInfoParams;
    const locationName = req.query.locationName;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const adultNum = req.query.adultNum;
    const childNum = req.query.childNum;
    const infantNum = req.query.infantNum;

    if(!locationName) return res.send(errResponse(baseResponse.LOCATION_NAME_EMPTY))
    if(adultNum > 16 || adultNum < 1) return res.send(errResponse(baseResponse.ADULT_NUM_LENGTH))
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
 * API Name : 체험 상세 조회 API
 * [GET] /app/rooms/:roomIdx/contents
 **/
 exports.getExpContents = async function(req, res) {
    const expIdx = Number(req.params.experienceIdx);
    const userIdx = req.verifiedToken.userIdx;
    // const userIdx = 6;

    if(!expIdx) return res.send(errResponse(baseResponse.ROOM_ID_EMPTY))
    if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY))

    const selectRoomImage = await experienceProvider.selectRoomImages(roomIdx);
    const selectRoomContentsResult = await experienceProvider.selectRoomContents(roomIdx, userIdx);
    const selectRoomFacilities = await experienceProvider.selectRoomFacilities(roomIdx);
    const selectRoomBadges = await experienceProvider.selectRoomBadges(roomIdx);
    const selectRoomReviews = await experienceProvider.selectRoomReviews(roomIdx);

    const result = {
        "roomImages" : selectRoomImage,
        "roomInfo" : selectRoomContentsResult,
        "roomFacilities" : selectRoomFacilities,
        "roomBadges" : selectRoomBadges,
        "roomReviews" : selectRoomReviews
    }

    return res.send(response(baseResponse.ROOMS_CONTENTS_SELECT_SUCCESS, result))
};

exports.postExpLikes = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const {userIdx, experienceIdx, wishIdx} = req.body;

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        if(!wishIdx) return res.send(errResponse(baseResponse.WISH_ID_EMPTY));
        if(!experienceIdx) return res.send(errResponse(baseResponse.EXPERIENCE_ID_EMPTY));

        const postExpLikes = await experienceService.insertExpLikes(userIdx, experienceIdx, wishIdx);

        return res.send(postExpLikes);
    }
};

/**
 * API No. 3
 * API Name : 숙소 리뷰 조회 API
 * [GET] /app/rooms/:roomIdx/reviews\
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
    const roomIdx = Number(req.params.roomIdx);
    // const userIdx = 1;

    if(!roomIdx) return res.send(errResponse(baseResponse.ROOM_ID_EMPTY))
    if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY))

    const selectRoomReservationInfo = await roomProvider.selectRoomReservationInfo(roomIdx, userIdx);

    return res.send(response(baseResponse.ROOMS_RESERVATION_INFO_SELECT_SUCCESS, selectRoomReservationInfo));
}

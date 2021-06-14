const jwtMiddleware = require("../../../config/jwtMiddleware");
const tripProvider = require("../../app/Trip/tripProvider");
const tripService = require("../../app/Trip/tripService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");
const regexEmail = require("regex-email");
const axios = require("axios");
const {parse, stringify} = require('flatted');
const DateFormatResult = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/; //status 정규식

exports.getTestIamport = async function(req, res) {
    // const a = [{
    //     url: "https://api.iamport.kr/users/getToken",
    //     method: "post", // POST method
    //     headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
    //     data: {
    //         imp_key: "5951959684708326", // REST API키
    //         imp_secret: "8f01478b084a513904583a19244f4c074b0d2fcc20daa7edd09c21086c80417c9bbe6e892965701f" // REST API Secret
    //     }
    // }];
    // a[0].a = a;
    // a.push(a);
    //
    // // const result = await axios(stringify(a));

    const result = await axios({
        method : 'get',
        url : 'https://product.alvindr.shop/app/tests'
    }).then((res)=>{
        console.log(res)
    })

    return res.send(result);
}

// curl -H "Content-Type: application/json" POST -d '{"imp_key": "5951959684708326", "imp_secret":"8f01478b084a513904583a19244f4c074b0d2fcc20daa7edd09c21086c80417c9bbe6e892965701f"}' https://api.iamport.kr/users/getToken

/**
 * API No. 1
 * API Name : 이전 예약 조회 API
 * [GET] /app/trip/reservations/past
 **/
exports.getPastReservations = async function(req, res) {
    const userIdx = req.verifiedToken.userIdx;
    // const userIdx = 7;

    if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));

    const selectPastReservationResult = await tripProvider.selectPastReservations(userIdx);

    return res.send(response(baseResponse.TRIP_PAST_SELECT_SUCCESS, selectPastReservationResult));
};

/**
 * API No. 2
 * API Name : 예정된 예약 조회 API
 * [GET] /app/trip/reservations/scheduled
 **/
exports.getFutureReservations = async function(req, res) {
    const userIdx = req.verifiedToken.userIdx;
    // const userIdx = 7;

    if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));

    const selectFutureReservationResult = await tripProvider.selectFutureReservation(userIdx);

    return res.send(response(baseResponse.TRIP_FUTURE_SELECT_SUCCESS, selectFutureReservationResult));
};

/**
 * API No. 3
 * API Name : 유저 예약된 숙소 정보 조회 API
 * [GET] /app/users/rooms/reservation/:reservationIdx
 **/
exports.getUserReservations = async function (req, res) {
    const reservationIdx = req.params.reservationIdx;

    if(!reservationIdx) return res.send(errResponse(baseResponse.RESERVATION_ID_EMPTY));

    const selectReservationImageResult = await tripProvider.selectReservationImage(reservationIdx);
    const selectUserReservationResult = await tripProvider.selectUserReservations(reservationIdx);

    const result = {
        "reservationImage" : selectReservationImageResult,
        "reservationInfo" : selectUserReservationResult
    }

    return res.send(response(baseResponse.RESERVATION_INFO_SELECT_SUCCESS, result));
};

exports.patchReservation = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const userIdx = req.params.userIdx;
    const reservationIdx = req.params.reservationIdx;
    const {startDate, endDate, adultNum, childNum, infantNum} = req.body;

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        let startDateResult = DateFormatResult.exec(startDate);
        let endDateResult = DateFormatResult.exec(endDate);

        if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        if(!reservationIdx) return res.send(errResponse(baseResponse.RESERVATION_ID_EMPTY));
        if(adultNum > 16 || adultNum < 1) return res.send(errResponse(baseResponse.ADULT_NUM_LENGTH));
        if(childNum > 5) return res.send(errResponse(baseResponse.CHILD_NUM_LENGTH));
        if(infantNum > 5) return res.send(errResponse(baseResponse.INFANT_NUM_LENGTH));
        if(startDateResult === null) return res.send(errResponse(baseResponse.DATE_TYPE));
        if(endDateResult === null) return res.send(errResponse(baseResponse.DATE_TYPE));

        const changeReservationInfo = await tripService.updateReservationInfo(userIdx, reservationIdx, startDate, endDate, adultNum, childNum, infantNum);

        return res.send(changeReservationInfo);
    }
};
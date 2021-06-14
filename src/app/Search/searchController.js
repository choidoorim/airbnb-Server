const jwtMiddleware = require("../../../config/jwtMiddleware");
const searchProvider = require("../../app/Search/searchProvider");
const searchService = require("../../app/Search/searchService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const geoCoder = require("../../../config/googleMap");
const DateFormatResult = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/; //status 정규식

exports.getSearch = async function (req, res) {
    // const userIdx = 3;
    const userIdx = req.verifiedToken.userIdx;

    if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY))

    const selectSearchResult = await searchProvider.selectSearch(userIdx);

    return res.send(response(baseResponse.SEARCH_SELECT_SUCCESS, selectSearchResult));
};

exports.postSearch = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const {userIdx, locationName, startDate, endDate, adultGuestNum, childGuestNum, infantGuestNum} = req.body;
    let startDateResult = DateFormatResult.exec(startDate);
    let endDateResult = DateFormatResult.exec(endDate);

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        if(!locationName) return res.send(errResponse(baseResponse.LOCATION_NAME_EMPTY));
        if(adultGuestNum > 16 || adultGuestNum < 1) return res.send(errResponse(baseResponse.ADULT_NUM_LENGTH));
        if(childGuestNum > 5 || childGuestNum < 0) return res.send(errResponse(baseResponse.CHILD_NUM_LENGTH));
        if(infantGuestNum > 5 || infantGuestNum < 0) return res.send(errResponse(baseResponse.INFANT_NUM_LENGTH));
        if(startDateResult === null) return res.send(errResponse(baseResponse.DATE_TYPE));
        if(endDateResult === null) return res.send(errResponse(baseResponse.DATE_TYPE));

        const insertSearchResult = await searchService.insertSearch(userIdx, locationName, startDate, endDate, adultGuestNum, childGuestNum, infantGuestNum);

        return res.send(insertSearchResult);
    }
}
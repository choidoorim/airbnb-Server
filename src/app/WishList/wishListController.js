const jwtMiddleware = require("../../../config/jwtMiddleware");
const wishListProvider = require("../../app/WishList/wishListProvider");
const wishListService = require("../../app/WishList/wishListService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");
const regexEmail = require("regex-email");

const admin = require("firebase-admin");
const serviceAccount = require("../../../push-notification-7fdd0-firebase-adminsdk-2cle3-343fd9f1d9.json");

function getAccessToken() {
    return new Promise(function(resolve, reject) {
        const key = require('../../../push-notification-7fdd0-firebase-adminsdk-2cle3-343fd9f1d9.json');
        const jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            SCOPES,
            null
        );
        jwtClient.authorize(function(err, tokens) {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });
    });
}

exports.getTest = async function(req, res) {

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    const userId = 'some-uid';
    const additionalClaims = {
        premiumAccount: true,
    };

    admin
        .auth()
        .createCustomToken(userId, additionalClaims)
        .then((customToken) => {
            return res.send(customToken);
        })
        .catch((error) => {
            console.log('Error creating custom token:', error);
        });

    admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
            const uid = decodedToken.uid;
            // ...
        })
        .catch((error) => {
            // Handle error
        });

}

/**
 * API No. 1
 * API Name : 위시리스트 조회 API
 * [GET] /app/wishlists
 **/
exports.getWishLists = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    // const userIdx = 1;

    if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY))

    const selectWishLists = await wishListProvider.selectWishLists(userIdx);
    const selectWishListImages = await wishListProvider.selectWishListImages(userIdx);

    let result = selectWishLists;
    // const result1 = {
    //     "image": selectWishListImages,
    //     "contents": selectWishLists
    // }

    for (let i =0; i<selectWishLists.length; i++){
        for (let j=0; j<selectWishListImages.length; j++){
            console.log(`list.${selectWishLists[i].idx}`);
            if(selectWishLists[i].idx === selectWishListImages[j].wishIdx){
                console.log(selectWishListImages[j]);
                result[i].image = selectWishListImages[j];
                delete selectWishListImages[j].wishIdx;
            }
        }
    }

    return res.send(response(baseResponse.WISHLISTS_SELECT, result));
};

/**
 * API No. 2
 * API Name : 위시리스트 내역 조회 API
 * [GET] /app/wishlists/:wishIdx/contents
 **/
exports.getWishListContents = async function (req, res) {
    const wishIdx = req.params.wishIdx;

    // if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY))
    if(!wishIdx) return res.send(errResponse(baseResponse.WISH_ID_EMPTY));

    const selectWishMember = await wishListProvider.selectWishMember(wishIdx);
    const selectWishListContents = await wishListProvider.selectWishListContents(wishIdx);
    const selectLikeRoom = await wishListProvider.selectLikeRoom(wishIdx);
    const selectCheckReservationStatus = await wishListProvider.selectCheckReservationStatus(wishIdx);

    const result = {
        "wishListMember" : selectWishMember,
        "wishListInfo" : selectWishListContents,
        "likeRoomInfo" : selectLikeRoom,
        "reservationNotPossible" : selectCheckReservationStatus
    };

    return res.send(response(baseResponse.WISHLISTS_CONTENTS_SELECT_SUCCESS, result));
};

/**
 * API No. 3
 * API Name : 위시리스트 설정 조회 API
 * [GET] /app/wishlists/:wishIdx/set
 **/
exports.getWishListSets = async function (req, res) {
    const wishIdx = req.params.wishIdx;

    if(!wishIdx) return res.send(errResponse(baseResponse.WISH_ID_EMPTY));

    const selectWishListSetResult = await wishListProvider.selectWishListSets(wishIdx);
    const selectWishMember = await wishListProvider.selectWishMember(wishIdx);

    const result = {
        "wishSet" : selectWishListSetResult,
        "wishMember" : selectWishMember
    }

    return res.send(response(baseResponse.WISHLISTS_SET_SELECT_SUCCESS , result))
};

/**
 * API No. 4
 * API Name : 위시리스트 설정 수정 API
 * [PATCH] /app/wishlists/:wishIdx/users/:userIdx/set
 **/

exports.patchWishListSet = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const {wishName, seeWishStatus} = req.body;
    const userIdx = req.params.userIdx;
    const wishIdx = req.params.wishIdx;

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!wishIdx) return res.send(errResponse(baseResponse.WISH_ID_EMPTY));
        if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        if(!wishName) return res.send(errResponse(baseResponse.WISH_NAME_EMPTY));
        if(!seeWishStatus) return res.send(errResponse(baseResponse.SEE_STATUS_EMPTY));

        const updateWishListSetResult = await wishListService.updateWishListSet(wishName, seeWishStatus, userIdx, wishIdx);

        return res.send(updateWishListSetResult);
    }
};

/**
 * API No. 5
 * API Name : 위시리스트 삭제 API
 * [PATCH] /app/wishlists/:wishIdx/users/:userIdx/status
 **/

exports.patchWishListStatus = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const userIdx = req.params.userIdx;
    const wishIdx = req.params.wishIdx;

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!wishIdx) return res.send(errResponse(baseResponse.WISH_ID_EMPTY));
        if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));

        const deleteWishListResult = await wishListService.deleteWishList(userIdx, wishIdx);

        return res.send(deleteWishListResult);
    }
};

/**
 * API No. 6
 * API Name : 위시리스트 날짜 수정 API
 * [PATCH] /app/wishlists/:wishIdx/users/:userIdx/dates
 **/
exports.patchWishDates = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const userIdx = req.params.userIdx;
    const wishIdx = req.params.wishIdx;
    let {startDate, endDate} = req.body;

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const DateFormatResult = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/; //dateformat 정규식
        if(!wishIdx) return res.send(errResponse(baseResponse.WISH_ID_EMPTY));
        if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        if(!startDate && !endDate) {
            startDate = null;
            endDate = null;
        }else{
            const startDateResult = DateFormatResult.exec(startDate);
            const endDateResult = DateFormatResult.exec(endDate);
            if(startDateResult === null) return res.send(errResponse(baseResponse.DATE_TYPE));
            if(endDateResult === null) return res.send(errResponse(baseResponse.DATE_TYPE));
        }

        const updateWishDatesResult = await wishListService.updateWishDates(userIdx, wishIdx, startDate, endDate);

        return res.send(updateWishDatesResult);
    }
}

/**
 * API No. 7
 * API Name : 위시리스트 인원 수정 API
 * [PATCH] /app/wishlists/:wishIdx/users/:userIdx/personnel
 **/
exports.patchWishPerson = async function (req, res) {
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const userIdx = req.params.userIdx;
    const wishIdx = req.params.wishIdx;
    const {adultGuestNum, childGuestNum, infantGuestNum} = req.body;
    console.log(infantGuestNum);

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!wishIdx) return res.send(errResponse(baseResponse.WISH_ID_EMPTY));
        if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        if(!adultGuestNum) return res.send(errResponse(baseResponse.ADULT_EMPTY));
        if(childGuestNum === undefined) return res.send(errResponse(baseResponse.CHILD_EMPTY));
        if(infantGuestNum === undefined) return res.send(errResponse(baseResponse.INFANT_EMPTY));

        if(adultGuestNum > 16 || adultGuestNum < 1) return res.send(errResponse(baseResponse.ADULT_NUM_LENGTH));
        if(childGuestNum > 5 || childGuestNum < 0) return res.send(errResponse(baseResponse.CHILD_NUM_LENGTH));
        if(infantGuestNum > 5 || infantGuestNum < 0) return res.send(errResponse(baseResponse.INFANT_NUM_LENGTH));

        const updateWishPersonResult = await wishListService.updateWishPerson(userIdx, wishIdx, adultGuestNum, childGuestNum, infantGuestNum);

        return res.send(updateWishPersonResult);
    }
}
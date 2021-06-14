const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const wishListProvider = require("./wishListProvider");
const wishListDao = require("./wishListDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.updateWishListSet = async function (wishName, seeWishStatus, userIdx, wishIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const checkWishListResult = await wishListProvider.checkWishList(wishIdx);
        if(checkWishListResult.length === 0 || checkWishListResult[0].status == 'N')
            return errResponse(baseResponse.WISHLISTS_NOT_EXITS);
        if(checkWishListResult[0].userIdx != userIdx) return errResponse(baseResponse.NOT_WISHLIST_USER);
        if(checkWishListResult[0].wishName === wishName && checkWishListResult[0].seeListStatus === seeWishStatus)
            return errResponse(baseResponse.NOT_EXIST_CHANGES);

        const wishSetInfo = [wishName, seeWishStatus, userIdx, wishIdx];

        await connection.beginTransaction();
        const updateWishListSetResult = await wishListDao.updateWishListSet(connection, wishSetInfo);
        await connection.commit();

        return response(baseResponse.WISHLISTS_SET_UPDATE_SUCCESS, updateWishListSetResult[0].info);
    } catch (err) {
        await connection.rollback();
        logger.error(`App - updateWishListSet Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

exports.deleteWishList = async function (userIdx, wishIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        let deleteWishListMember;
        let result;

        const checkWishListResult = await wishListProvider.checkWishList(wishIdx);
        if (checkWishListResult.length === 0)
            return errResponse(baseResponse.WISHLISTS_NOT_EXITS);
        else if (checkWishListResult[0].status == 'N')
            return errResponse(baseResponse.ALREADY_DELETE_WISHLISTS);
        else if (checkWishListResult[0].userIdx != userIdx)
            return errResponse(baseResponse.NOT_WISHLIST_USER);

        const checkWishMember = await wishListProvider.checkWishMember(wishIdx);

        await connection.beginTransaction();
        const deleteWishListResult = await wishListDao.updateWishListStatus(connection, userIdx, wishIdx); // WishList delete
        const deleteLikeRooms = await wishListDao.updateRoomLikesStatus(connection, wishIdx); // Like delete
        if (checkWishMember.length === 0) {
            result = {
                "deleteWishListResult": deleteWishListResult[0].info,
                "deleteLikeResult": deleteLikeRooms[0].info
            };
        } else {
            deleteWishListMember = await wishListDao.updateWishListMemberStatus(connection, wishIdx); // wishMember delete
            result = {
                "deleteWishListResult": deleteWishListResult[0].info,
                "deleteLikeResult": deleteLikeRooms[0].info,
                "deleteMemberResult": deleteWishListMember[0].info,
            };
        }
        await connection.commit();
        return response(baseResponse.WISHLISTS_DELETE_SUCCESS, result);

    } catch (err) {
        await connection.rollback();
        logger.error(`App - deleteWishList Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

exports.updateWishDates = async function(userIdx, wishIdx, startDate, endDate) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const checkWishListResult = await wishListProvider.checkWishList(wishIdx);
        if(checkWishListResult.length === 0 || checkWishListResult[0].status === 'N')
            return errResponse(baseResponse.WISHLISTS_NOT_EXITS);
        if(checkWishListResult[0].userIdx != userIdx)
            return errResponse(baseResponse.NOT_WISHLIST_USER);
        if(checkWishListResult[0].startDate === startDate && checkWishListResult[0].endDate === endDate)
            return errResponse(baseResponse.NOT_EXIST_CHANGES);

        await connection.beginTransaction();
        const updateWishDatesResult = await wishListDao.updateWishDates(connection, userIdx, wishIdx, startDate, endDate);
        await connection.commit();

        return response(baseResponse.WISHLISTS_DATE_UPDATE_SUCCESS, updateWishDatesResult[0].info)

    } catch (err) {
        await connection.rollback();
        logger.error(`App - updateWishDates Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

exports.updateWishPerson = async function (userIdx, wishIdx, adultGuestNum, childGuestNum, infantGuestNum) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const wishPersonInfo = [adultGuestNum, childGuestNum, infantGuestNum, userIdx, wishIdx];
        const checkWishListResult = await wishListProvider.checkWishList(wishIdx);
        if(checkWishListResult.length === 0 || checkWishListResult[0].status === 'N')
            return errResponse(baseResponse.WISHLISTS_NOT_EXITS);
        if(checkWishListResult[0].userIdx != userIdx)
            return errResponse(baseResponse.NOT_WISHLIST_USER);
        if(checkWishListResult[0].adultGuestNum === adultGuestNum && checkWishListResult[0].childGuestNum === childGuestNum && checkWishListResult[0].infantGuestNum === infantGuestNum)
            return errResponse(baseResponse.NOT_EXIST_CHANGES);

        await connection.beginTransaction();
        const updateWishPersonResult = await wishListDao.updateWishPerson(connection, wishPersonInfo);
        await connection.commit();

        return response(baseResponse.WISHLISTS_PERSON_UPDATE_SUCCESS, updateWishPersonResult[0].info);
    } catch (err) {
        await connection.rollback();
        logger.error(`App - deleteWishList Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}

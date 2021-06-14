const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const wishListDao = require("./wishListDao");

// 위시리스트 조회 API
exports.selectWishLists = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const wishListsResult = await wishListDao.selectWishLists(connection, userIdx);
    connection.release();

    return wishListsResult;
};

exports.selectWishListImages = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const wishListImages = await wishListDao.selectWishListImages(connection, userIdx);
    connection.release();

    return wishListImages;
};

//위시리스트 내역 조회 API
exports.selectWishMember = async function (wishIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const wishMemberResult = await wishListDao.selectWishMember(connection, wishIdx);
    connection.release();

    return wishMemberResult;
};

exports.selectWishListContents = async function (wishIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const wishListContentsResult = await wishListDao.selectWishListContents(connection, wishIdx);
    connection.release();

    return wishListContentsResult;
};

exports.selectLikeRoom = async function (wishIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const likeRoomResult = await wishListDao.selectLikeRoom(connection, wishIdx);
    connection.release();

    return likeRoomResult;
};

exports.selectCheckReservationStatus = async function (wishIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkReservationStatusResult = await wishListDao.selectCheckReservationStatus(connection, wishIdx);
    connection.release();

    return checkReservationStatusResult;
};

exports.selectWishListSets = async function (wishIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const wishListSetsResult = await wishListDao.selectWishListSets(connection, wishIdx);
    connection.release();

    return wishListSetsResult;
};

// checkQuery
exports.checkWishList = async function (wishIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkWishListResult = await wishListDao.checkWishList(connection, wishIdx);
    connection.release();

    return checkWishListResult;
};

exports.checkWishMember = async function (wishIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkWishMemberResult = await wishListDao.checkWishMember(connection, wishIdx);
    connection.release();

    return checkWishMemberResult;
}
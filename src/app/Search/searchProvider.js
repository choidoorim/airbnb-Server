const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const searchDao = require("./searchDao");

exports.selectSearch = async function(userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const searchResult = await searchDao.selectSearch(connection, userIdx);
    connection.release();

    return searchResult;
};

exports.checkSearchInfo = async function(locationName, userIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const checkSearchInfoResult = await searchDao.checkSearchInfo(connection, locationName, userIdx);
    connection.release();

    return checkSearchInfoResult;
}
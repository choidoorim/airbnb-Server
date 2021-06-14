const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const searchProvider = require("./searchProvider");
const searchDao = require("./searchDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.insertSearch = async function(userIdx, locationName, startDate, endDate, adultNum, childNum, infantNum) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const insertSearchInfo = [locationName, startDate, endDate, adultNum, childNum, infantNum, userIdx];
        let deleteSearchResult;
        let insertSearchResult;
        let updateSearch;

        const checkSearchInfo = await searchProvider.checkSearchInfo(locationName, userIdx);
        if(checkSearchInfo.length < 1) return errResponse(baseResponse.SEARCH_NOT_EXITS); //존재하지 않는 검색결과

        await connection.beginTransaction();
        if(checkSearchInfo.length > 0){
            updateSearch = await searchDao.updateSearch(connection, locationName, startDate, endDate, adultNum, childNum, infantNum, checkSearchInfo[0].idx);
            await connection.commit();

            return response(baseResponse.SEARCH_INSERT_SUCCESS, updateSearch[0].info);
        }else {
            const checkSearch = await searchProvider.selectSearch(userIdx);
            if(checkSearch.length > 2){
                deleteSearchResult = await searchDao.deleteSearch(connection, userIdx);
            }
            insertSearchResult = await searchDao.insertSearch(connection, insertSearchInfo);
            await connection.commit();

            return response(baseResponse.SEARCH_INSERT_SUCCESS, insertSearchResult[0].insertId);
        }
    } catch(err) {
        await connection.rollback();
        logger.error(`App - insertSearch Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};
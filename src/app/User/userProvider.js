const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.emailVerifyCheck = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectVerifiedEmail(connection, userIdx);
  connection.release();

  return emailCheckResult;
};

exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

exports.phoneVerifyCheck = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectVerifiedPhone(connection, userIdx);
  connection.release();

  return emailCheckResult;
};

exports.phoneNumberCheck = async function (phoneNumber) {
  const connection = await pool.getConnection(async (conn) => conn);
  const phonenumberCheckResult = await userDao.selectUserPhoneNumber(connection, phoneNumber);
  connection.release();

  return phonenumberCheckResult;
};

exports.phoneAccountCheck = async function (phoneNumber) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectPhoneUserAccount(connection, phoneNumber);
  connection.release();

  return userAccountResult;
};

exports.emailAccountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectEmailUserAccount(connection, email);
  connection.release();

  return userAccountResult;
};

exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
      connection,
      selectUserPasswordParams
  );
  connection.release();
  return passwordCheckResult[0];
};


// 유저 있는지 확인
exports.checkUsers = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkUsersResult = await userDao.selectUsers(connection, userIdx);
  connection.release();

  return checkUsersResult;
};

// 로그인, 자동 로그인
exports.checkJWT = async function(userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkJWTResult = await userDao.selectJWT(connection, userIdx);
  connection.release();

  return checkJWTResult;
};

exports.retrieveProfile = async function(userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userProfileResult = await userDao.selectProfile(connection, userIdx);
  connection.release();

  if (userProfileResult.length < 1) {
      return response(baseResponse.USER_USERIDX_NOT_EXIST);
  }

  return response(baseResponse.USER_PROFIlE_SELECT_SUCCESS, userProfileResult[0]);
};

exports.retrieveReview = async function(userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userReviewResult = await userDao.selectReview(connection, userIdx);
  connection.release();

  if (userReviewResult.length < 1) {
      return response(baseResponse.USER_USERIDX_NOT_EXIST);
  }

  return response(baseResponse.USER_REVIEW_SELECT_SUCCESS, userReviewResult);
};

exports.retrieveMyProfile = async function(userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userProfileResult = await userDao.selectMyProfile(connection, userIdx);
  connection.release();

  if (userProfileResult.length < 1) {
      return response(baseResponse.USER_USERIDX_NOT_EXIST);
  }

  return response(baseResponse.USER_MYPROFIlE_SELECT_SUCCESS , userProfileResult[0]);
};

exports.retrievePrivacy = async function(userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userPrivacyResult = await userDao.selectPrivacy(connection, userIdx);
  connection.release();

  if (userPrivacyResult.length < 1) {
      return response(baseResponse.USER_USERIDX_NOT_EXIST);
  }

  return response(baseResponse.USER_PRIVACY_SELECT_SUCCESS, userPrivacyResult[0]);
};

// 유저 있는지 확인
exports.checkReports = async function (userIdxFromJWT, userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkUsersResult = await userDao.selectReports(connection, userIdxFromJWT, userIdx);
  connection.release();

  return checkUsersResult;
};

exports.naverEmailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectNaverUserEmail(
    connection,
    email
  );
  connection.release();

  return emailCheckResult;
};

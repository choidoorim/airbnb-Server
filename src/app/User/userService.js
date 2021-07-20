const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createPhoneUser = async function (phoneNumber, name, lastName, birthday, email) {
    try {
        // 전화번호 중복 확인
        const phoneRows = await userProvider.phoneNumberCheck(phoneNumber);
        if (phoneRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_PHONENUMBER);
        
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        const insertUserInfoParams = [phoneNumber, name, lastName, birthday, email];

        const connection = await pool.getConnection(async (conn) => conn);
        const userIdResult = await userDao.insertPhoneUser(connection, insertUserInfoParams);
        connection.release();

        return response(baseResponse.USER_SIGNUP_SUCCESS, {"addedUser": userIdResult[0].insertId});

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


exports.createEmailUser = async function (name, lastName, birthday, email, password) {
    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화 방법 수정(hashed + salt). 2021.07.20
        const salt  = await crypto
            .randomBytes(32)
            .toString("base64")
        const hashedPassword = await crypto
            .pbkdf2Sync(password, salt, 1, 32, 'sha512')
            .toString('base64')


        const insertUserInfoParams = [name, lastName, birthday, email, hashedPassword, salt];

        const connection = await pool.getConnection(async (conn) => conn);
        const userIdResult = await userDao.insertEmailUser(connection, insertUserInfoParams);
        connection.release();

        return response(baseResponse.USER_SIGNUP_SUCCESS, {"addedUser": userIdResult[0].insertId});

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.createSocialUser = async function (email) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        const userIdResult = await userDao.insertSocialUser(connection, email);
        connection.release();

        return response(baseResponse.USER_SIGNUP_SUCCESS, {"addedUser": userIdResult[0].insertId});

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


exports.editUser = async function (userIdx, name, lastName, birthday, email) {
    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUser(connection, userIdx, name, lastName, birthday, email);
        connection.release();

        return response(baseResponse.USER_SIGNUP_SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


exports.postSocialSignIn = async function (email) {
    try {
        // 이메일 존재 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);
        const selectEmail = emailRows[0].email

        // 계정 상태 확인
        const userRows = await userProvider.emailAccountCheck(email);

        if (userRows[0].status === "I") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userRows[0].status === "D") {
            return errResponse(baseResponse.SIGNIN_DELETED_ACCOUNT);
        }

        // 로그인 여부 check
        const checkJWT = await userProvider.checkJWT(userRows[0].idx);
        if (checkJWT.length > 0) {
            return errResponse(baseResponse.ALREADY_LOGIN);
        }

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userIdx: userRows[0].idx,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );


        const connection = await pool.getConnection(async (conn) => conn);
        const tokenResult = await userDao.insertToken(connection, userRows[0].idx, token);
        connection.release();

        return response(baseResponse.USER_SIGNIN_SUCCESS, {'userIdx': userRows[0].idx, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


exports.postPhoneSignIn = async function (phoneNumber) {
    try {
        // 전화번호 여부 확인
        const phoneRows = await userProvider.phonenumberCheck(phoneNumber);
        if (phoneRows.length < 1) return errResponse(baseResponse.SIGNIN_PHONENUMBER_WRONG);

        // 계정 상태 확인
        const userRows = await userProvider.phoneAccountCheck(phoneNumber);

        if (userRows[0].status === "I") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userRows[0].status === "D") {
            return errResponse(baseResponse.SIGNIN_DELETED_ACCOUNT);
        }

        // 로그인 여부 check
        const checkJWT = await userProvider.checkJWT(userRows[0].idx);
        if (checkJWT.length > 0) {
            return errResponse(baseResponse.ALREADY_LOGIN);
        }

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userIdx: userRows[0].idx,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        const connection = await pool.getConnection(async (conn) => conn);
        const tokenResult = await userDao.insertToken(connection, userRows[0].idx, token);
        connection.release();

        return response(baseResponse.USER_SIGNIN_SUCCESS, {'userIdx': userRows[0].idx, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


exports.postEmailSignIn = async function (email, password) {
    try {
        // 이메일 존재 여부 확인, salt 값 획득
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

        const selectEmail = emailRows[0].email;
        const salt = emailRows[0].salt;
        const dbPassword = emailRows[0].password;

        // 비밀번호 확인
        const hashedPassword = await crypto
            .pbkdf2Sync(password, salt, 1, 32, 'sha512')
            .toString('base64');

        console.log(dbPassword)
        console.log(hashedPassword)
        if (dbPassword !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        // 계정 상태 확인
        const userRows = await userProvider.emailAccountCheck(email);

        if (userRows[0].status === "I") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userRows[0].status === "D") {
            return errResponse(baseResponse.SIGNIN_DELETED_ACCOUNT);
        }

        // 로그인 여부 check
        const checkJWT = await userProvider.checkJWT(userRows[0].idx);
        if (checkJWT.length > 0) {
            return errResponse(baseResponse.ALREADY_LOGIN);
        }

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userIdx: userRows[0].idx,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );


        const connection = await pool.getConnection(async (conn) => conn);
        const tokenResult = await userDao.insertToken(connection, userRows[0].idx, token);
        connection.release();

        return response(baseResponse.USER_SIGNIN_SUCCESS, {'userIdx': userRows[0].idx, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//이메일 검증
exports.postEmailVerify = async function (email) {
    // try {
        const connection = await pool.getConnection(async(conn) => conn);

        // 이메일 유저 정보 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows[0] != null){ // 이메일로 가입한 유저 정보가 있다면
            userIdx = emailRows[0].idx;

            // 뱃지가 없다면 생성, 있다면 에러 response
            const verifyemailRows = await userProvider.emailVerifyCheck(userIdx);
            if (verifyemailRows[0] != null) { //배지가 없다면 배지 생성
                return errResponse(baseResponse.ALREADY_AUTH_EMAIL); //이미 인증된 이메일입니다.
            } else {
                const userBadgeResult = await userDao.insertUserEmailBadge(connection, userIdx);
            }
        } else { // 이메일로 가입한 유저 정보가 없다면
            const userIdResult = await userDao.insertOnlyEmailUser(connection, email); //회원가입
            const emailRows = await userProvider.emailCheck(email);
            userIdx = emailRows[0].idx;

            // 뱃지가 없다면 생성, 있다면 에러 response
            const verifyemailRows = await userProvider.emailVerifyCheck(userIdx);
            if (verifyemailRows[0] != null) { //배지가 없다면 배지 생성, 회원가입
                return errResponse(baseResponse.ALREADY_AUTH_EMAIL); //이미 인증된 이메일입니다.  
            } else {
                const userBadgeResult = await userDao.insertUserEmailBadge(connection, userIdx);
            }
        }
        connection.release();
        return response(baseResponse.USER_EMAIL_AUTH_SUCCESS);
    // } catch (err) {
    //   logger.error(`App - EmailVerify Service error\n: ${err.message}`);
    //   return errResponse(baseResponse.EMAIL_AUTH_ERROR);
    // }
};

//전화번호 검증
exports.postPhoneVerify = async function (phoneNumber) {
    // try {
        const connection = await pool.getConnection(async(conn) => conn);

        // 휴대전화 유저 정보 확인
        const phoneRows = await userProvider.phoneNumberCheck(phoneNumber);
        console.log(phoneRows);
        if (phoneRows[0] != null){ // 휴대전화로 가입한 유저 정보가 있다면
            userIdx = phoneRows[0].idx;

            // 뱃지가 없다면 생성, 있다면 에러 response
            const verifyphoneRows = await userProvider.phoneVerifyCheck(userIdx);
            console.log(verifyphoneRows);
            console.log(verifyphoneRows[0]);
            if (verifyphoneRows[0] != null) { //배지가 없다면 배지 생성
                return errResponse(baseResponse.ALREADY_AUTH_PHONENUMBER); //이미 인증된 전화번호입니다.
            } else {
                const userBadgeResult = await userDao.insertUserPhoneBadge(connection, userIdx);
            }
        } else { // 이메일로 가입한 유저 정보가 없다면
            const userIdResult = await userDao.insertOnlyPhoneNumberUser(connection, phoneNumber); //회원가입
            const phoneRows = await userProvider.phoneNumberCheck(phoneNumber);
            userIdx = phoneRows[0].idx;

            // 뱃지가 없다면 생성, 있다면 에러 response
            const verifyphoneRows = await userProvider.phoneVerifyCheck(userIdx);
            console.log(verifyphoneRows);
            if (verifyphoneRows[0] != null) { //배지가 없다면 배지 생성, 회원가입
                const userBadgeResult = await userDao.insertUserPhoneBadge(connection, userIdx);
            } else {
                return errResponse(baseResponse.ALREADY_AUTH_PHONENUMBER); //이미 인증된 전화번호입니다.
            }
        }
        connection.release();
        return response(baseResponse.USER_PHONENUMBER_AUTH_SUCCESS);
    // } catch (err) {
    //   logger.error(`App - PhoneVerify Service error\n: ${err.message}`);
    //   return errResponse(baseResponse.PHONENUMBER_AUTH_ERROR);
    // }
};

// 로그아웃
exports.deleteJWT = async function(userIdx) {
    try {
        const connection = await pool.getConnection(async(conn) => conn);
        const deleteJWTResult = await userDao.deleteJWT(connection, userIdx);
        connection.release();

        return response(baseResponse.USER_LOGOUT_SUCCESS);
    } catch (err) {
        logger.error(`App - deleteJWT Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 탈퇴
exports.secession = async function(userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        connection.beginTransaction();
        const deleteUserResult = await userDao.secession(connection, userIdx);
        const deleteJWTResult = await userDao.deleteJWT(connection, userIdx);
        connection.commit();
        connection.release();

        return response(baseResponse.USER_SECESSION_SUCCESS, {"userIdx": userIdx});
    } catch (err) {
        logger.error(`App - withDrawUser Service error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 프로필 수정
exports.editProfile = async function(userIdx, profileImage, locationName, job, language) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const editProfileResult = await userDao.updateProfile(connection, userIdx, profileImage,locationName, job, language);
        connection.release();

        return response(baseResponse.USER_MYPROFIlE_PATCH_SUCCESS);
    } catch (err) {
        logger.error(`App - editProfile Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 개인정보 수정
exports.editPrivacy = async function(userIdx,  name, lastName, gender, birthday ) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const editProfileResult = await userDao.updatePrivacy(connection, userIdx,  name, lastName, gender, birthday);
        connection.release();

        return response(baseResponse.USER_PRIVACY_PATCH_SUCCESS);
    } catch (err) {
        logger.error(`App - editProfile Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 신고하기 API
exports.insertReports = async function (reportIdx, userIdxFromJWT, userIdx) {
    try {
        const checkReportingUsers = await userProvider.checkUsers(userIdxFromJWT);
        if(checkReportingUsers.length === 0 || checkReportingUsers[0].status === 'N') return errResponse(baseResponse.REPORTING_USER_ERROR);
        const checkReportedUsers = await userProvider.checkUsers(userIdx);
        if(checkReportedUsers.length === 0 || checkReportedUsers[0].status === 'N') return errResponse(baseResponse.REPORTED_USER_ERROR);
        const checkReports = await userProvider.checkReports(userIdxFromJWT, userIdx);
        if(checkReports.length > 0 && checkReports[0].status === 'Y') return errResponse(baseResponse.REPORT_ALREADY_EXIST);

        const connection = await pool.getConnection(async (conn) => conn);
        const insertReportResult = await userDao.insertReports(connection, reportIdx, userIdxFromJWT, userIdx);

        return response(baseResponse.USER_REPORT_SUCCESS, {'idx':insertReportResult[0].insertId});

    } catch (err) {
        logger.error(`App - insertReports Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 상세 신고 API
exports.editReports = async function(reportIdx, userIdxFromJWT, userIdx) {
    try {
        const checkReportingUsers = await userProvider.checkUsers(userIdxFromJWT);
        if(checkReportingUsers.length === 0 || checkReportingUsers[0].status === 'N') return errResponse(baseResponse.REPORTING_USER_ERROR);
        const checkReportedUsers = await userProvider.checkUsers(userIdx);
        if(checkReportedUsers.length === 0 || checkReportedUsers[0].status === 'N') return errResponse(baseResponse.REPORTED_USER_ERROR);
        const checkReports = await userProvider.checkReports(userIdxFromJWT, userIdx);
        if(checkReports.length === 0 || checkReports[0].status === 'N') return errResponse(baseResponse.REPORT_NOT_EXIST);

        const connection = await pool.getConnection(async (conn) => conn);
        const editReportResult = await userDao.updateReports(connection, reportIdx, userIdxFromJWT, userIdx);
        connection.release();

        return response(baseResponse.USER_DETAIL_REPORT_SUCCESS);
    } catch (err) {
        logger.error(`App - editProfile Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
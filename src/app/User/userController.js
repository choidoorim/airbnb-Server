const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const secret_config = require("../../../config//secret");
const { response, errResponse } = require("../../../config/response");
const request = require("request");

const { smtpTransport } = require("../../../config/email.js");
const crypto = require("crypto");
const cache = require("memory-cache"); 
const nodeCache = require('node-cache');
const ncache = new nodeCache(); 
const jwt = require("jsonwebtoken");

const { emit } = require("nodemon");

const regexEmail = require("regex-email");
const regexPassword = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,}$/;
const regexPhoneNumber = /^01([0|1|6|7|8|9]?)([0-9]{3,4})([0-9]{4})$/; 
//^\d{3}-\d{3,4}-\d{4}$/; /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;

const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy
const axios = require('axios');

const { pool } = require("../../../config/database");
const userDao = require("../../app/User/userDao");

/*
    API No. 
    API Name : 휴대전화 회원가입 API
    [POST] /app/users-phone
*/
exports.postPhoneUsers = async function(req, res) {
    /*
        Body : email
    */
    var {phoneNumber, name, lastName, birthday, email} = req.body;

    if (!phoneNumber) return res.send(response(baseResponse.SIGNUP_PHONENUMBER_EMPTY));
    //번호 정규표현식 체크
    if (!regexPhoneNumber.test(phoneNumber))
      return res.send(response(baseResponse.SIGNUP_PHONENUMBER_ERROR_TYPE));
    
    if (!name) {
        return res.send(response(baseResponse.SIGNUP_NAME_EMPTY));
    } else if (!lastName) {
        return res.send(response(baseResponse.SIGNUP_LASTNAME_EMPTY));
    } else if (!birthday) {
        return res.send(response(baseResponse.SIGNUP_BIRTHDAY_EMPTY));
    } 

    // TODO: birthday - 18세 이상의 성인만 가입 가능
    const birthdaySplit = birthday.split("-"); // 생일 split
    var now = new Date();	// 현재 날짜 및 시간
    var nowYear = now.getFullYear();	// 현재 연도

    if (nowYear-birthdaySplit[0]+1 < 18){
        return res.send(response(baseResponse.SIGNUP_BIRTHDAY_ERROR_TYPE));
    }

    if (!email) {
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
    } else if (email.length > 30) {
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
    } else if (!regexEmail.test(email)) {
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));
    }

    const signUpResponse = await userService.createPhoneUser(
        phoneNumber, name, lastName, birthday, email
    );

    return res.send(signUpResponse);

};

/*
    API No. 
    API Name : 이메일 회원가입 API
    [POST] /app/users-email
*/
exports.postEmailUsers = async function(req, res) {
    /*
        Body : email
    */
    let {name, lastName, birthday, email, password} = req.body;


    if (!name) {
        return res.send(response(baseResponse.SIGNUP_NAME_EMPTY));
    } else if (!lastName) {
        return res.send(response(baseResponse.SIGNUP_LASTNAME_EMPTY));
    } else if (!birthday) {
        return res.send(response(baseResponse.SIGNUP_BIRTHDAY_EMPTY));
    } 

    // TODO: birthday - 18세 이상의 성인만 가입 가능
    const birthdaySplit = birthday.split("-"); // 생일 split
    let now = new Date();	// 현재 날짜 및 시간
    let nowYear = now.getFullYear();	// 현재 연도
    
    if (nowYear-birthdaySplit[0]+1 < 18){
        return res.send(response(baseResponse.SIGNUP_BIRTHDAY_ERROR_TYPE));
    }
        

    if (!email) {
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
    } else if (email.length > 30) {
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
    } else if (!regexEmail.test(email)) {
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));
    }
    
    
    if (!password) {
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    } 


    if (password.length < 8){
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    } else if (!regexPassword.test(password)) {
        return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE));
    }

    const signUpResponse = await userService.createEmailUser(
        name, lastName, birthday, email, password
    );

    return res.send(signUpResponse);
};

/*
    API No. 
    API Name : 회원가입 정보 입력 API
    [POST] /app/users/:userIdx
*/
exports.patchUsers = async function(req, res) {
    // Path Variable : userIdx
    const userIdx = req.params.userIdx;

    /*
        Body : name, lastName, birthday, email
    */
    var {name, lastName, birthday, email} = req.body;


    if (!name) {
        return res.send(response(baseResponse.SIGNUP_NAME_EMPTY));
    } else if (!lastName) {
        return res.send(response(baseResponse.SIGNUP_LASTNAME_EMPTY));
    } else if (!birthday) {
        return res.send(response(baseResponse.SIGNUP_BIRTHDAY_EMPTY));
    }

    // 18세 이상의 성인만 가입 가능
    const birthdaySplit = birthday.split("-"); // 생일 split
    var now = new Date();	// 현재 날짜 및 시간
    var nowYear = now.getFullYear();	// 현재 연도
    
    if (nowYear-birthdaySplit[0]+1 < 18){
        return res.send(response(baseResponse.SIGNUP_BIRTHDAY_ERROR_TYPE));
    }

    if (!email) {
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
    } else if (email.length > 30) {
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
    } else if (!regexEmail.test(email)) {
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));
    }

    const signUpResponse = await userService.editUser(
        userIdx, name, lastName, birthday, email
    );

    return res.send(signUpResponse);

};

/**
 * API No. 인증문자 전송
 * [POST] /app/users/phone-check
 */
 exports.postPhoneCheck = async function (req, res) {
    const { phoneNumber } = req.body;
  
    if (!phoneNumber) return res.send(response(baseResponse.SIGNUP_PHONENUMBER_EMPTY));
  
    //번호 정규표현식 체크
    if (!regexPhoneNumber.test(phoneNumber))
      return res.send(response(baseResponse.SIGNUP_PHONENUMBER_ERROR_TYPE));
  
    const number = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  
    cache.del(phoneNumber);
    cache.put(phoneNumber, number);
  
    console.log(cache.get(phoneNumber));
  
    const space = " "; // one space
    const newLine = "\n"; // new line
    const method = "POST"; // method
    const serviceId = "ncp:sms:kr:267843741140:airbnb";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;
    const url2 = `/sms/v2/services/${serviceId}/messages`;
    const timestamp = Date.now().toString();
    let message = [];
    let hmac = crypto.createHmac("sha256", secret_config.SENS_SECRET_KEY); 
  
    message.push(method);
    message.push(space);
    message.push(url2);
    message.push(newLine);
    message.push(timestamp);
    message.push(newLine);
    message.push(secret_config.SENS_ACCESS_KEY_ID);
    const signature = hmac.update(message.join("")).digest("base64");
  
    try {
      request({
        method: method,
        json: true,
        uri: url,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "x-ncp-iam-access-key": secret_config.SENS_ACCESS_KEY_ID,
          "x-ncp-apigw-timestamp": timestamp,
          "x-ncp-apigw-signature-v2": signature.toString(),
        },
        body: {
          type: "SMS",
          contentType: "COMM",
          countryCode: "82",
          from: secret_config.SENS_PHONE,
          content: `Airbnb 확인코드: [${number}]. 이 코드를 다른 사람과 공유하지 마십시오.`,
          messages: [
            {
              to: `${phoneNumber}`,
            },
          ],
        },
      });
      return res.send(response(baseResponse.USER_PHONENUMBER_SEND_SUCCESS, {"authNumber": number}));
    } catch (err) {
      cache.del(phoneNumber);
      return res.send(response(baseResponse.USER_PHONENUMBER_SEND_SUCCESS, {"authNumber": number}));
    }
};

/** 인증문자 검증
 * [POST] /app/users/phone-check
 */
exports.phoneCheck = async function (req, res) {
//const userIdResult = req.verifiedToken.userId;

    const { phoneNumber , verifyCode } = req.body;

    if (!phoneNumber) return res.send(response(baseResponse.SIGNIN_PHONENUMBER_EMPTY));
    if (!verifyCode)
        return res.send(response(baseResponse.PHONENUMBER_VEFIRY_CODE_EMPTY));
    if (verifyCode >= 10000)
        return res.send(response(baseResponse.PHONENUMBER_VEFIRY_CODE_LENGTH));

    //번호 정규표현식 체크
    if (!regexPhoneNumber.test(phoneNumber))
        return res.send(response(baseResponse.SIGNIN_PHONENUMBER_ERROR_TYPE));

    const CacheData = cache.get(phoneNumber);

    if (!CacheData) {
        return res.send(response(baseResponse.SMS_NOT_MATCH));
    }

    if (CacheData != verifyCode) {
        return res.send(response(baseResponse.SMS_NOT_MATCH));
    }

    const phoneVerifyResponse = await userService.postPhoneVerify(phoneNumber);
    return res.send(phoneVerifyResponse);

};

/*
    API No. 
    API Name : 이메일 인증 API
    [POST] /app/auth/email-send
*/
exports.authSendEmail = function(req, res) {
    /*
        Body : snedEmail
    */
    const authNum = Math.floor((Math.random() * (999999 - 100000 + 1)) + 100000);

    const { sendEmail } = req.body;

    // Validation 처리
    if (!sendEmail) {
        return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY));
    } else if (sendEmail.length > 30) {
        return res.send(response(baseResponse.SIGNIN_EMAIL_LENGTH));
    } else if (!regexEmail.test(sendEmail)) {
        return res.send(response(baseResponse.SIGNIN_EMAIL_ERROR_TYPE));
    }

    // TODO 이메일을 가지고 있는 유저 있는지 확인
    
    const mailOptions = {
        from: "wdh1121@naver.com",
        to: sendEmail,
        subject: "[에어비앤비] 인증 관련 이메일 입니다.",
        text: `[인증번호] ${authNum}`
    };

    const result = smtpTransport.sendMail(mailOptions, (error, responses) => {
        if (error) {
            console.log(error);
            smtpTransport.close();
            return res.send(response(baseResponse.SERVER_ERROR));
        } else {
            smtpTransport.close();
            
            // 캐시 데이터 저장
            ncache.set(sendEmail, authNum, 600);

            return res.send(response(baseResponse.USER_EMAIL_SEND_SUCCESS, {"authNumber": authNum}));
        }
    });
}

/*
    API No. 
    API Name : 이메일 검증 API
    [POST] /app/auth/email-check
*/
exports.emailVerify = async function (req, res) {
    //const email = req.query.email;

    const { email , verifyCode } = req.body;

    if (!email) {
        return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY));
    } else if (email.length > 30) {
        return res.send(response(baseResponse.SIGNIN_EMAIL_LENGTH));
    } else if (!email.test(sendEmail)) {
        return res.send(response(baseResponse.SIGNIN_EMAIL_ERROR_TYPE));
    }
    if (!verifyCode)
        return res.send(response(baseResponse.EMAIL_VEFIRY_CODE_EMPTY));
    if (verifyCode >= 100000)
        return res.send(response(baseResponse.EMAIL_VEFIRY_CODE_LENGTH));

    //번호 정규표현식 체크
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNIN_EMAIL_ERROR_TYPE));

    const CacheData = ncache.get(email);

    if (!CacheData) {
        return res.send(response(baseResponse.EMAIL_NOT_MATCH));
    }

    if (CacheData != verifyCode) {
        return res.send(response(baseResponse.EMAIL_NOT_MATCH));
    }
  
    const emailVerifyResponse = await userService.postEmailVerify(email);
    return res.send(emailVerifyResponse);
};

/*
    API No. 
    API Name : 휴대전화 로그인 API
    [POST] /app/login
    body : phoneNumber
*/
exports.phoneLogin = async function(req, res) {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.send(response(baseResponse.SIGNIN_PHONENUMBER_EMPTY));
    } 

    const signInResponse = await userService.postPhoneSignIn(phoneNumber);

    return res.send(signInResponse);
};

/*
    API No. 
    API Name : 이메일 로그인 API
    [POST] /app/login
    body : email, password
*/
exports.emailLogin = async function(req, res) {
    const { email, password } = req.body;

    if (!email) {
        return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY));
    } else if (!password) {
        return res.send(response(baseResponse.SIGNIN_PASSWORD_EMPTY));
    } 
    const signInResponse = await userService.postEmailSignIn(email, password);

    return res.send(signInResponse);
};

/*
    API No. 
    API Name : 자동 로그인 API
    [GET] /app/auto-login
*/
exports.check = async function (req, res) {
    // jwt - userIdx

    const userIdxFromJWT = req.verifiedToken.userIdx;

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdxFromJWT);

    //console.log(token)
    //console.log(checkJWT[0].jwt);

    if (!userIdxFromJWT) {
        return res.send(errResponse(baseResponse.TOKEN_EMPTY));
    } else if (token == checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_AUTO_SIGNIN_SUCCESS, {"userIdx": userIdxFromJWT}));
    } else {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

};

/*
    API No. 
    API Name : 로그아웃 API
    [GET] /app/logout
*/
exports.logout = async function(req, res) {
    const userIdxFromJWT = req.verifiedToken.userIdx;

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdxFromJWT);

    if (checkJWT.length < 1) {
        return res.send(response(baseResponse.NOT_LOGIN));
    } else if (token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    const logoutResponse = await userService.deleteJWT(userIdxFromJWT);

    return res.send(logoutResponse);
}

/*
    API No. 
    API Name : 탈퇴하기 API
    [PATCH] /app/users/{userIdx}/secession
*/
exports.secession = async function(req, res) {
    // Path Varialble : userIdx
    const userIdx = req.params.userIdx;

    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);

    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    }

    const secessionResponse = await userService.secession(userIdx);

    return res.send(secessionResponse);
};

/*
    API No.
    API Name : 유저 프로필 조회 API
    [GET] /app/users/profile?userIdx=
*/
exports.getProfile = async function(req, res) {
    // Query : userIdx
    const userIdx = req.query.userIdx;
    
    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    } 
    const userProfileResult = await userProvider.retrieveProfile(userIdx);

    return res.send(userProfileResult);
};

/*
    API No.
    API Name : 유저 리뷰 조회 API
    [GET] /app/users/review?userIdx=
*/
exports.getReview = async function(req, res) {
    // Query : userIdx
    const userIdx = req.query.userIdx;
    
    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    } 
    const userProfileResult = await userProvider.retrieveReview(userIdx);

    return res.send(userProfileResult);
};

/*
    API No.
    API Name : 유저 프로필 수정 페이지 조회 API
    [GET] /app/users/{userIdx}/myprofile
*/
exports.getMyProfile = async function(req, res) {
    // Path Variable : userIdx
    const userIdx = req.params.userIdx;
    
    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    } 

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    } 

    const userProfileResult = await userProvider.retrieveMyProfile(userIdx);

    return res.send(userProfileResult);
};

/*
    API No. 
    API Name : 프로필 수정 API
    [PATCH] /app/users/{userIdx}/profile
*/
exports.patchMyProfile = async function(req, res) {
    // Path Variable : userIdx
    const userIdx = req.params.userIdx;

    /*
        Body : profileImage,locationName,job,language
    */
    const { profileImage,locationName,job,language } = req.body;

    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    } 

    if (!profileImage) {
        return res.send(response(baseResponse.PROFILE_PROFILEIMG_EMPTY));
    } else if (!locationName) {
        return res.send(response(baseResponse.PROFILE_LOCATIONNAME_EMPTY));
    } else if (!job) {
        return res.send(response(baseResponse.PROFILE_JOB_EMPTY));
    } else if (!language) {
        return res.send(response(baseResponse.PROFILE_LANGUAGE_EMPTY));
    }

    const editProfileResult = await userService.editProfile(userIdx, profileImage,locationName,job,language);
    return res.send(editProfileResult);
};

/*
    API No.
    API Name : 유저 개인정보 조회 API
    [GET] /app/users/:userIdx/privacy
*/
exports.getPrivacy = async function(req, res) {
    // Path Variable : userIdx
    const userIdx = req.params.userIdx;
    
    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    } 
    const userPrivacyResult = await userProvider.retrievePrivacy(userIdx);

    return res.send(userPrivacyResult);
};

/*
    API No. 
    API Name : 개인정보 수정 API
    [PATCH] /app/users/{userIdx}/privacy
*/
exports.patchPrivacy = async function(req, res) {

    // Path Variable : userIdx
    const userIdx = req.params.userIdx;

    /*
        Body : name, lastName, gender, birthday, email
    */
    const { name, lastName, gender, birthday } = req.body;

    if (!userIdx) {
        return res.send(response(baseResponse.USER_USERIDX_EMPTY));
    }

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(userIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    } 

    if (!name) {
        return res.send(response(baseResponse.PRIVACY_NAME_EMPTY));
    } else if (!lastName) {
        return res.send(response(baseResponse.PRIVACY_LASTNAME_EMPTY));
    } else if (!gender) {
        return res.send(response(baseResponse.PRIVACY_GENDER_EMPTY));
    } else if (!birthday) {
        return res.send(response(baseResponse.PRIVACY_BIRTHDAY_EMPTY));
    }

    const editProfileResult = await userService.editPrivacy(userIdx, name, lastName, gender, birthday);
    return res.send(editProfileResult);
};

/**
 * API No.
 * API Name : 유저 신고 API
 * [POST] /app/users/reports
 **/
 exports.postUserReport = async function (req, res) {

    // Path Variable : userIdx
    const pathUserIdx = req.params.userIdx;
    // body
    const {reportIdx, userIdx} = req.body;

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(pathUserIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    } 
    const userIdxFromJWT = req.verifiedToken.userIdx;

    if (!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY))
    if (!reportIdx) return res.send(errResponse(baseResponse.USER_REPORT_IDX_EMPTY))
    if (reportIdx > 15 || reportIdx < 13) return res.send(errResponse(baseResponse.USER_REPORT_IDX_LENGTH))

    const insertReportResult = await userService.insertReports(reportIdx, userIdxFromJWT, userIdx);

    return res.send(insertReportResult);
};

/**
 * API No.
 * API Name : 유저 상세 신고 API
 * [PATCH] /app/users/reports
 **/
 exports.patchUserReport = async function (req, res) {

    // Path Variable : userIdx
    const pathUserIdx = req.params.userIdx;
    // Body
    const {reportIdx, userIdx} = req.body;

    const token = req.headers['x-access-token'];
    const checkJWT = await userProvider.checkJWT(pathUserIdx);
    if (checkJWT.length < 1 || token != checkJWT[0].jwt) {
        return res.send(response(baseResponse.USER_IDX_NOT_MATCH));
    } 
    const userIdxFromJWT = req.verifiedToken.userIdx;

    if (!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY))
    if (!reportIdx) return res.send(errResponse(baseResponse.USER_REPORT_IDX_EMPTY))
    if (reportIdx > 19 || reportIdx < 16) return res.send(errResponse(baseResponse.USER_DETAIL_REPORT_IDX_LENGTH))

    const insertReportResult = await userService.editReports(reportIdx, userIdxFromJWT, userIdx);

    return res.send(insertReportResult);
};

/*
    API No. 
    API Name : 구글 로그인 API
    [GET] /app/auth/google
*/
exports.google = async function (req, res, next) { passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email'] })(req, res, next); };

exports.googleSingIn = async function (req, res, next) {
  passport.authenticate('google', async (authError, user, info) => {
    console.log(user);
    email = user;

    if (user.length < 1) { //유저정보가 없다면 
        return errResponse(baseResponse.GOOGLE_SIGNIN_ERROR); // 로그인 실패
    }
    const emailRows = await userProvider.emailCheck(email);
    if (emailRows.length < 1) { // 회원가입 + 로그인
        const googleSignUpResponse = await userService.createSocialUser(email);
        const googleSignInResponse = await userService.postSocialSignIn(email);
        return res.send(googleSignInResponse);
    } else { //로그인
        const googleSignInResponse = await userService.postSocialSignIn(email);
        return res.send(googleSignInResponse);
    }

  })(req, res, next)
}

/*
    API No. 
    API Name :카카오 로그인 API
    [GET] /app/auth/kakao
*/
exports.kakao = async function (req, res, next) { passport.authenticate('kakao')(req, res, next); };

exports.kakaoSignIn = async function (req, res, next) {
    passport.authenticate('kakao', async (authError, user, info) => {
      console.log(user);
      email = user;
  
      if (user.length < 1) { //유저정보가 없다면 
          return errResponse(baseResponse.KAKAO_SIGNIN_ERROR); // 로그인 실패
      }
      const emailRows = await userProvider.emailCheck(email);
      if (emailRows.length < 1) { // 회원가입 + 로그인
          const  kakaoSignUpResponse = await userService.createSocialUser(email);
          const kakaoSignInResponse = await userService.postSocialSignIn(email);
          return res.send(kakaoSignInResponse);
      } else { //로그인
          const kakaoSignInResponse = await userService.postSocialSignIn(email);
          return res.send(kakaoSignInResponse);
      }
  
    })(req, res, next)
}

/*
    API No. 
    API Name : 네이버 로그인 API
    [GET] /naverlogin
*/

exports.naver = async function (req, res, next) { passport.authenticate('naver')(req, res, next); };

exports.naverSignIn = async function (req, res, next) {
    passport.authenticate('naver', async (authError, user, info) => {
      console.log(user);
      email = user;
  
      if (user.length < 1) { //유저정보가 없다면 
          return errResponse(baseResponse.NAVER_SIGNIN_ERROR); // 로그인 실패
      }
      const emailRows = await userProvider.emailCheck(email);
      if (emailRows.length < 1) { // 회원가입 + 로그인
          const naverSignUpResponse = await userService.createSocialUser(email);
          const naverSignInResponse = await userService.postSocialSignIn(email);
          return res.send(naverSignInResponse);
      } else { //로그인
          const naverSignInResponse = await userService.postSocialSignIn(email);
          return res.send(naverSignInResponse);
      }
  
    })(req, res, next)
}

/*
exports.naverLogin = async function (req, res) { //계정 정보 가져오기
    const token = req.body.accessToken;
    const header = "Bearer " + token; //Bearer 다음에 공백 추가
    const api_url = "https://openapi.naver.com/v1/nid/me";
    const options = {
      url: api_url,
      headers: { Authorization: header },
    };
    request.get(options, async function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const obj = JSON.parse(body);
        const email = obj.response.email;
        const profile_img = obj.response.profile_image;
        const phone = obj.response.mobile;
        const name = obj.response.name;
  
        if (!email) return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
        if (!name) return res.send(response(baseResponse.SIGNUP_NAME_EMPTY));
  
        const signUpResponse = await userService.createNaverUser(
          email,
          name,
          phone,
          profile_img
        );
  
        return res.send(signUpResponse);
      } else {
        if (response != null) {
          res.send(errResponse(baseResponse.NAVER_SIGNIN_ERROR));
        }
      }
    });
};
*/
module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const passport = require('passport');

    // 휴대전화 회원가입 API //중복 체크도 해주기
    app.post('/app/users-phone', user.postPhoneUsers);

    // 이메일 회원가입 API
    app.post('/app/users-email', user.postEmailUsers);

    // 회원가입 정보 입력 API
    app.patch('/app/users/:userIdx', user.patchUsers); 

    // 전화번호 인증 API 
    app.post("/app/auth/sms-send", user.postPhoneCheck);

    // 전화번호 검증 API 
    app.get("/app/auth/sms-check", user.phoneCheck);

    // 이메일 인증 API 
    app.post('/app/auth/email-send', user.authSendEmail);

    // 이메일 검증 API 
    app.get("/app/auth/email-check", user.emailVerify);

    // 유저 전화번호 로그인 API
    app.post('/app/phone-login', user.phoneLogin);

    // 유저 이메일 로그인 API
    app.post('/app/email-login', user.emailLogin);

    // 유저 자동로그인 API
    app.get('/app/auto-login', jwtMiddleware, user.check);

    // 유저 로그아웃 API
    app.get('/app/logout', jwtMiddleware, user.logout);

    // 유저 탈퇴 API
    app.patch('/app/users/:userIdx/secession', jwtMiddleware, user.secession);
    
    // 유저 프로필 조회 API 
    app.get('/app/users/profile', jwtMiddleware, user.getProfile);

    // 유저 리뷰 조회 API 
    app.get('/app/users/review', jwtMiddleware, user.getReview);

    // 유저 프로필 수정 페이지 조회 API
    app.get('/app/users/:userIdx/myprofile', jwtMiddleware,  user.getMyProfile);

    // 유저 프로필 수정 API
    app.patch('/app/users/:userIdx/myprofile', jwtMiddleware, user.patchMyProfile);

    // 유저 개인정보 조회 API
    app.get('/app/users/:userIdx/privacy', jwtMiddleware,  user.getPrivacy);

    // 유저 개인정보 수정 API
    app.patch('/app/users/:userIdx/privacy', jwtMiddleware, user.patchPrivacy);

    // 유저 신고 API
    app.post('/app/users/:userIdx/report', jwtMiddleware, user.postUserReport);

    // 유저 상세 신고 API
    app.patch('/app/users/:userIdx/report', jwtMiddleware, user.patchUserReport);

    // 유저 구글 로그인 API
    app.get('/auth/google', user.google);
    app.get('/auth/google/callback', user.googleSingIn);

    // 카카오 로그인 API   
    app.get('/auth/kakao', user.kakao);
    app.get("/auth/kakao/callback", user.kakaoSignIn);

    // 유저 네이버 로그인 API
    app.get('/auth/naver', user.naver);
    app.get('/auth/naver/callback', user.naverSignIn);

};
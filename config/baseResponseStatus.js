module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // User Success
    USER_SIGNUP_SUCCESS : { "isSuccess": true, "code": 1000, "message":"회원가입 성공" },
    USER_SIGNIN_SUCCESS : { "isSuccess": true, "code": 1000, "message":"로그인 성공" },
    USER_AUTO_SIGNIN_SUCCESS : { "isSuccess": true, "code": 1000, "message":"자동 로그인 성공" },
    USER_PHONENUMBER_SEND_SUCCESS : { "isSuccess": true, "code": 1000, "message":"인증번호 전송 성공" },
    USER_PHONENUMBER_AUTH_SUCCESS : { "isSuccess": true, "code": 1000, "message":"전화번호 인증 성공" },
    USER_EMAIL_SEND_SUCCESS : { "isSuccess": true, "code": 1000, "message":"인증메일 전송 성공" },
    USER_EMAIL_AUTH_SUCCESS : { "isSuccess": true, "code": 1000, "message":"메일 인증 성공" },
    USER_LOGOUT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"로그아웃 성공" },
    USER_SECESSION_SUCCESS : { "isSuccess": true, "code": 1000, "message":"회원 탈퇴 성공" },
    USER_PROFIlE_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"프로필 조회 성공" },
    USER_REVIEW_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"리뷰 조회 성공" },
    USER_MYPROFIlE_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"내 프로필 조회 성공" },
    USER_MYPROFIlE_PATCH_SUCCESS : { "isSuccess": true, "code": 1000, "message":"내 프로필 수정 성공" },
    USER_PRIVACY_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"개인정보 조회 성공" },
    USER_PRIVACY_PATCH_SUCCESS : { "isSuccess": true, "code": 1000, "message":"개인정보 수정 성공" },
    USER_REPORT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"유저 신고 성공" },
    USER_DETAIL_REPORT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"유저 상세 신고 성공" },

    // Rooms Success
    USER_SUCCESS : { "isSuccess": true, "code": 1000, "message":"숙소 조회 성공" },
    ROOMS_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"숙소 조회 성공" },
    ROOMS_CONTENTS_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"숙소 상세 조회 성공" },
    ROOMS_REVIEWS_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"숙소 리뷰 조회 성공" },
    ROOMS_RESERVATION_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"예약 현황 조회 성공" },
    ROOMS_RESERVATION_INFO_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"예약 정보 조회 성공" },
    ROOMS_RESERVATION_INSERT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"예약 성공" },
    ROOMS_RESERVATION_INSERT_EMAIL_SUCCESS : { "isSuccess": true, "code": 1000, "message":"예약 성공(Email 전송)" },
    HOST_ROOMS_RESERVATION_CONFIRM_SUCCESS : { "isSuccess": true, "code": 1000, "message":"예약 확정 성공" },
    USER_RESERVATION_SELECT : { "isSuccess": true, "code": 1000, "message":"유저 예약 정보 조회 성공" },
    ROOM_LIKE_STATUS_SUCCESS : { "isSuccess": true, "code": 1000, "message":"찜 변경(등록) 성공" },
    ROOM_REPORT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"숙소 신고 성공" },
    DELETE_RESERVATION_SUCCESS : { "isSuccess": true, "code": 1000, "message":"예약 취소 성공" },
    SELECT_HOST_INFO_SUCCESS : { "isSuccess": true, "code": 1000, "message":"호스트 정보 조회 성공" },
    INSERT_ROOM_REVIEWS_SUCCESS : { "isSuccess": true, "code": 1000, "message":"숙소 리뷰 등록 성공" },
    INSERT_HOST_REVIEWS_SUCCESS : { "isSuccess": true, "code": 1000, "message":"호스트 리뷰 등록 성공" },
    ROOM_IMAGE_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"숙소 이미지 조회 성공" },

    // WishList Success
    WISHLISTS_SELECT : { "isSuccess": true, "code": 1000, "message":"위시리스트 조회 성공" },
    WISHLIST_INSERT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"위시리스트 등록 성공" },
    LIKE_ROOM_LOCATION_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"찜한 숙소 위치 조회 성공" },
    WISHLISTS_CONTENTS_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"위시리스트 내역 조회 성공" },
    WISHLISTS_SET_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"위시리스트 설정 조회 성공" },
    WISHLISTS_SET_UPDATE_SUCCESS : { "isSuccess": true, "code": 1000, "message":"위시리스트 설정 수정 성공" },
    WISHLISTS_DELETE_SUCCESS : { "isSuccess": true, "code": 1000, "message":"위시리스트 삭제 성공" },
    WISHLISTS_DATE_UPDATE_SUCCESS : { "isSuccess": true, "code": 1000, "message":"위시리스트 날짜 수정 성공" },
    WISHLISTS_PERSON_UPDATE_SUCCESS : { "isSuccess": true, "code": 1000, "message":"위시리스트 인원 수정 성공" },
    
    // Trip Success
    TRIP_PAST_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"이전 예약 조회 성공" },
    TRIP_FUTURE_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"예정된 예약 조회 성공" },
    RESERVATION_INFO_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"예약된 숙소 정보 조회 성공" },
    RESERVATION_UPDATE_SUCCESS : { "isSuccess": true, "code": 1000, "message":"숙소 예약변경 성공" },

    // Chat Success
    CHAT_INFO_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"채팅방 정보 조회 성공" },
    CHATROOM_INSERT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"채팅방 생성 성공" },
    CHAT_INSERT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"채팅 생성 성공" },
    CHATROOM_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"채팅방 조회 성공" },
    CHAT_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"채팅 조회성공" },
    
    // Search Success
    SEARCH_SELECT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"검색 기록 조회 성공" },
    SEARCH_INSERT_SUCCESS : { "isSuccess": true, "code": 1000, "message":"검색 기록 등록 성공" },
    
    // Experience Success
    EXPERIENCE_LIKE_STATUS_SUCCESS : { "isSuccess": true, "code": 1000, "message":"체험 찜 변경(등록) 성공" },
    
    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    // USER Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 최소 8자 이상 필요합니다." },
    SIGNUP_PHONENUMBER_EMPTY : { "isSuccess": false, "code": 2006, "message":"전화번호를 입력해주세요." },
    SIGNUP_PHONENUMBER_ERROR_TYPE : { "isSuccess": false,"code": 2007,"message":"유효하지 않은 전화번호" },

    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERIDX_EMPTY : { "isSuccess": false, "code": 2012, "message": "userIdx를 입력해주세요." },
    USER_USERIDX_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_IDX_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "userIdx를 확인해주세요." },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },

    SIGNUP_NAME_EMPTY : { "isSuccess": false, "code": 2019, "message": "이름을 입력해주세요." },
    SIGNUP_LASTNAME_EMPTY : { "isSuccess": false, "code": 2020, "message":"성을 입력해주세요." },
    SIGNUP_BIRTHDAY_EMPTY : { "isSuccess": false, "code": 2021, "message":"생일을 입력해주세요." },

    SIGNUP_NAME_ERROR_TYPE : { "isSuccess": false, "code": 2022, "message":"정부 발급 신분증에 표시된 이름과 일치하는지 확인하세요." },
    SIGNUP_BIRTHDAY_ERROR_TYPE : { "isSuccess": false, "code": 2023, "message":"만 18세 이상의 성인만 회원으로 가입할 수 있습니다." },
    SIGNUP_PASSWORD_ERROR_TYPE : { "isSuccess": false, "code": 2024, "message":"기호나 숫자가 하나 이상 들어가야 합니다." },

    SIGNIN_PHONENUMBER_EMPTY : { "isSuccess": false, "code": 2025, "message":"전화번호를 입력해주세요" },
    SIGNIN_PHONENUMBER_ERROR_TYPE : { "isSuccess": false, "code": 2026, "message":"유효하지 않은 전화번호" },

    PROFILE_PROFILEIMG_EMPTY : { "isSuccess": true, "code": 2030, "message":"프로필 이미지를 입력해주세요." },
    PROFILE_LOCATIONNAME_EMPTY : { "isSuccess": true, "code": 2031, "message":"거주지를 입력해주세요." },
    PROFILE_JOB_EMPTY : { "isSuccess": true, "code": 2032, "message":"직업을 입력해주세요." },
    PROFILE_LANGUAGE_EMPTY : { "isSuccess": true, "code": 2033, "message":"언어를 입력해주세요." },
    PRIVACY_NAME_EMPTY : { "isSuccess": true, "code": 2034, "message":"이름을 입력해주세요." },
    PRIVACY_LASTNAME_EMPTY : { "isSuccess": true, "code": 2035, "message":"성을 입력해주세요." },
    PRIVACY_GENDER_EMPTY : { "isSuccess": true, "code": 2036, "message":"성별을 입력해주세요." },
    PRIVACY_BIRTHDAY_EMPTY : { "isSuccess": true, "code": 2037, "message":"생일을 입력해주세요." },

    PHONENUMBER_VEFIRY_CODE_EMPTY : { "isSuccess": true, "code": 2040, "message":"휴대폰으로 전송된 인증번호를 입력해주세요." },
    PHONENUMBER_VEFIRY_CODE_LENGTH : { "isSuccess": true, "code": 2041, "message":"입력할 수 있는 인증번호 길이를 초과했습니다." },
    EMAIL_VEFIRY_CODE_EMPTY : { "isSuccess": true, "code": 2042, "message":"이메일로 전송된 인증번호를 입력해주세요." },
    EMAIL_VEFIRY_CODE_LENGTH : { "isSuccess": true, "code": 2043, "message":"입력할 수 있는 인증번호 길이를 초과했습니다." },

    USER_REPORT_IDX_EMPTY : { "isSuccess": false, "code": 2050, "message": "reportIdx를 입력해주세요." },
    USER_REPORT_IDX_LENGTH  : { "isSuccess": false, "code": 2051, "message": "reportIdx는 13~15까지 입력해주세요." },
    USER_DETAIL_REPORT_IDX_LENGTH  : { "isSuccess": false, "code": 2052, "message": "reportIdx는 16~19까지 입력해주세요." },
    
    // Rooms Request error
    ROOM_ID_EMPTY : { "isSuccess": false, "code": 2100, "message": "room Idx를 입력해주세요.(Type: INT)" },
    LOCATION_NAME_EMPTY : { "isSuccess": false, "code": 2101, "message": "LocationName을 입력해주세요." },
    ADULT_NUM_LENGTH : { "isSuccess": false, "code": 2102, "message": "어른 수는 최소 1명, 16명이 최대입니다." },
    ADULT_EMPTY : { "isSuccess": false, "code": 2107, "message": "어른 수를 입력해주세요." },
    CHILD_NUM_LENGTH : { "isSuccess": false, "code": 2103, "message": "어린이 수는 5명이 최대입니다." },
    CHILD_EMPTY : { "isSuccess": false, "code": 2108, "message": "어린이 수를 입력해주세요." },
    INFANT_NUM_LENGTH : { "isSuccess": false, "code": 2104, "message": "유아 수는 5명이 최대입니다." },
    INFANT_EMPTY : { "isSuccess": false, "code": 2109, "message": "유아 수를 입력해주세요." },
    START_DATE_EMPTY : { "isSuccess": false, "code": 2105, "message": "시작일을 입력해주세요." },
    END_DATE_EMPTY : { "isSuccess": false, "code": 2106, "message": "종료일을 입력해주세요." },
    STATUS_EMPTY : { "isSuccess": false, "code": 2110, "message": "상태 값을 입력해주세요." },
    BUSINESS_STATUS_TYPE : { "isSuccess": false, "code": 2111, "message": "비지니스 여부 상태 값 형식을 정확하게 입력해주세요.(Y/N)" },
    PAYMENT_STATUS_TYPE : { "isSuccess": false, "code": 2112, "message": "지불 방법 여부 상태 값 형식을 정확하게 입력해주세요.(Y/N)" },
    PAYMENT_STATUS_EMPTY : { "isSuccess": false, "code": 2113, "message": "지불방법 상태 값을 입력해주세요." },
    SELECT_ROOMS_ERR : { "isSuccess": false, "code": 2114, "message": "숙소 조회 로직을 확인해주세요." },
    DATE_TYPE : { "isSuccess": false, "code": 2115, "message": "날짜 타입을 정확하게 입력해주세요.(0000-00-00)" },
    PAYMENT_PRICE : { "isSuccess": false, "code": 2116, "message": "지불 금액을 입력해주세요." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2117, "message": "Token ID값과  유저 ID값이 다릅니다." },
    RESERVATION_ID_EMPTY : { "isSuccess": false, "code": 2120, "message": "reservationIdx를 입력해주세요." },
    REPORT_ID_EMPTY : { "isSuccess": false, "code": 2121, "message": "reportId를 입력해주세요." },
    REPORT_ID_LENGTH : { "isSuccess": false, "code": 2122, "message": "reportId는 1~5까지 입력해주세요." },
    ACCURACY_GRADE_EMPTY : { "isSuccess": false, "code": 2121, "message": "accuracyGrade를 입력해주세요." },
    COMMUNICATION_GRADE_EMPTY : { "isSuccess": false, "code": 2122, "message": "communicationGrade를 입력해주세요." },
    CHECKIN_GRADE_EMPTY : { "isSuccess": false, "code": 2123, "message": "checkinGrade를 입력해주세요." },
    CLEANLINESS_GRADE_EMPTY : { "isSuccess": false, "code": 2124, "message": "cleanlinessGrade를 입력해주세요." },
    LOCATION_GRADE_EMPTY : { "isSuccess": false, "code": 2125, "message": "locationGrade를 입력해주세요." },
    PRICE_SATISFACTION_GRADE_EMPTY : { "isSuccess": false, "code": 2126, "message": "priceSatisfactionGrade를 입력해주세요." },
    GRADE_LENGTH : { "isSuccess": false, "code": 2127, "message": "평점은 1 ~ 5를 입력해주세요." },
    REVIEWS_CONTENTS_EMPTY : { "isSuccess": false, "code": 2128, "message": "리뷰 내용을 입력해주세요." },
    HOST_USERIDX_EMPTY : { "isSuccess": false, "code": 2129, "message": "HOST 유저IDX를 입력해주세요." },

    // WishList Request error
    WISH_ID_EMPTY : { "isSuccess": false, "code": 2119, "message": "wishIdx를 입력해주세요." },
    WISH_NAME_EMPTY : { "isSuccess": false, "code": 2118, "message": "wishListName을 입력해주세요." },
    SEE_STATUS_EMPTY : { "isSuccess": false, "code": 2130, "message": "seeWishStatus를 입력해주세요." },

    // Chat Request error
    CHAT_ROOMIDX_EMPTY : { "isSuccess": false, "code": 2230, "message": "roomIdx를 입력해주세요." },
    CHAT_CONTENT_EMPTY : { "isSuccess": false, "code": 2231, "message": "내용을 입력해주세요." },
    CHAT_CHATROOMIDX_EMPTY : { "isSuccess": false, "code": 2232, "message": "chatRoomIdx를 입력해주세요." },

    // Experience Request error
    EXPERIENCE_ID_EMPTY : { "isSuccess": false, "code": 2240, "message": "experience ID를 입력해주세요." },

    // Response error
    // User Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_PHONENUMBER : { "isSuccess": false, "code": 3002, "message":"중복된 전화번호입니다." },

    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "이메일이 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_PHONENUMBER_WRONG : { "isSuccess": false, "code": 3005, "message": "전화번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_DELETED_ACCOUNT : { "isSuccess": false, "code": 3007, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    NOT_LOGIN : { "isSuccess": false, "code": 3008, "message": "로그인 되어 있지 않습니다." },
    ALREADY_LOGIN : { "isSuccess": false, "code": 3009, "message": "이미 로그인 되어 있습니다." },

    SMS_NOT_MATCH : { "isSuccess": false, "code": 3010, "message": "인증번호가 일치하지 않습니다." },
    EMAIL_NOT_MATCH : { "isSuccess": false, "code": 3011, "message": "인증번호가 일치하지 않습니다." },
    ALREADY_AUTH_PHONENUMBER : { "isSuccess": false, "code": 3011, "message": "이미 인증된 전화번호입니다." },
    ALREADY_AUTH_EMAIL : { "isSuccess": false, "code": 3012, "message": "이미 인증된 이메일입니다." },

    EMAIL_AUTH_ERROR : {"isSuccess": false, "code": 3013, "message": "이메일 인증 실패" },
    PHONENUMBER_AUTH_ERROR : { "isSuccess": false, "code": 3014, "message": "전화번호 인증 실패" },

    REPORTING_USER_ERROR : { "isSuccess": false, "code": 3015, "message": "신고자가 존재하지 않는 유저입니다." },
    REPORTED_USER_ERROR: { "isSuccess": false, "code": 3016, "message": "존재하지 않는 유저를 신고할 수 없습니다." },
    REPORT_ALREADY_EXIST : { "isSuccess": false, "code": 3017, "message": "신고 기록이 이미 있습니다." },
    REPORT_NOT_EXIST : { "isSuccess": false, "code": 3018, "message": "상세신고는 기타 신고 이후에 가능합니다." },

    GOOGLE_SIGNIN_ERROR : { "isSuccess": true, "code": 3020, "message":"구글 로그인 실패" },
    KAKAO_SIGNIN_ERROR : { "isSuccess": true, "code": 3030, "message":"카카오 로그인 실패" },
    NAVER_SIGNIN_ERROR : { "isSuccess": true, "code": 3040, "message":"네이버 로그인 실패" },

    // Rooms Response error
    ROOM_NOT_EXIST : { "isSuccess": false, "code": 3100, "message": "존재하지 않은 숙소입니다." },
    ROOM_MAX_PEOPLE : { "isSuccess": false, "code": 3101, "message": "예약할 수 있는 최대 등록 인원보다 큽니다." },
    ROOM_HOST_USER : { "isSuccess": false, "code": 3102, "message": "숙소의 호스트와 예약자가 같습니다." },
    ROOM_RESERVATION_EXITS : { "isSuccess": false, "code": 3103, "message": "이미 예약 된 숙소입니다." },
    NOT_HOST_USER : { "isSuccess": false, "code": 3106, "message": "호스트가 아닙니다." },
    USER_NOT_EXIST : { "isSuccess": false, "code": 3107, "message": "존재하지 않는 유저입니다." },
    RESERVATION_NOT_EXIST : { "isSuccess": false, "code": 3108, "message": "예약 정보가 존재하지 않습니다." },
    ALREADY_RESERVATION_STATUS : { "isSuccess": false, "code": 3109, "message": "이미 예약된 상태 입니다." },
    ALREADY_DELETE_RESERVATION_STATUS : { "isSuccess": false, "code": 3100, "message": "이미 취소 된 예약입니다." },
    NOT_ROOM_HOST_USER : { "isSuccess": false, "code": 3111, "message": "숙소의 호스트가 아닙니다." },
    NOT_RESERVATION_USER : { "isSuccess": false, "code": 3112, "message": "숙소를 예약한 유저가 아닙니다." },
    REVIEWS_ALREADY_EXIST : { "isSuccess": false, "code": 3113, "message": "이미 리뷰가 등록되어 있습니다." },

    // WishList Response error
    WISHLISTS_NOT_EXITS : { "isSuccess": false, "code": 3104, "message": "존재하지 않는 위시리스트입니다." },
    NOT_WISHLIST_USER : { "isSuccess": false, "code": 3105, "message": "위시리스트를 등록한 유저가 아닙니다." },
    NOT_EXIST_CHANGES : { "isSuccess": false, "code": 3120, "message": "변경 사항이 없습니다." },
    ALREADY_DELETE_WISHLISTS : { "isSuccess": false, "code": 3121, "message": "이미 삭제 된 위시리스트 입니다." },

    // Search Response error
    SEARCH_NOT_EXITS : { "isSuccess": false, "code": 3130, "message": "존재하지 않는 검색결과입니다." },

    // Trip Response error

    // Experience Response error
    EXPERIENCES_NOT_EXITS : { "isSuccess": false, "code": 3200, "message": "존재하지 않는 체험입니다." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
}

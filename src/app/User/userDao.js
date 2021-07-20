// 전화번호로 회원가입
async function insertPhoneUser(connection, insertUserParams) {
  const insertUserQuery = `
      INSERT INTO UserTB(phoneNumber, name, lastName, birthday, email)
      VALUES (?, ?, ?, ?, ?);
  `;
  const insertUserRow = await connection.query(
      insertUserQuery,
      insertUserParams
  );

  return insertUserRow;
}

// 이메일로 회원가입
async function insertEmailUser(connection, insertUserParams) {
  const insertUserQuery = `
      INSERT INTO UserTB(name, lastName, birthday, email, password, salt)
      VALUES (?, ?, ?, ?, ?, ?);
  `;
  const insertUserRow = await connection.query(
      insertUserQuery,
      insertUserParams
  );

  return insertUserRow;
}

// 소셜 회원가입
async function insertSocialUser(connection, email) {
  const insertUserQuery = `
      INSERT INTO UserTB(email, loginType)
      VALUES (?, 1);
  `;
  const insertUserRow = await connection.query(
      insertUserQuery,
      email
  );

  return insertUserRow;
}


// 회원가입, 유저 생성
async function updateUser(connection, userIdx, name, lastName, birthday, email) {
  const updateUserQuery = `
      UPDATE UserTB
      SET 
        name = '${name}',
        lastName = '${lastName}',
        birthday = '${birthday}',
        email = '${email}'
      WHERE idx = ${userIdx};
  `;
  const insertUserRow = await connection.query( updateUserQuery, userIdx, name, lastName, birthday, email);

  return insertUserRow;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email, idx, salt, password
                FROM UserTB 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// 전화번호로 회원 조회
async function selectUserPhoneNumber(connection, phoneNumber) {
  const selectUserphoneNumberQuery = `
                SELECT phoneNumber, idx
                FROM UserTB 
                WHERE phoneNumber = ?;
                `;
  const [phoneRows] = await connection.query(selectUserphoneNumberQuery, phoneNumber);
  return phoneRows;
}


// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectPhoneUserAccount(connection, phoneNumber) {
  const selectUserAccountQuery = `
        SELECT status, idx
        FROM UserTB
        WHERE phoneNumber = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      phoneNumber
  );
  return selectUserAccountRow[0];
}



// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectEmailUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, idx
        FROM UserTB
        WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}


// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT email, password
        FROM UserTB
        WHERE email = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 있는지 확인
async function selectUsers(connection, userIdx) {
  const checkUsersQuery = `
      SELECT idx, status
      FROM UserTB
      WHERE idx = ?;
  `;

  const checkUsersResult = await connection.query(
      checkUsersQuery,
      userIdx
  );

  return checkUsersResult[0];
}


// 로그인, jwt 가져오기
async function selectJWT(connection, userIdx) {
  const selectJWTQuery = `
              SELECT jwt, userIdx
              FROM Token
              WHERE userIdx = ?;
              `;
  const [selectJWTRow] = await connection.query(selectJWTQuery, userIdx);

  return selectJWTRow;
};

// 로그인 (토큰 넣기)
async function insertToken(connection, userIdx, token) {
  const insertTokenQuery = `
              INSERT INTO Token(userIdx, jwt)
              VALUES(${userIdx}, '${token}');
              `;
  const insertTokenRow = await connection.query(insertTokenQuery, userIdx, token);

  return insertTokenRow;
};

// 로그아웃 (jwt 삭제)
async function deleteJWT(connection, userIdx) {
  const deleteJWTQuery = `
              DELETE FROM Token
              WHERE userIdx = ?;
              `;
  const deleteJWTRow = await connection.query(deleteJWTQuery, userIdx);

  return deleteJWTRow;
};

// 탈퇴
async function secession(connection, userIdx) {
  const UserQuery = `
              UPDATE UserTB
              SET status = 'D'
              WHERE idx = ?;
              `;
  const UserRow = await connection.query(UserQuery, userIdx);

  return UserRow;
};

async function selectProfile(connection, userIdx) {
  const selectUserProfileQuery = `
  SELECT
    UserTB.idx,
    UserTB.name,
    IFNULL(UserTB.profileImage, '') as profileImage,
    date_format(UserTB.createdAt, '회원가입: %Y년 %c월') as 'createdAt',
    UserTB.introduce,
    UserTB.locationName,
    UserTB.language,
    UserTB.job,
    UserTB.badgeStatus,
    case
        when UserBadgeTB.badgeIdx = 7 then 'Y' else 'N'
    end as EmailBadge,
    case
        when UserBadgeTB.badgeIdx = 8 then 'Y' else 'N'
    end as PhoneBadge,
    case
        when UserBadgeTB.badgeIdx = 9 then 'Y' else 'N'
    end as NameBadge,
    IF(UserTB.hostStatus = 'Y', UserTB.hostStatus, 'N') as HostStatus,
    (select count(*) from UserReviewTB WHERE reviewedUserIdx = UserTB.idx AND status = 'Y') as ReviewCount
    FROM UserTB
        LEFT JOIN UserBadgeTB on UserTB.idx = UserBadgeTB.userIdx
    WHERE UserTB.idx = ?;
  `;
  const [userProfileRow] = await connection.query(selectUserProfileQuery, userIdx);
  
  return userProfileRow;
};

async function selectReview(connection, userIdx) {
  const selectUserProfileQuery = `
  SELECT IFNULL(UT.profileImage, '') as userProfileImage,
    UT.name,
    UT.locationName,
    date_format(UT.createdAt, '%Y년 %c월') as 'createdAt',
    URT.contents
    FROM UserReviewTB URT
              INNER JOIN UserTB UT on URT.reviewUserIdx = UT.idx
    WHERE URT.reviewedUserIdx = ?
      AND URT.status = 'Y'
    LIMIT 20;
  `;
  const [userProfileRow] = await connection.query(selectUserProfileQuery, userIdx);
  
  return userProfileRow;
};

async function selectMyProfile(connection, userIdx) {
  const selectUserProfileQuery = `
    SELECT
      idx,
      profileImage,
      locationName,
      job,
      language
    FROM UserTB
    WHERE UserTB.idx = ?;
  `;
  const [userProfileRow] = await connection.query(selectUserProfileQuery, userIdx);
  
  return userProfileRow;
};

async function updateProfile(connection, userIdx, profileImage,locationName, job, language) {
  const updateProfile = `
              UPDATE UserTB
              SET 
                profileImage = '${profileImage}',
                locationName = '${locationName}',
                job = '${job}',
                language = '${language}'
              WHERE idx = ${userIdx};
              `;
  const updateProfileRow = await connection.query(updateProfile, userIdx, profileImage,locationName, job, language);

  return updateProfileRow;
};

async function selectPrivacy(connection, userIdx) {
  const selectUserPrivacyQuery = `
    SELECT
      idx,
      name,
      lastName,
      gender,
      date_format(birthday, '%y.%c.%d') as birthday,
      email,
      phoneNumber
    FROM UserTB
    WHERE UserTB.idx = ?;
  `;
  const [userPrivacyRow] = await connection.query(selectUserPrivacyQuery, userIdx);
  
  return userPrivacyRow;
};

async function updatePrivacy(connection, userIdx, name, lastName, gender, birthday) {
  const updatePrivacy = `
              UPDATE UserTB
              SET 
                name = '${name}',
                lastName = '${lastName}',
                gender = '${gender}',
                birthday = '${birthday}'
              WHERE idx = ${userIdx};
              `;
  const updatePrivacyRow = await connection.query(updatePrivacy, userIdx, name, lastName, gender, birthday);

  return updatePrivacyRow;
};

//이메일 인증 조회
async function selectVerifiedEmail(connection, userIdx) {
  const selectUserEmailQuery = `
        SELECT userIdx
        FROM UserBadgeTB        
        WHERE userIdx = ${userIdx} and badgeIdx = 7;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, userIdx);
  return emailRows;
}

//전화번호 인증 조회
async function selectVerifiedPhone(connection, userIdx) {
  const selectUserEmailQuery = `
        SELECT userIdx
        FROM UserBadgeTB
        WHERE userIdx = ${userIdx} and badgeIdx = 8;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, userIdx);
  return emailRows;
}

// 이메일만으로 회원가입
async function insertOnlyEmailUser(connection, email) {
  const insertUserQuery = `
      INSERT INTO UserTB(email)
      VALUES (?);
  `;
  const insertUserRow = await connection.query(insertUserQuery, email);

  return insertUserRow;
}

// 전화번호만으로 회원가입
async function insertOnlyPhoneNumberUser(connection, phoneNumber) {
  const insertUserQuery = `
      INSERT INTO UserTB(phoneNumber)
      VALUES (?);
  `;
  const insertUserRow = await connection.query(insertUserQuery, phoneNumber);

  return insertUserRow;
}

// Badge 추가
async function insertUserEmailBadge(connection, userIdx) {
  const insertUserQuery = `
      INSERT INTO UserBadgeTB(userIdx,badgeIdx)
      VALUES (?,7);
  `;
  const insertUserRow = await connection.query(insertUserQuery, userIdx);

  return insertUserRow;
}

async function insertUserPhoneBadge(connection, userIdx) {
  const insertUserQuery = `
      INSERT INTO UserBadgeTB(userIdx,badgeIdx)
      VALUES (?,8);
  `;
  const insertUserRow = await connection.query(insertUserQuery, userIdx);

  return insertUserRow;
}


// 신고
async function insertReports(connection, reportIdx, userIdxFromJWT, userIdx) {
  const insertReportsQuery = `
      INSERT INTO UserReportTB(status, reportIdx, reportingUserIdx, reportedUserIdx)
      VALUES ('Y', ?, ?, ?);
  `;

  const insertReportsResult = await connection.query(
      insertReportsQuery,
      [reportIdx, userIdxFromJWT, userIdx]
  );

  return insertReportsResult;
}

// 신고 조회
async function selectReports(connection, userIdxFromJWT, userIdx) {
  const selectUserReportQuery = `
                SELECT idx, status
                FROM UserReportTB 
                WHERE reportingUserIdx = ${userIdxFromJWT} and reportedUserIdx = ${userIdx};
                `;
  const [reportRows] = await connection.query(selectUserReportQuery, userIdxFromJWT, userIdx);
  return reportRows;
}

// 상세신고
async function updateReports(connection, reportIdx, userIdxFromJWT, userIdx) {
  const updateReportQuery = `
      UPDATE UserReportTB
      SET 
        reportIdx = ${reportIdx}
      WHERE reportingUserIdx = ${userIdxFromJWT} and reportedUserIdx = ${userIdx};
  `;
  const insertReportRow = await connection.query( updateReportQuery, reportIdx, userIdxFromJWT, userIdx);

  return insertReportRow;
}

module.exports = {
  insertPhoneUser,
  insertEmailUser,
  insertSocialUser,
  updateUser,
  selectUserEmail,
  selectUserPhoneNumber,
  selectPhoneUserAccount,
  selectEmailUserAccount,
  selectUserPassword,
  selectUsers,
  selectJWT,
  insertToken,
  deleteJWT,
  secession,
  selectProfile,
  selectReview,
  selectMyProfile,
  updateProfile,
  selectPrivacy,
  updatePrivacy,
  selectVerifiedEmail,
  selectVerifiedPhone,
  insertOnlyEmailUser,
  insertOnlyPhoneNumberUser,
  insertUserEmailBadge,
  insertUserPhoneBadge,
  insertReports,
  selectReports,
  updateReports
};
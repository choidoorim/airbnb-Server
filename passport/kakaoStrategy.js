const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const { pool } = require("../config/database");
const secret_config = require("../config/secret");

const baseResponse = require("../config/baseResponseStatus");
const {response, errResponse} = require("../config/response");
const {logger} = require("../config/winston");

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: secret_config.KAKAO_CLIENT_ID,
        callbackURL: 'http://localhost:3000/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        console.log(profile._json.kakao_account.email);
        const email = profile._json.kakao_account.email;
        try {
            const connection = await pool.getConnection(async (conn) => conn);
            try {
                done(null,email);
            }
            catch (err) {
                await connection.rollback(); // ROLLBACK
                connection.release();
                return errResponse(baseResponse.DB_ERROR);
            }
        } catch (err) {
            return errResponse(baseResponse.DB_ERROR);
        }
    }
    ));
};
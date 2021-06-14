const passport = require('passport');
const NaverStrategy = require('passport-naver').Strategy;
const { pool } = require("../config/database");
const secret_config = require("../config/secret");

const baseResponse = require("../config/baseResponseStatus");
const {response, errResponse} = require("../config/response");
const {logger} = require("../config/winston");

module.exports = () => {
    passport.use(new NaverStrategy({
        clientID: secret_config.NAVER_CLIENT_ID,
        clientSecret: secret_config.NAVER_CLIENT_SECRET,
        callbackURL: "https://product.alvin.shop/auth/naver/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile);
            const email = profile._json.email;
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
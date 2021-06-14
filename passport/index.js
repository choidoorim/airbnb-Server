const google = require('./googleStrategy');
const kakao = require('./kakaoStrategy');
const naver = require('./naverStrategy');

module.exports = () => {
    google();
    kakao();
    naver();
};
module.exports = function (app) {
    const search = require('./searchController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 유저 검색 기록 조회 API
    app.get('/app/search', jwtMiddleware, search.getSearch);

    // 2. 유저 검색 기록 등록 API
    app.post('/app/search', jwtMiddleware, search.postSearch);
};
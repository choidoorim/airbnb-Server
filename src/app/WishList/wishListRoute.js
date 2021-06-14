module.exports = function(app){
    const wishList = require('./wishListController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.get('/app/test/push-notification', wishList.getTest);

    // 1. 위시리스트 조회 API
    app.get('/app/wishlists', jwtMiddleware, wishList.getWishLists); //jwtMiddleware

    // 2. 위시리스트 내역 조회 API
    app.get('/app/wishlists/:wishIdx/contents', wishList.getWishListContents);

    // 3. 위시리스트 설정 조회 API
    app.get('/app/wishlists/:wishIdx/set', wishList.getWishListSets);

    // 4. 위시리스트 설정 수정 API
    app.patch('/app/users/:userIdx/wishlists/:wishIdx/set', jwtMiddleware, wishList.patchWishListSet); //jwtMiddleware

    // 5. 위시리스트 삭제 API
    app.patch('/app/users/:userIdx/wishlists/:wishIdx/status', jwtMiddleware, wishList.patchWishListStatus); //jwtMiddleware

    // 6. 위시리스트 날짜 수정 API
    app.patch('/app/users/:userIdx/wishlists/:wishIdx/dates', jwtMiddleware, wishList.patchWishDates); //jwtMiddleware

    // 7. 위시리스트 인원 수정 API
    app.patch('/app/users/:userIdx/wishlists/:wishIdx/personnel', jwtMiddleware, wishList.patchWishPerson); //jwtMiddleware
};

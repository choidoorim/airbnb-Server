//select
async function selectSearch(connection, userIdx) {
    const selectSearchQuery = `
        SELECT locationName
             , IFNULL(date_format(startDate, '%Y-%m-%d'), '') as startDate
             , IFNULL(date_format(endDate, '%Y-%m-%d'), '')   as endDate
             , IFNULL(adultGuestNum, '')                      as adultGuestNum
             , IFNULL(childGuestNum, '')                      as childGuestNum
             , IFNULL(infantGuestNum, '')                     as infantGuestNum
             , idx                                            as searchIdx
        FROM SearchTB
        WHERE userIdx = ?
          AND status = 'Y'
        ORDER BY updatedAt desc;
    `;

    const selectSearchResult = await connection.query(
        selectSearchQuery,
        userIdx
    )

    return selectSearchResult[0];
}

// insert, update
async function insertSearch(connection, insertSearchInfo) {
    console.log('insert');
    const insertSearchQuery = `
        INSERT INTO SearchTB(status, locationName, startDate, endDate, adultGuestNum, childGuestNum, infantGuestNum, userIdx)
        VALUES ('Y', ?, ?, ?, ?, ?, ?, ?);
    `;

    const insertSearchResult = await connection.query(
        insertSearchQuery,
        insertSearchInfo
    );

    return insertSearchResult;
}

async function updateSearch(connection, locationName, startDate, endDate, adultNum, childNum, infantNum, searchIdx){
    console.log('update');
    const updateSearchQuery = `
        UPDATE SearchTB
        SET locationName = ?, startDate = ?, endDate = ?, adultGuestNum = ?, childGuestNum = ?, infantGuestNum = ?
        WHERE idx = ?;
    `;

    const updateSearchResult = await connection.query(
        updateSearchQuery,
        [locationName, startDate, endDate, adultNum, childNum, infantNum, searchIdx]
    );

    return updateSearchResult;
}

async function deleteSearch(connection, userIdx){
    console.log(3);
    const deleteSearchQuery = `
        UPDATE SearchTB
        SET status = 'N'
        WHERE idx =  (select idx from (SELECT SCT.idx
                                       FROM SearchTB SCT
                                       WHERE SCT.status = 'Y' AND SCT.updatedAt = (SELECT MIN(ST.updatedAt) FROM SearchTB ST WHERE ST.userIdx = ? AND ST.status = 'Y')) as SearchIdx);
    `;

    const deleteSearchResult = await connection.query(
        deleteSearchQuery,
        userIdx
    );

    return deleteSearchResult[0];
}

// check
async function checkSearchInfo(connection, locationName, userIdx){
    const checkSearchInfoQuery = `
        SELECT idx,
               status,
               locationName,
               startDate,
               endDate,
               adultGuestNum,
               childGuestNum,
               infantGuestNum,
               userIdx
        FROM SearchTB
        WHERE locationName = ?
          AND userIdx = ?
          AND status = 'Y';
    `;
    const checkSearchInfoResult = await connection.query(
        checkSearchInfoQuery,
        [locationName, userIdx]
    );

    return checkSearchInfoResult[0];
}


module.exports = {
    selectSearch,
    insertSearch,
    updateSearch,
    deleteSearch,
    checkSearchInfo
}
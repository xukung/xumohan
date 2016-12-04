var pool = require('./pool_mysql');


var getNavObj = function (param, callback) {
    var navObj;  //导航菜单
    var sort = parseInt(param.sort ? param.sort : 1);
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var sqlStr = "SELECT * FROM category ORDER BY orderid ASC";
        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;
            for (var i = 0; i < rows.length; i++) {
                if (sort === rows[i].id) {
                    rows[i].cur = true;
                }
            }
            navObj = rows;
            callback(navObj);

            connection.release();
        });
    });
};

module.exports = getNavObj;
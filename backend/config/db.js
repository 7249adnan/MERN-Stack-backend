const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: "nodedatabase.cxgc04oysmwb.ap-northeast-3.rds.amazonaws.com",
    user: "admin",
    password: "zelto#1234",
    database: "lms",
    port: "3306",
});

module.exports = pool.promise();

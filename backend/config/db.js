const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: "mysql.railway.internal",
    user: "root",
    password: "lKmvNmdfzlJABHOvwtWdGKVSvDRTiowJ",
    database: "railway",
    port: "80",
});

module.exports = pool.promise();

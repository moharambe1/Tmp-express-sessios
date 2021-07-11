const Pool=require('pg').Pool;
const Config=require('../lib/Config.js');

const pool =new Pool({
    host:Config.db.host,
    user:Config.db.user,
    password:Config.db.password,
    port:Config.db.port,
    database:Config.db.database
})


module.exports=pool;
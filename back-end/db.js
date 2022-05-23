const Pool = require("pg").Pool;

const pool = new Pool({
    user: "sam_flamini",
    host: "localhost",
    port: 5432,
    database: "accounting_system"
});

module.exports = pool;
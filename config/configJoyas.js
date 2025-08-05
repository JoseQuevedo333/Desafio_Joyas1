const { Pool } = require("pg");
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "PoLLO5518",
  database: "joyas",
  port: 5432,
});

module.exports = { pool };

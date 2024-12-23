const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "70.34.216.11", // MariaDB host
  user: "root",
  port: 5060,
  password: "pbx#123",
  database: "opensips",
  connectionLimit: 20, // Max number of connections in pool
  acquireTimeout: 20000,
  debug: ["ComQueryPacket", "RowDataPacket"], // Enable query and row logging
});

export const mariadbConn = async () => {
  let conn;
  try {
    conn = await pool.getConnection();

    const result = await conn.query("SELECT NOW()");
    console.log(result); // Logs the current date and time

    // Query data from the 'dispatcher' table
    // const rows = await conn.query("SELECT * from dispatcher");
    // console.log(rows); // Logs the rows returned from the query
  } catch (err: any) {
    console.error("Error during MariaDB operation:", err.message);
  } finally {
    // Ensure that the connection is released back to the pool
    if (conn) {
      conn.release(); // Use 'release()' instead of 'end()' to return the connection to the pool
    }
  }
};

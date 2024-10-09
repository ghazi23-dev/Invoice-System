const mysql = require('mysql2');
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "invoice-sys"
});
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database Successfully!');
    connection.release(); // release the connection
  }
});
module.exports = db;

// const mysql = require('mysql');

// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "testdb",
// });

// db.getConnection((err, connection) => {
//   if (err) {
//     console.error('Error connecting to the database:', err.message);
//   } else {
//     console.log('Connected to the database Successfully!');
//     connection.release(); // release the connection
//   }
// });

// module.exports = db;
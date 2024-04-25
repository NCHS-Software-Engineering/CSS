var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "db.redhawks.us",
  user: "redhawks_css",
  password: "oPPtWFk9r2Ne1PTbHN1z"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
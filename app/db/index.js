const fs = require('fs');
const SQL = require('sql.js');

SQL.dbOpen = function (databaseFileName) {
  try {
    return new SQL.Database(fs.readFileSync(databaseFileName));
  } catch (error) {
    console.log("Can't open database file.", error.message);
    return null;
  }
}

SQL.dbClose = function (databaseHandle, databaseFileName) {
  try {
    let data = databaseHandle.export();
    let buffer = Buffer.alloc(data.length, data);
    fs.writeFileSync(databaseFileName, buffer);
    databaseHandle.close();
    return true;
  } catch (error) {
    console.log("Can't close database file.", error);
    return null;
  }
}

export default SQL;

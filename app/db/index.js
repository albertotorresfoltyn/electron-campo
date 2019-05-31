/* eslint-disable func-names */
const fs = require('fs');
const SQL = require('sql.js');

/**
 * The following two functions extends the sql object without inheritance... JAVASCRIPT MAGIC!
 */
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
    const data = databaseHandle.export();
    const buffer = Buffer.alloc(data.length, data);
    fs.writeFileSync(databaseFileName, buffer);
    databaseHandle.close();
    return true;
  } catch (error) {
    console.log("Can't close database file.", error);
    return null;
  }
}

/**
 * The last two functions extends the sql object without inheritance... JAVASCRIPT MAGIC!
 */

 /**
  * The nest functions will provide an higher level of isolation for this shit
  */

export default SQL;

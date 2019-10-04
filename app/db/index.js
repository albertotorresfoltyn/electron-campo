import electron, {
  app,
  BrowserWindow,
  ipcMain,
} from 'electron';

/* eslint-disable func-names */
const fs = require('fs');
const SQL = require('sql.js');

const isDev = (process.env.NODE_ENV !== 'production');

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
};

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
};

SQL.connect = function () {
  const exePath = electron.remote.app.getPath('exe');
  const dirname = exePath.match(/(.*)[\/\\]/)[1] || '';
  const dbPath = (isDev) ? `${__dirname}/db` : `${dirname}/resources/db`;
  console.log('estoy en desa?', isDev);
  const dbName = '/sagDB.db';
  const dbFilePath = `${dbPath}${dbName}`;
  const createDb = function () {
    // Create a database.
    const db = new SQL.Database();
    const ddlpath = './db/schema.sql';
    console.log('ELPAAATTTH-------------------------------------', ddlpath, process.env.NODE_ENV);
    const query = fs.readFileSync(
      ddlpath,
      'utf8',
    );
    const result = db.exec(query);
    if (
      Object.keys(result).length === 0 &&
      typeof result.constructor === 'function' &&
      SQL.dbClose(db, dbPath)
    ) {
      console.log('Created a new database.');
      return db;
    }
    console.log('Database creation failed.');
    return null;
  };
  const db = SQL.dbOpen(dbFilePath);
  if (db === null) {
    /* The file doesn't exist so create a new database. */
    return createDb(`${dbPath}${dbName}`);
  }
    db.ourFileName = dbFilePath;

  /*
      The file is a valid sqlite3 database. This simple query will demonstrate
      whether it's in good health or not.
    */
  const query = 'SELECT count(*) as `count` FROM `sqlite_master`';
  const row = db.exec(query);
  // eslint-disable-next-line radix
  const tableCount = parseInt(row[0].values);
  if (tableCount === 0) {
    console.log('The file is an empty SQLite3 database.');
    createDb(`${dbPath}${dbName}`);
  } else {
   // console.log('The database has', tableCount, 'tables.');
  }
  return db;
};

SQL.close = function (db) {

  this.dbClose(db, db.ourFileName);
};
export default SQL;

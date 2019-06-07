import SQL from '../db';
const fs = require('fs');
const path = require('path');

const rowsToMagic = (rows) => {
  const results = rows[0];
  const {columns, values} = results;
  const result = [];
  values.map( val => {
    const elem = {};
    columns.map((colName, index) => {
      elem[colName] = val[index];
    })
    result.push(elem);
  })
  return result;
}

export default class DataService {
  static getCampos() {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec('SELECT * FROM `Campo`');
      const objects = rowsToMagic(rows);
      return objects;
    }
  }

    static getPotreros(campoId) {
      const db = SQL.connect();
      if (db) {
        const rows = db.exec('SELECT * FROM `Potrero` where idCampo = ' + campoId);
        const objects = rowsToMagic(rows);
        debugger;
        return objects;
      }
    }
}

import SQL from '../db';

const fs = require('fs');
const path = require('path');

const rowsToMagic = (rows) => {
  const results = rows[0];
  const { columns, values } = results;
  const result = [];
  values.map((val) => {
    const elem = {};
    columns.map((colName, index) => {
      elem[colName] = val[index];
    });
    result.push(elem);
  });
  return result;
};

export default class DataService {
  
  //Devuelve todos los campos
  static getCampos() {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec('SELECT Campo.*, COUNT() as Total FROM  `Campo` LEFT JOIN Potrero ON Campo.IdCampo = Potrero.IdCampo');
      const objects = rowsToMagic(rows);
      return objects;
    }
  }

  //Devuelve todos los potreros correspondientes a un campo
  static getPotreros(campoId) {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec(`SELECT * FROM \`Potrero\` where idCampo = ${  campoId}`);
      const objects = rowsToMagic(rows);
      return objects;
    }

  }

    // Devuelve un potrero por IdPotrero
    static getPotrero(potreroId) {
      const db = SQL.connect();
      if (db) {
      
        const rows = db.exec(`SELECT * FROM \`Potrero\` where IdPotrero = ${  potreroId}`);
        const objects = rowsToMagic(rows);
        return objects[0];
      }
    }

    // Devuelve estado de un potrero
    static getDetallePotrero(potreroId) {
      const db = SQL.connect();
      if (db) {
      
        const rows = db.exec(`SELECT * FROM \`PotreroDetalle\` where IdPotrero = ${  potreroId}`);
        const objects = rowsToMagic(rows);
        return objects;
      }
    }

  }



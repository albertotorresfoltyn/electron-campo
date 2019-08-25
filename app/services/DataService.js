import SQL from '../../db';

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
  // Devuelve todos los campos
  static getCampos() {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec('SELECT Campo.*, COUNT() as Total FROM  `Campo` LEFT JOIN Potrero ON Campo.IdCampo = Potrero.IdCampo',);
      const objects = rowsToMagic(rows);
      return objects;
    }
  }

  // Devuelve todos los potreros correspondientes a un campo
  static getPotreros(campoId) {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec(`SELECT * FROM \`Potrero\` where idCampo = ${campoId}`,);
      const objects = rowsToMagic(rows);
      return objects;
    }
  }

  // Devuelve un potrero por IdPotrero
  static getPotrero(potreroId) {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec(`SELECT * FROM \`Potrero\` where IdPotrero = ${potreroId}`,);
      const objects = rowsToMagic(rows);
      return objects[0];
    }
  }

  // Devuelve estado de un potrero
  static getDetallePotrero(potreroId) {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec(`SELECT * FROM \`PotreroDetalle\` where IdPotrero = ${potreroId}`,);
      const objects = rowsToMagic(rows);
      return objects;
    }
  }
  // Devuelve listado de categoria hacienda
  static getCategoriaHacienda() {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec('SELECT * FROM `CategoriaHacienda`');

      const objects = rowsToMagic(rows);
      return objects;
    }
  }
  // POTRERO
  // MOCK
  static getDetalleByPotrero(potreroId) {

    if(potreroId == 2042){
      return [
        { type: "toro", qtty: 200,cantMov:0, total: 200 },
        { type: "ternero", qtty: 300,cantMov:0, total: 300 },
        { type: "ternera", qtty: 50,cantMov:0, total: 50 }
      ]
    }

      return [
        { type: "vaca", qtty: 2000,cantMov:0, total: 2000 },
        { type: "toro", qtty: 3000,cantMov:0, total: 3000 },
        { type: "ternero", qtty: 1000,cantMov:0, total: 1000 },
        { type: "ternera", qtty: 2000,cantMov:0, total: 2000 }
      ]

  }

  static guardarMovimiento() {
    debugger;
    const db = SQL.connect();
    if (db) {
      try {
        const rows = db.exec('INSERT INTO `Movimiento` VALUES (10999, 2038, "20/10/2019","esta","{}","{}")');
        db.close();
        debugger;
        console.log(rows);
      } catch (error) {
        console.log(error)
      }
    }
  }
}

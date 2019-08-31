import SQL from '../../db';

var hasOwnProperty = Object.prototype.hasOwnProperty;

// despues sacar esto, no va hacer falta controlar 
function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

const fs = require('fs');
const path = require('path');

const rowsToMagic = (rows) => {
  const results = rows[0];
  const { columns, values } = results;
  const result = [];
  values.map((val) => {
    const elem = {};
    columns.map((colName, index) => {
      elem[colName] = (colName == 'MovimientoDetalle' || colName == "PotreroDetalle")? JSON.parse(val[index]):val[index];
    
    });
    result.push(elem);
  });
  return result;
};

const toPotreroModel = (rows) => {
  const result = [];
  
  if(!isEmpty(rows)){
    rows.map((ele) => {
     const elem = {type: ele.type , qtty: ele.amount, cantMov:0, total: ele.amount};
     result.push(elem);
    });
  }
  
 
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
 
  static getDetalleByPotrero(idPotrero) {

    const db = SQL.connect();


    if (db) {
      const rows = db.exec(`SELECT PotreroDetalle, MovimientoDetalle FROM  \`Movimiento\` where IdPotrero = ${idPotrero}  order by IdMovimiento desc LIMIT 1`);
      const objects = toPotreroModel(rowsToMagic(rows)[0].PotreroDetalle);
      
      return objects;
    }
  }

  static guardarMovimiento(mov) {
    
    const db = SQL.connect();
    const values = Object.values(mov);
    if (db) {
      try {
        const rows = db.run('INSERT INTO `Movimiento` (IdPotrero, Fecha, Observaciones, MovimientoDetalle, PotreroDetalle) VALUES (?, ?,?,?,?)', values);
        SQL.close(db);
      
      
      } catch (error) {
        console.log(error)
      }
    }
  }
}

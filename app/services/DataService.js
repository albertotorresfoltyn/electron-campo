import SQL from "../../db";

const fs = require("fs");
const path = require("path");

const rowsToMagic = rows => {
  const results = rows[0];
  const { columns, values } = results;
  const result = [];
  values.map(val => {
    const elem = {};
    columns.map((colName, index) => {
      elem[colName] =
        colName == "MovimientoDetalle" || colName == "PotreroDetalle"
          ? JSON.parse(val[index])
          : val[index];
    });
    result.push(elem);
  });
  return result;
};

const toPotreroModel = rows => {
  const result = [];
  rows &&
    rows.map(ele => {
      const elem = {
        type: ele.type,
        qtty: ele.amount,
        cantMov: 0,
        total: ele.amount
      };
      result.push(elem);
    });
  return result;
};

export default class DataService {
  // Devuelve todos los campos
  static getCampos() {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec(
        "SELECT Campo.*, COUNT() as Total FROM  `Campo` LEFT JOIN Potrero ON Campo.IdCampo = Potrero.IdCampo"
      );
      const objects = rowsToMagic(rows);
      return objects;
    }
  }

  // Devuelve todos los potreros correspondientes a un campo
  static getPotreros(campoId) {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec(
        `SELECT * FROM \`Potrero\` where idCampo = ${campoId}`
      );
      const objects = rowsToMagic(rows);
      return objects;
    }
  }

  // Devuelve un potrero por IdPotrero
  static getPotrero(potreroId) {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec(
        `SELECT * FROM \`Potrero\` where IdPotrero = ${potreroId}`
      );
      const objects = rowsToMagic(rows);
      return objects[0];
    }
  }

  // Devuelve listado de categoria hacienda
  static getCategoriaHacienda() {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec("SELECT * FROM `CategoriaHacienda`");

      const objects = rowsToMagic(rows);
      return objects;
    }
  }

  // POTRERO

  static getDetalleByPotrero(idPotrero) {
  
   
      const db = SQL.connect();

      if (db) {
        const rows = db.exec(
          `SELECT IdMovimiento ,PotreroDetalle, MovimientoDetalle FROM  \`Movimiento\` where IdPotrero = ${idPotrero}  order by IdMovimiento desc LIMIT 1`
        );

        const objects = toPotreroModel(rowsToMagic(rows)[0].PotreroDetalle);

        return objects;
      }
  
  }
// Recupera de BD el ultimo movimientos de todos los potreros
  static getDetallePotreros() {
    const db = SQL.connect();

    if (db) {
      const rows = db.exec(
        `SELECT PotreroDetalle, MovimientoDetalle FROM  \`Movimiento\` order by IdMovimiento`
      );

      const objects = toPotreroModel(rowsToMagic(rows)[0].PotreroDetalle);

      return objects;
    }

}

//listado de motivos de muerte de Base de datos
static getMotivos() {
  var lmotivos = [{type: 0, amount: 'Enfermedad'}, {type: 0, amount: 'Desconocido'}];
  return lmotivos;

}

// Guarda movimiento en Base de datos
  static guardarMovimiento(mov) {
    const db = SQL.connect();
    const values = Object.values(mov);
    if (db) {
      try {
        const rows = db.run(
          "INSERT INTO `Movimiento` (IdPotrero, Fecha, Observaciones, MovimientoDetalle, PotreroDetalle) VALUES (?, ?,?,?,?)",
          values
        );
        SQL.close(db);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

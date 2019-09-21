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
      elem[colName] =
        colName == 'MovimientoDetalle' || colName == 'PotreroDetalle'
          ? JSON.parse(val[index])
          : val[index];
    });
    result.push(elem);
  });
  return result;
};

const toPotreroModel = (rows) => {
  const result = [];
  rows &&
    rows.map((ele) => {
      const elem = {
        type: ele.type,
        qtty: ele.amount,
        cantMov: 0,
        total: ele.amount,
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
      const rows = db.exec('SELECT Campo.*, COUNT() as Total FROM  `Campo` LEFT JOIN Potrero ON Campo.IdCampo = Potrero.IdCampo');
      const objects = rowsToMagic(rows);
      db.close();
      return objects;
    }
    return [];
  }

  // guarda una lista masiva de movimientos, mas que nada recategorizaciones

  static saveMovements(list, vacaKind) {
    const result = list.map((r) => {
      const mov = {
        id: r.idPotrero,
        fecha: new Date(),
        motivo: 'RECATEGORIZACION',
        movimientodetalle: {},
        PotreroDetalle: {},
      };
      // idmovimiento, idpotrero, fecha, motivo, observaciones, movimientodetalle, potrerodetalle
      return mov;
    });
    const potreros = this.getDetallePotreros();
    debugger;
    const db = SQL.connect();
    if (db) {
      for (let i = 0; i < result.length; i += 1) {

      }
      db.close();
    }
    // for each result
    // get last movimiento
    // update last movimiento
    // insert
    /* const db = SQL.connect();
    if (db) {
      const rows = db.exec('SELECT * FROM `Potrero`',);
      const objects = rowsToMagic(rows);
      db.close();
      return objects;
    }
    return []; */
  }

  // Devuelve todos los potreros correspondientes a un campo
  static getPotreros(campoId) {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec(`SELECT * FROM \`Potrero\` where idCampo = ${campoId}`);
      const objects = rowsToMagic(rows);
      db.close();
      return objects;
    }
    return [];
  }

  // Devuelve todos los potreros
  static getAllPotreros() {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec('SELECT * FROM `Potrero`');
      const objects = rowsToMagic(rows);
      db.close();
      return objects;
    }
    return [];
  }

  // Devuelve un potrero por IdPotrero
  static getPotrero(potreroId) {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec(`SELECT * FROM \`Potrero\` where IdPotrero = ${potreroId}`);
      const objects = rowsToMagic(rows);
      db.close();
      return objects[0];
    }
    return [];
  }

  // Devuelve listado de categoria hacienda
  static getCategoriaHacienda() {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec('SELECT * FROM `CategoriaHacienda`');
      db.close();
      const objects = rowsToMagic(rows);
      return objects;
    }
    return [];
  }

  // Devuelve listado de relaciones de  categoria hacienda
  static getCategoriaHaciendaRelaciones() {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec('SELECT * FROM `CategoriaHaciendaRelaciones`');
      db.close();
      const objects = rowsToMagic(rows);
      return objects;
    }
    return [];
  }

  // POTRERO
  // recupera el ultimo movimiento de UN potrero
  static getLastDetalleByPotrero(idPotrero) {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec(`SELECT IdMovimiento ,PotreroDetalle FROM  \`Movimiento\` where IdPotrero = ${idPotrero}  order by IdMovimiento DESC LIMIT 1`);
      console.log('rowsToMagic(rows)[0]');
      console.log(rowsToMagic(rows)[0]);
      const objects = toPotreroModel(rowsToMagic(rows)[0].PotreroDetalle);
      db.close();
      return objects;
    }
    return [];
  }

  // recupera TODOS los movimientos de UN potrero
  static getAllDetalleByPotrero(idPotrero) {
    console.log(`llamo a getall con ${idPotrero}`);
    const db = SQL.connect();
    if (db) {
      const rows = db.exec(`SELECT Movimiento.*, Potrero.Nombre FROM  Movimiento  INNER JOIN Potrero ON Movimiento.IdPotrero=Potrero.IdPotrero  where Movimiento.IdPotrero = ${idPotrero}  order by IdMovimiento desc`);
      db.close();
      const objects = rowsToMagic(rows);
      return objects;
    }
    return [];
  }
  // Recupera de BD el ultimo movimientos de todos los potreros
  static getDetallePotreros() {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec('SELECT IdPotrero,PotreroDetalle FROM  `Movimiento` GROUP BY IdPotrero ORDER BY MAX(Fecha) ASC');
      const objects = (rowsToMagic(rows));
      db.close();
      return objects;
    }
    return [];
  }

  // listado de motivos de muerte de Base de datos
  static getMotivos() {
    const lmotivos = [{ type: 0, amount: 'Enfermedad' }, { type: 1, amount: 'Desconocido' }, { type: 2, amount: 'Robo' }];
    return lmotivos;
  }

  // Guarda movimiento en Base de datos
  static guardarMovimiento(mov) {
    const db = SQL.connect();
    const values = Object.values(mov);
    if (db) {
      try {
        const rows = db.run(
          'INSERT INTO `Movimiento` (IdPotrero, Fecha, Motivo, Observaciones, MovimientoDetalle, PotreroDetalle, PotreroOrigen, PotreroDestino,TipoMovimiento) VALUES (?, ?,?,?,?,?,?,?,?)',
          values,
        );
        SQL.close(db);
      } catch (error) {
        console.log(error);
      }
    }
    return [];
  }
}

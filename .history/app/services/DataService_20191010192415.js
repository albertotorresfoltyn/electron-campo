import SQL from '../db';
import DataConvert from '../utils/DataConvert';

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
        colName === 'MovimientoDetalle' || colName === 'PotreroDetalle'
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

  static saveMovements(list, originVacaKind, vacaKind) {
    const potreros = this.getDetallePotreros();
    const result = list.map((r) => {
      const potrero = potreros.find(p => p.id === r.idPotrero);
      const potrerodetalle = potrero.PotreroDetalle;
      const detalleTipoVaca = potrerodetalle.find(d => d.type === originVacaKind);
      // sacar vacas de potrero detalle, originVacaKind
      const mov1 = { type: originVacaKind, amount: -r.cantMov };
      const mov2 = { type: vacaKind, amount: r.cantMov }; // agregar vacas en potrero detalle, vacakind
      const unify = (array) => {
        const res = array.reduce((acc, i) => {
          const isPresent = acc.find(e => e.type === i.type);
          if (!isPresent) {
            acc.push(i); // primer valor en la sumarizacion
          } else {
            isPresent.amount += i.amount; // sumo
            // reemplazo en el arreglo
            const index = acc.findIndex(e => e.type === i.type);
            if (index !== -1) {
              acc[index] = isPresent;
            }
          }
          return acc;
        }, []);
     
        return res;
        
      };
      const unifiedList = unify([...potrerodetalle, mov1, mov2]);
      const mov = DataConvert.toMovimientoEntity(r.id, '', 'RECATEGORIZACION', [mov1, mov2], unifiedList, r.id, r.id, 'RECATEGORIZACION');
      return mov;
    }).filter(mov => JSON.parse(mov.MovimientoDetalle).length > 0);
    // now we save result in the db, result is the list of movements
    result.forEach((element) => {
      this.guardarMovimiento(element);
    });

    alert("Operación exitosa");
  }

  // Devuelve todos los potreros correspondientes a un campo
  static getPotreros(campoId) {
    const db = SQL.connect();
    if (db) {
      const rows = db.exec(`SELECT * FROM  Potrero  INNER JOIN 
      (select max(IdMovimiento) lastmov, MovimientoDetalle, PotreroDetalle, IdPotrero
      from Movimiento group by IdPotrero) m  ON m.IdPotrero=Potrero.IdPotrero where Potrero.IdCampo= ${campoId}  order by Potrero.Orden`);
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
    
      const objects = toPotreroModel(rowsToMagic(rows)[0].PotreroDetalle);
      db.close();
      return objects;
    }
    return [];
  }

  // recupera TODOS los movimientos de UN potrero
  static getAllDetalleByPotrero(idPotrero) {
 
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
      const rows = db.exec('SELECT IdMovimiento,IdPotrero,PotreroDetalle FROM  `Movimiento` GROUP BY IdPotrero ORDER BY MAX(IdMovimiento) DESC');
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
          'INSERT INTO `Movimiento` (IdPotrero, Fecha,Observaciones,Motivo, MovimientoDetalle, PotreroDetalle, PotreroOrigen, PotreroDestino,TipoMovimiento) VALUES (?, ?,?,?,?,?,?,?,?)',
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

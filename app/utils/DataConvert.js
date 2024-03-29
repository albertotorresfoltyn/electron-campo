
// Encargado de las conversiones de estructuras
// terminacion entity significa entidades de BD
// terminaciones Model significa modelo necesario para el front

export default class DataConvert {
  // Crear entidad para tabla MOVIMIENTO
  // idPotrero - Fecha - Observaciones -  Motivo - movimientoDetalle - potreroDetalle
  static toMovimientoEntity(idPotrero, obs, motivo, movDetalle, potDetalle, potOrigen, potDestino, tipoMovimiento) {
    const mov = {
      IdPotrero: idPotrero,
      Fecha: new Date()
        .toJSON()
        .slice(0, 10)
        .split('-')
        .reverse()
        .join('/'),
      Observaciones: obs,
      Motivo: motivo,
      MovimientoDetalle: JSON.stringify(this.cleanList(movDetalle)),
      PotreroDetalle: JSON.stringify(this.cleanList(potDetalle)),
      PotreroOrigen: potOrigen,
      PotreroDestino: potDestino,
      TipoMovimiento: tipoMovimiento,
    };
    return mov;
  }

  // Crea entidad por defecto type/amount para guardar en Base de datos
  // type - amount
  static toDefaultEntity(type, amount) {
    const mov = {
      type,
      amount,
    };
    return mov;
  }


  static cleanList(list) {
    return (list.map((item) => {
      const result = ({ type: item.type, amount: parseInt(item.amount) });
      return result;
    }).filter(x => x.amount != 0));
  }


  // Convierte listado de detalle potrero a listado que necesito en modelo
  // name - value - indice - color
  static convertDetallesToModel(listDetalle, colores) {
    if (listDetalle != undefined) {
      const result = [];
      listDetalle.map((item) => {
        const detalles = item.PotreroDetalle;
        detalles.map((detalle) => {
          const colorE = colores.find(e => e.Nombre.toUpperCase() === detalle.type.toUpperCase());
          const resIndex = result.findIndex(e => e.name.toUpperCase() === detalle.type.toUpperCase());
          if (resIndex > -1) {
            result[resIndex].value = result[resIndex].value + parseInt(detalle.amount);
          } else {
            result.push({
              name: detalle.type,
              value: parseInt(detalle.amount, 10),
              indice: '1',
              color: colorE ? colorE.Color : '#ffff80',
            });
          }
        });
      });
      return result;
    }
  }


  static convertDetalleToModel(listDetalle, colores) {
  
    if (listDetalle != undefined) {
      const result = [];
      listDetalle.map((item, i) => {
        const colorE = colores.find(e => e.Nombre.toUpperCase() == item.type.toUpperCase());
       
        const elem = {
          name: item.type,
          value: item.total,
          indice: i,
          color: colorE ? colorE.Color : '#ffff80',
        };
        result.push(elem);
      });
      return result;
    }
  }
}

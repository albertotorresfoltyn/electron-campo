
// Encargado de las conversiones de estructuras
// terminacion entity significa entidades de BD 
// terminaciones Model significa modelo necesario para el front

export default class DataConvert {

  
  // Crear entidad para tabla MOVIMIENTO 
  // idPotrero - Fecha - Observaciones - movimientoDetalle - potreroDetalle
  toMovimientoEntity(idPotrero, obs, movDetalle, potDetalle) {
    const mov = {
      idPotrero: idPotrero,
      Fecha: new Date()
        .toJSON()
        .slice(0, 10)
        .split("-")
        .reverse()
        .join("/"),
      Observaciones: obs,
      movimientoDetalle: JSON.stringify(movDetalle),
      potreroDetalle: JSON.stringify(potDetalle)
    };
    return mov;
  }

  // Crea entidad por defecto type/amount para guardar en Base de datos 
  // type - amount
  toDefaultEntity(type, amount) {
    const mov = {
      type: type,
      amount: amount
    };
    return mov;
  }


}

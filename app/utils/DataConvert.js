
// Encargado de las conversiones de estructuras
// terminacion entity significa entidades de BD 
// terminaciones Model significa modelo necesario para el front

export default class DataConvert {

  
  // Crear entidad para tabla MOVIMIENTO 
  // idPotrero - Fecha - Observaciones - movimientoDetalle - potreroDetalle
  static toMovimientoEntity(idPotrero, obs, movDetalle, potDetalle) {
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
  static toDefaultEntity(type, amount) {
    const mov = {
      type: type,
      amount: amount
    };
    return mov;
  }

   // Convierte listado de detalle potrero a listado que necesito en modelo
  // name - value - indice - color
  static convertDetalleToModel(listDetalle, colores) {
    if(listDetalle != undefined){
      const result = [];
      listDetalle.map((item, i) => {
        const elem = {
          name: item.type,
          value: item.total,
          indice: i,
          color: colores.find(e=> e.Nombre.toUpperCase() == item.type.toUpperCase()).Color
        };
        result.push(elem);
      });
      return result;
  
    }
  }

 


}

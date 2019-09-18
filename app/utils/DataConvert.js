
// Encargado de las conversiones de estructuras
// terminacion entity significa entidades de BD
// terminaciones Model significa modelo necesario para el front

export default class DataConvert {


  // Crear entidad para tabla MOVIMIENTO
  // idPotrero - Fecha - Observaciones -  Motivo - movimientoDetalle - potreroDetalle
  static toMovimientoEntity(idPotrero, obs, motivo,movDetalle, potDetalle, potOrigen, potDestino, tipoMovimiento) {
    const mov = {
      idPotrero: idPotrero,
      Fecha: new Date()
        .toJSON()
        .slice(0, 10)
        .split("-")
        .reverse()
        .join("/"),
      Observaciones: obs,
      Motivo: motivo,
      MovimientoDetalle: JSON.stringify(movDetalle),
      PotreroDetalle: JSON.stringify(potDetalle),
      PotreroOrigen:potOrigen,
      PotreroDestino:potDestino,
      TipoMovimiento: tipoMovimiento
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
    function decimalToHex(d, padding) {
        var hex = Number(d).toString(16);
        padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

        while (hex.length < padding) {
            hex = "0" + hex;
        }

        return hex;
    }
    console.log("colores");
    console.log(colores);
    console.log(listDetalle);
    if(listDetalle != undefined){
      const result = [];

      listDetalle.map((item, i) => {
        debugger

        const detalle = item.PotreroDetalle;
        detalle.map((detalle, j) => {

         const resIndex = result.findIndex(e=> e.name.toUpperCase() == detalle.type.toUpperCase())
         if(resIndex > -1){
        
          result[resIndex].value = result[resIndex].value +  parseInt(detalle.amount);
          
         }
         else{
          result.push(
           {
              name: detalle.type,
              value: parseInt(detalle.amount),
              indice: "1",
              color: colores.find(e=> e.Nombre.toUpperCase() == detalle.type.toUpperCase()).Color
            }
          )
         }
        

        });
       
       
      
      });
      return result;

    }
  }




}

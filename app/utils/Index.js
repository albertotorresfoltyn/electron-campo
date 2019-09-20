export function getColorByMovement(type){

    switch (type) {
        case "INGRESO":
        case "EGRESO":
          return "#4e73df"
          break;
  
        case "NACIMIENTO":
          return "#1cc88a";
          break;
  
        case "BAJA":
          return "#e74a3b";
          break;
      }
}
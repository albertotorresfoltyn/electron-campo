select * from (select * from Potrero P
 inner join PotreroDetalle PD on P.IdPotrero = PD.IdPotrero where P.IdPotrero=4 ) PD
 inner join CategoriaHacienda CH on PD.IdCategoriaHacienda = CH.IdCategoriaHacienda
 order by PD.Fecha desc





--
-- File generated with SQLiteStudio v3.2.1 on Sat Jun 22 20:00:03 2019
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: Campo
CREATE TABLE Campo (IdCampo INTEGER PRIMARY KEY AUTOINCREMENT, Nombre TEXT, Descripcion TEXT, Superficie DOUBLE);
INSERT INTO Campo (IdCampo, Nombre, Descripcion, Superficie) VALUES (1, 'La eugenia', 'Descripción del campo', 1000.0);

-- Table: CategoriaHacienda
CREATE TABLE CategoriaHacienda (IdCategoriaHacienda INTEGER PRIMARY KEY AUTOINCREMENT, Nombre TEXT, Descripcion TEXT);
INSERT INTO CategoriaHacienda (IdCategoriaHacienda, Nombre, Descripcion) VALUES (1, 'Vaquillona', 'Vaquillona');
INSERT INTO CategoriaHacienda (IdCategoriaHacienda, Nombre, Descripcion) VALUES (2, 'Novillito', 'Novillito');
INSERT INTO CategoriaHacienda (IdCategoriaHacienda, Nombre, Descripcion) VALUES (4, 'Ternera', 'Ternera');
INSERT INTO CategoriaHacienda (IdCategoriaHacienda, Nombre, Descripcion) VALUES (5, 'Vaca', 'Vaca');
INSERT INTO CategoriaHacienda (IdCategoriaHacienda, Nombre, Descripcion) VALUES (6, 'Novillo', 'Novillo');
INSERT INTO CategoriaHacienda (IdCategoriaHacienda, Nombre, Descripcion) VALUES (7, 'Toro', 'Toro');
INSERT INTO CategoriaHacienda (IdCategoriaHacienda, Nombre, Descripcion) VALUES (8, 'Torito', 'Torito');

-- Table: consoladores
CREATE TABLE consoladores (test DATE);

-- Table: Movimiento
CREATE TABLE Movimiento (IdMovimiento INTEGER PRIMARY KEY AUTOINCREMENT, IdPotrero INTEGER REFERENCES Potrero (IdPotrero), Fecha DATETIME, Observaciones TEXT);

-- Table: MovimientoDetalle
CREATE TABLE MovimientoDetalle (IdMovimientoDetalle INTEGER PRIMARY KEY AUTOINCREMENT, IdMovimiento INTEGER REFERENCES Movimiento (IdMovimiento), IdCategoriaHacienda INTEGER REFERENCES CategoriaHacienda (IdCategoriaHacienda), IdTipoMovimiento INTEGER REFERENCES TipoMovimiento (IdTipoMovimiento), Cantidad INTEGER);

-- Table: Potrero
CREATE TABLE Potrero (IdPotrero INTEGER PRIMARY KEY AUTOINCREMENT, IdCampo INTEGER REFERENCES Campo (IdCampo), Nombre TEXT, Descripcion TEXT, Superficie DOUBLE, Calidad TEXT, Codigo TEXT);
INSERT INTO Potrero (IdPotrero, IdCampo, Nombre, Descripcion, Superficie, Calidad, Codigo) VALUES (4, 1, 'Potrero 1', 'Potrero para realizar actividad de cria', 100.0, 'Muy buena', '1');
INSERT INTO Potrero (IdPotrero, IdCampo, Nombre, Descripcion, Superficie, Calidad, Codigo) VALUES (5, 1, 'Potrero 2', 'Potrero para destete', 50.0, 'Regular', '2');
INSERT INTO Potrero (IdPotrero, IdCampo, Nombre, Descripcion, Superficie, Calidad, Codigo) VALUES (6, 1, 'Potrero 3', 'Potrero para realizar actividad de cria', 100.0, 'Baja', '3');
INSERT INTO Potrero (IdPotrero, IdCampo, Nombre, Descripcion, Superficie, Calidad, Codigo) VALUES (7, 1, 'Potrero 4', 'Potrero para realizar actividad de cria', 100.0, 'Muy Buena', '4');

-- Table: PotreroDetalle
CREATE TABLE "PotreroDetalle" (
	"IdDetalleProtrero"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"IdPotrero"	INTEGER,
	"IdCategoriaHacienda"	INTEGER,
	"Cantidad"	INTEGER,
	"Fecha"	DATETIME,
	FOREIGN KEY("IdCategoriaHacienda") REFERENCES "CategoriaHacienda"("IdCategoriaHacienda"),
	FOREIGN KEY("IdPotrero") REFERENCES "Potrero"("IdPotrero")
);
INSERT INTO PotreroDetalle (IdDetalleProtrero, IdPotrero, IdCategoriaHacienda, Cantidad, Fecha) VALUES (0, 4, 1, 50, '10-10-2019');
INSERT INTO PotreroDetalle (IdDetalleProtrero, IdPotrero, IdCategoriaHacienda, Cantidad, Fecha) VALUES (1, 4, 2, 100, '10-10-2019');
INSERT INTO PotreroDetalle (IdDetalleProtrero, IdPotrero, IdCategoriaHacienda, Cantidad, Fecha) VALUES (4, 4, 4, 500, '10-10-2019');
INSERT INTO PotreroDetalle (IdDetalleProtrero, IdPotrero, IdCategoriaHacienda, Cantidad, Fecha) VALUES (5, 5, 2, 500, '10-10-2019');
INSERT INTO PotreroDetalle (IdDetalleProtrero, IdPotrero, IdCategoriaHacienda, Cantidad, Fecha) VALUES (7, 6, 1, 10, '10-10-2019');
INSERT INTO PotreroDetalle (IdDetalleProtrero, IdPotrero, IdCategoriaHacienda, Cantidad, Fecha) VALUES (8, 6, 2, 500, '10-10-2019');
INSERT INTO PotreroDetalle (IdDetalleProtrero, IdPotrero, IdCategoriaHacienda, Cantidad, Fecha) VALUES (9, 4, 1, 50000, '11-10-2019');
INSERT INTO PotreroDetalle (IdDetalleProtrero, IdPotrero, IdCategoriaHacienda, Cantidad, Fecha) VALUES (10, 4, 2, 90000, '11-10-2019');
INSERT INTO PotreroDetalle (IdDetalleProtrero, IdPotrero, IdCategoriaHacienda, Cantidad, Fecha) VALUES (11, 4, 4, 15000, '11-10-2019');

-- Table: TipoMovimiento
CREATE TABLE TipoMovimiento (IdTipoMovimiento INTEGER PRIMARY KEY AUTOINCREMENT, Nombre TEXT);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;

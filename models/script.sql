Create Database Tienda_Anime;
use Tienda_Anime;

create table Usuario (
 id int not null auto_increment primary key,
 Nombre varchar(50) not null,
 Apellido varchar(50) not null,
 Apellido2 varchar(50) not null,
 correo varchar(250) not null,
 password varchar(60) not null
);

create table Telefono (
id int not null primary key auto_increment,
id_usuario int not null,
Numero varchar(11),
Constraint FK_Usuario_Telefono foreign key (id_usuario) references Usuario(id)
);

create table Rol(
id_rol   int not null primary key auto_increment,
id_usuario int not null,
status varchar(8) not null,
Rol varchar(11),
Constraint FK_Usuario_Rol foreign key (id_usuario) references Usuario(id)
);

create table Direccion(
id_direccion   int not null primary key auto_increment,
id_usuario int not null,
direccion varchar(255),
Constraint FK_Usuario_Direccion foreign key (id_usuario) references Usuario(id)
);

create table Contacto(
id_contacto   int not null primary key auto_increment,
id_usuario int not null,
FullName varchar(255),
email varchar(255),
mensaje varchar(255),
Constraint FK_Usuario_Contacto foreign key (id_usuario) references Usuario(id)
);

CREATE TABLE Coleccion (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Nombre_Coleccion VARCHAR(255) NOT NULL,
    Descripcion VARCHAR(255) NOT NULL,
    status VARCHAR(8) NOT NULL,
    imagen VARCHAR(255) NOT NULL
);

select *from Coleccion;

insert into Coleccion (Nombre_Coleccion , Descripcion, status, imagen)
 values ("Jujutsu Kaisen Collection",
		"¡Adéntrate en el mundo del hechicería y la maldad con nuestra increíble colección de productos de Jujutsu Kaisen! Desde los intensos enfrentamientos entre los hechiceros y las maldiciones hasta los vínculos de amistad que se forjan en la Academia Tokyo Jujutsu, nuestra colección ofrece una amplia gama de artículos inspirados en los personajes, escenas y símbolos más icónicos de este exitoso anime y manga. Únete a Yuji Itadori, Megumi Fushiguro, Nobara Kugisaki y sus compañeros en su lucha contra las fuerzas del mal y hazte con tus productos favoritos que capturan la esencia de esta emocionante serie.",
        "Active",
        "https://bleedingcool.com/wp-content/uploads/2023/09/Jujutsu-Kaisen-Cursed-Clash-No-Title-Art-900x900.jpg"
        
        );

Create table Tipo(
	id_tipo int not null primary key auto_increment,
    Detalle varchar(50) not null,
    status varchar(8)
);

drop table Proovedor (
	id int not null primary key auto_increment,
    Nombre_Proovedor varchar(100) not null,
    Descripcion varchar(100) not null,
    Numero_Proovedor varchar(20),
    Direccion_Proovedor varchar(255) not null,
    status_Proovedor varchar(8),
    correo varchar(255) not null
);



create table Producto (
	id int not null primary key auto_increment,
    Nombre_Producto varchar(250) not null,
    Descripcion_producto varchar(255) not null,
    Precio_Producto double not null,
    id_coleccion int not null,
    id_Tipo int not null,
    status varchar(8) not null,
    Constraint FK_Producto_Coleccion foreign key (id_coleccion)references Coleccion(id),
    Constraint FK_Producto_Tipo foreign key (id_Tipo) references Tipo(id_tipo)
    );
    
ALTER TABLE Producto
ADD COLUMN status VARCHAR(10) NOT NULL DEFAULT 'Activo';
     select *from producto;
    
    create table Imagen(
    id int not null primary key auto_increment,
    id_Producto int not null,
    imagen varchar(255) not null,
    Constraint FK_Producto_Imagen foreign key (id_Producto) references  Producto(id)
    );
    
    
    create table Valoracion (
    id_valoracion int not null primary key auto_increment,
    id_usuario int not null,
    id_producto int not null,
    puntuacion int not null,
    comentario varchar(255) not null,
    constraint FK_usuario_valoracion foreign key (id_usuario) references  Usuario(id),
    constraint FK_producto_valoracion foreign key (id_producto) references  Producto (id)
    );
    
    create table Inventario_Ropa (
    id int not null primary key auto_increment,
    id_producto int not null,
    Cantidad int not null,
    Genero varchar(6) not null,
    Constraint FK_INVENTARIO_ROPA_PRODUCTO foreign key (id_producto) references Producto(id)
    );
    
    create table Inventario(
    id int not null primary key auto_increment,
    id_producto int not null,
    Cantidad int not null,
    Constraint FK_INVENTARIO_PRODUCTO foreign key (id_producto) references Producto(id)
    );
    
    create table Talla(
    id int not null primary key auto_increment,
    Detalle_Talla varchar(8) not null,
    Detalle_Num int not null
    );
CREATE TABLE Inventario_Ropa_Talla (
    id_Inventario INT NOT NULL,
    id_Talla INT NOT NULL,
    PRIMARY KEY(id_Inventario, id_Talla),
    CONSTRAINT FK_Inventario_Ropa_Talla_Ropa FOREIGN KEY (id_Inventario) REFERENCES Inventario_Ropa(id),
    CONSTRAINT FK_Inventario_Ropa_Talla_Talla FOREIGN KEY (id_Talla) REFERENCES Talla(id)
);

create table Producto_Proovedor(
 id_producto int not null,
 id_proovedor int not null,
 primary key(id_producto, id_proovedor),
 constraint FK_Proovedor_Producto_Proovedor foreign key (id_proovedor) references Proovedor(id),
 constraint FK_Proovedor_producto_Producto foreign key(id_producto) references Producto(id)
);

create table Orden (
	id int not null auto_increment primary key,
    id_proovedor int not null,
    fecha date not null,
    estado varchar(8) not null,
    constraint FK_Orden_Proovedor foreign key (id_proovedor) references Proovedor (id)
);

create table Detalle_Orden (
id int not null auto_increment primary key,
id_orden int not null,
Nombre_Producto varchar(250) not null,
cantidad double not null,
precio_Total double not null,
constraint FK_Detalle_Orden_Orden foreign key (id_orden) references Orden(id)
);

create Table Carrito (
id_carrito int not null primary key auto_increment,
id_usuario int not null,
fecha date,
constraint fk_usuario_carrito foreign key (id_usuario) references Usuario(id)
);

Create Table Detalle_Carrito (
 id int not null primary key auto_increment,
 id_carrito int not null,
 id_producto int not null,
 cantidad int not null,
 precio double not null,
 constraint fk_Producto_Detalle_Carrito foreign key (id_producto) References Producto (id),
 constraint fk_Producto_Detalle_Carrito_Carrito foreign key (id_carrito) references Carrito(id_carrito)
);

cREATE table Factura (
id_factura int not null primary key auto_increment,
id_usuario int not null,
id_carrito int not null,
fecha date not null,
total double not null,
constraint FK_Factura_Carrito foreign key (id_carrito) references Carrito(id_carrito),
constraint FK_Factura_Usuario foreign key (id_usuario) references Usuario(id)
);

Create table Detalle_Factura (
id_detallefactura int not null primary key auto_increment,
id_factura int not null,
id_producto int not null,
cantidad int not null,
precio double not null,
constraint FK_Detalle_Factura_Factura foreign key (id_factura) references Factura (id_factura),
constraint FK_Detalle_Factura_Producto foreign key (id_producto) references Producto(id)
);


create table Producto (
	id int not null primary key auto_increment,
    Nombre_Producto varchar(250) not null,
    Descripcion_producto varchar(255) not null,
    Precio_Producto double not null,
    id_coleccion int not null,
    id_Tipo int not null,
    Constraint FK_Producto_Coleccion foreign key (id_coleccion)references Coleccion(id),
    Constraint FK_Producto_Tipo foreign key (id_Tipo) references Tipo(id_tipo)
    );
    
    create table Producto_Proovedor(
 id_producto int not null,
 id_proovedor int not null,
 primary key(id_producto, id_proovedor),
 constraint FK_Proovedor_Producto_Proovedor foreign key (id_proovedor) references Proovedor(id),
 constraint FK_Proovedor_producto_Producto foreign key(id_producto) references Producto(id)
);




/*===================================================================================================*/
												/*STORED PROCEDURES*/
/*===================================================================================================*/

select *from inventario_ropa 
select *from Inventario_ropa 


CALL InsertarProductoInventario(
    'Figura Chainsawman',
    'Figura de Chainsawman P',
    19.99,
    20, -- Suponiendo que el id de la colección es 1
    3, -- Suponiendo que el id del tipo es 2
    3, -- Suponiendo que el id del proveedor es 1
    100, -- Suponiendo que hay 100 unidades en inventario
    'ruta/de/imagen.jpg,imagen5.jpg,imagen7.jpg,imagen8.jpg',
    "Activo"
    
);

select *from producto



DELIMITER $$


CREATE PROCEDURE InsertarProductoInventario(
    IN Nombre_Producto VARCHAR(250),
    IN Descripcion_Producto VARCHAR(255),
    IN Precio_Producto DOUBLE,
    IN id_coleccion INT,
    IN id_Tipo INT,
    IN id_proveedor INT,
    IN cantidad_Inventario INT,
    IN imagenes_list VARCHAR(4000),  -- Increase the length to accommodate longer lists
    IN status VARCHAR(8)
)
BEGIN
    DECLARE v_idProductoInsertado INT;
    DECLARE v_imagen VARCHAR(255);
    DECLARE v_imagenes VARCHAR(4000);  -- Variable to store the remaining part of the list
    DECLARE v_pos INT;  -- Position of the comma in the list

    INSERT INTO Producto (Nombre_Producto, Descripcion_Producto, Precio_Producto, id_coleccion, id_Tipo, status)
    VALUES (Nombre_Producto, Descripcion_Producto, Precio_Producto, id_coleccion, id_Tipo, status);

    SET v_idProductoInsertado = LAST_INSERT_ID();
    SET v_imagenes = imagenes_list;

    WHILE LENGTH(TRIM(v_imagenes)) > 0 DO
        SET v_pos = LOCATE(',', v_imagenes);
        IF v_pos = 0 THEN
            SET v_imagen = TRIM(v_imagenes);
            SET v_imagenes = '';
        ELSE
            SET v_imagen = TRIM(SUBSTRING(v_imagenes, 1, v_pos - 1));
            SET v_imagenes = TRIM(SUBSTRING(v_imagenes, v_pos + 1));
        END IF;

        INSERT INTO Imagen (id_Producto, imagen)
        VALUES (v_idProductoInsertado, v_imagen);
    END WHILE;

    INSERT INTO Producto_Proovedor (id_producto, id_proovedor)
    VALUES (v_idProductoInsertado, id_proveedor);

    INSERT INTO inventario (id_producto, Cantidad)
    VALUES (v_idProductoInsertado, cantidad_Inventario);
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE ActualizarProductoInventario(
    IN p_id_producto INT,
    IN p_Nombre_Producto VARCHAR(250),
    IN p_Descripcion_Producto VARCHAR(255),
    IN p_Precio_Producto DOUBLE,
    IN p_id_coleccion INT,
    IN p_id_Tipo INT,
    IN p_id_proveedor INT,
    IN p_cantidad_Inventario INT,
    IN p_imagenes VARCHAR(255)
)
BEGIN
    DECLARE v_imagen VARCHAR(255);

    -- Actualizar el producto
    UPDATE Producto
    SET Nombre_Producto = p_Nombre_Producto,
        Descripcion_Producto = p_Descripcion_Producto,
        Precio_Producto = p_Precio_Producto,
        id_coleccion = p_id_coleccion,
        id_Tipo = p_id_Tipo
    WHERE id = p_id_producto;

    -- Eliminar imágenes antiguas
    DELETE FROM Imagen WHERE id_Producto = p_id_producto;

    -- Insertar nuevas imágenes
    WHILE LENGTH(p_imagenes) > 0 DO
        SET v_imagen = SUBSTRING_INDEX(p_imagenes, ',', 1);
        SET p_imagenes = SUBSTRING(p_imagenes, LENGTH(v_imagen) + 2);

        INSERT INTO Imagen (id_Producto, imagen)
        VALUES (p_id_producto, v_imagen);
    END WHILE;

    -- Actualizar el proveedor
    UPDATE Producto_Proovedor
    SET id_proovedor = p_id_proveedor
    WHERE id_producto = p_id_producto;

    -- Actualizar el inventario
    UPDATE inventario
    SET Cantidad = p_cantidad_Inventario
    WHERE id_producto = p_id_producto;
END$$
DELIMITER ;


DELIMITER $$

CREATE PROCEDURE InsertarProductoRopa(
    IN p_Nombre_Producto VARCHAR(250),
    IN p_Descripcion_Producto VARCHAR(255),
    IN p_Precio_Producto DOUBLE,
    IN p_id_coleccion INT,
    IN p_id_Tipo INT,
    IN p_id_proveedor INT,
    IN p_cantidad INT,
    IN p_genero VARCHAR(6),
    IN p_tallas VARCHAR(50),
    IN p_imagenes VARCHAR(255)
)
BEGIN
    DECLARE v_idProductoInsertado INT;
    DECLARE v_id_inventario INT;
    DECLARE v_id_talla INT;
    DECLARE v_talla VARCHAR(8);
    DECLARE v_imagen VARCHAR(255);

    INSERT INTO Producto (Nombre_Producto, Descripcion_Producto, Precio_Producto, id_coleccion, id_Tipo)
    VALUES (p_Nombre_Producto, p_Descripcion_Producto, p_Precio_Producto, p_id_coleccion, p_id_Tipo);

    SET v_idProductoInsertado = LAST_INSERT_ID();

    -- Insertar imágenes
    WHILE LENGTH(p_imagenes) > 0 DO
        SET v_imagen = SUBSTRING_INDEX(p_imagenes, ',', 1);
        SET p_imagenes = SUBSTRING(p_imagenes, LENGTH(v_imagen) + 2);

        INSERT INTO Imagen (id_Producto, imagen)
        VALUES (v_idProductoInsertado, v_imagen);
    END WHILE;

    INSERT INTO Producto_Proovedor (id_producto, id_proovedor)
    VALUES (v_idProductoInsertado, p_id_proveedor);

    -- Insertar en la tabla Inventario_Ropa
    INSERT INTO Inventario_Ropa (id_producto, Cantidad, Genero)
    VALUES (v_idProductoInsertado, p_cantidad, p_genero);

    SET v_id_inventario = LAST_INSERT_ID();

    -- Separar las tallas por coma y insertarlas en la tabla Inventario_Ropa_Talla
    WHILE LENGTH(p_tallas) > 0 DO
        SET v_talla = SUBSTRING_INDEX(p_tallas, ',', 1);
        SET p_tallas = SUBSTRING(p_tallas, LENGTH(v_talla) + 2);

        SELECT id INTO v_id_talla
        FROM Talla
        WHERE Detalle_Talla = v_talla;

        IF v_id_talla IS NOT NULL THEN
            INSERT INTO Inventario_Ropa_Talla (id_Inventario, id_Talla)
            VALUES (v_id_inventario, v_id_talla);
        END IF;
    END WHILE;
END$$

DELIMITER ;


select 
P.Nombre_Producto,
I.Cantidad
from  Producto P
JOIN   inventario I ON  P.id = I.id_producto

DELIMITER $$
CREATE PROCEDURE ActualizarProductoRopa(
    IN p_id_producto INT,
    IN p_Nombre_Producto VARCHAR(250),
    IN p_Descripcion_Producto VARCHAR(255),
    IN p_Precio_Producto DOUBLE,
    IN p_id_coleccion INT,
    IN p_id_Tipo INT,
    IN p_id_proveedor INT,
    IN p_cantidad INT,
    IN p_genero VARCHAR(6),
    IN p_tallas VARCHAR(50),
    IN p_imagenes VARCHAR(255)
)
BEGIN
    DECLARE v_id_inventario INT;
    DECLARE v_id_talla INT;
    DECLARE v_talla VARCHAR(8);
    DECLARE v_imagen VARCHAR(255);

    -- Actualizar el producto
    UPDATE Producto
    SET Nombre_Producto = p_Nombre_Producto,
        Descripcion_Producto = p_Descripcion_Producto,
        Precio_Producto = p_Precio_Producto,
        id_coleccion = p_id_coleccion,
        id_Tipo = p_id_Tipo
    WHERE id = p_id_producto;

    -- Eliminar imágenes antiguas
    DELETE FROM Imagen WHERE id_Producto = p_id_producto;

    -- Insertar nuevas imágenes
    WHILE LENGTH(p_imagenes) > 0 DO
        SET v_imagen = SUBSTRING_INDEX(p_imagenes, ',', 1);
        SET p_imagenes = SUBSTRING(p_imagenes, LENGTH(v_imagen) + 2);

        INSERT INTO Imagen (id_Producto, imagen)
        VALUES (p_id_producto, v_imagen);
    END WHILE;

    -- Actualizar el proveedor
    UPDATE Producto_Proovedor
    SET id_proovedor = p_id_proveedor
    WHERE id_producto = p_id_producto;

    -- Actualizar el inventario de ropa
    UPDATE Inventario_Ropa
    SET Cantidad = p_cantidad,
        Genero = p_genero
    WHERE id_producto = p_id_producto;

    SET v_id_inventario = (SELECT id FROM Inventario_Ropa WHERE id_producto = p_id_producto);

    -- Eliminar tallas antiguas
    DELETE FROM Inventario_Ropa_Talla WHERE id_Inventario = v_id_inventario;

    -- Insertar nuevas tallas
    WHILE LENGTH(p_tallas) > 0 DO
        SET v_talla = SUBSTRING_INDEX(p_tallas, ',', 1);
        SET p_tallas = SUBSTRING(p_tallas, LENGTH(v_talla) + 2);

        SELECT id INTO v_id_talla
        FROM Talla
        WHERE Detalle_Talla = v_talla;

        IF v_id_talla IS NOT NULL THEN
            INSERT INTO Inventario_Ropa_Talla (id_Inventario, id_Talla)
            VALUES (v_id_inventario, v_id_talla);
        END IF;
    END WHILE;
END$$
DELIMITER ;



CALL ActualizarProductoInventario(
    7,
    'Nuevo Nombre',
    'Nueva Descripción',
    29.99,
    20,
    3,
    3,
    75,
    'Hombre',
    'nueva_imagen1.jpg,nueva_imagen2.jpg'
);
select *from tipo
select *from proovedor
select *from imagen
select *from inventario_ropa_talla
select *from rol
INSERt INTO ROL (id_usuario, status, Rol) values (785205, "Activo","ADMIN");
select *from usuario


DELIMITER $$
CREATE PROCEDURE DeleteProductLogical(IN p_id_producto INT)
BEGIN
    DECLARE v_id_inventario_ropa INT;
    -- Actualizar el estado del producto a "Inactivo"
    UPDATE Producto
    SET status = 'Inactivo'
    WHERE id = p_id_producto;

END$$
DELIMITER ;

select *from tipo;
CALL DeleteProductLogical (
 7
);
select *from  Vista_Productos;
select *from inventario_ropa;


select *from imagen;





delete from producto where id = 6;


CALL InsertarProductoInventario(
    'Example Product',             -- Nombre_Producto
    'This is a sample product',    -- Descripcion_Producto
    99.99,                         -- Precio_Producto
    1,                             -- id_coleccion
    1,                             -- id_Tipo
    8,                             -- id_proveedor
    10,                          -- cantidad_Inventario
    "imagen1.jph,imagen2.jpg",
    "Activo"
);


SELECT
    P.id AS Id,
    P.Nombre_Producto AS Nombre_Producto,
    I.Cantidad AS Cantidad,
    C.Nombre_Coleccion AS Coleccion,
    PV.Nombre_Proovedor AS Proveedor,
    P.status AS Status
FROM
    Producto AS P
JOIN
    Inventario AS I ON P.id = I.id_producto
JOIN
    Coleccion AS C ON P.id_coleccion = C.id
JOIN
    Producto_Proovedor AS PP ON P.id = PP.id_producto
JOIN
    Proovedor AS PV ON PP.id_proovedor = PV.id
JOIN
    Tipo AS T ON P.id_Tipo = T.id_tipo
WHERE
    T.Detalle != 'Ropa';
    
    select *from producto

 CREATE OR REPLACE VIEW Vista_Producto AS
SELECT
    P.id AS Id,
    P.Nombre_Producto AS Nombre_Producto,
    P.Descripcion_Producto AS Descripcion_Producto,
    P.Precio_Producto AS Precio_Producto,
    I.Cantidad AS Cantidad,
    IG.imagen AS imagen,
    T.id_tipo AS Categoria,
    C.id AS Coleccion,
    PV.id AS Proveedor,
    P.status AS Status
FROM
    Producto AS P
JOIN
    Inventario AS I ON P.id = I.id_producto
JOIN
    Coleccion AS C ON P.id_coleccion = C.id
JOIN
    Producto_Proovedor AS PP ON P.id = PP.id_producto
JOIN
    Proovedor AS PV ON PP.id_proovedor = PV.id
JOIN
    Tipo AS T ON P.id_Tipo = T.id;
JOIN
    Imagen AS IG ON P.id = IG.id_Producto

    
    CREATE VIEW Vista_Productos AS
SELECT
    P.id AS Id,
    P.Nombre_Producto AS Nombre_Producto,
    I.Cantidad AS Cantidad,
    C.Nombre_Coleccion AS Coleccion,
    PV.Nombre_Proovedor AS Proveedor,
    P.status AS Status
FROM
    Producto AS P
JOIN
    Inventario AS I ON P.id = I.id_producto
JOIN
    Coleccion AS C ON P.id_coleccion = C.id
JOIN
    Producto_Proovedor AS PP ON P.id = PP.id_producto
JOIN
    Proovedor AS PV ON PP.id_proovedor = PV.id
JOIN
    Tipo AS T ON P.id_Tipo = T.id_tipo
WHERE
    T.Detalle != 'Ropa';
    
	delete from imagen where  id_Producto = 6
    delete from producto where  id = 6
    select *from producto
    select *from imagen
    
    select *from producto





 CREATE OR REPLACE VIEW Vista_Producto AS
SELECT
    P.id AS Id,
    P.Nombre_Producto AS Nombre_Producto,
    P.Descripcion_Producto AS Descripcion_Producto,
    P.Precio_Producto AS Precio_Producto,
    I.Cantidad AS Cantidad,
    T.id_tipo AS Categoria,
    C.id AS Coleccion,
    PV.id AS Proveedor,
    P.status AS Status
FROM
    Producto AS P
JOIN
    Inventario AS I ON P.id = I.id_producto
JOIN
    Coleccion AS C ON P.id_coleccion = C.id
JOIN
    Producto_Proovedor AS PP ON P.id = PP.id_producto
JOIN
    Proovedor AS PV ON PP.id_proovedor = PV.id
JOIN
    Tipo AS T ON P.id_tipo = T.id_tipo
    
    select *from Vista_Producto 



    

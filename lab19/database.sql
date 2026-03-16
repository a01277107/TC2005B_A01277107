DROP DATABASE IF EXISTS crepas_maree;
CREATE DATABASE crepas_maree;
USE crepas_maree;

CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE productos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  imagen TEXT NOT NULL,
  categoria ENUM('arma', 'especiales', 'artesanales', 'saladas') NOT NULL
);

CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion VARCHAR(150)
);

CREATE TABLE privilegios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  clave VARCHAR(80) NOT NULL UNIQUE,
  descripcion VARCHAR(150)
);

CREATE TABLE usuario_rol (
  id_usuario INT NOT NULL,
  id_rol INT NOT NULL,
  PRIMARY KEY (id_usuario, id_rol),
  CONSTRAINT fk_usuario_rol_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_usuario_rol_rol FOREIGN KEY (id_rol) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE rol_privilegio (
  id_rol INT NOT NULL,
  id_privilegio INT NOT NULL,
  PRIMARY KEY (id_rol, id_privilegio),
  CONSTRAINT fk_rol_privilegio_rol FOREIGN KEY (id_rol) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_rol_privilegio_privilegio FOREIGN KEY (id_privilegio) REFERENCES privilegios(id) ON DELETE CASCADE
);

INSERT INTO productos (nombre, descripcion, precio, imagen, categoria)
VALUES
('Crepa Dulce Base', 'Base para personalizar con tus ingredientes favoritos.', 85.00, 'https://images.unsplash.com/photo-1515467837915-15c4777ba46d?auto=format&fit=crop&w=900&q=80', 'arma'),
('Fresa Suprema', 'Crepa con fresa, crema batida y chocolate.', 110.00, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80', 'especiales'),
('Miel Artesanal', 'Crepa con miel, nuez y queso crema.', 118.00, 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80', 'artesanales'),
('Jamón y Queso', 'Crepa salada clásica con queso gratinado.', 105.00, 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80', 'saladas');

INSERT INTO roles (nombre, descripcion) VALUES
('admin', 'Administrador general del sistema'),
('empleado', 'Personal operativo con acceso limitado'),
('cliente', 'Usuario final de la aplicación');

INSERT INTO privilegios (clave, descripcion) VALUES
('ver_menu', 'Puede consultar el menú del sistema'),
('ver_fidelidad', 'Puede consultar rewards y fidelidad'),
('ver_admin', 'Puede acceder al panel de administración'),
('crear_producto', 'Puede agregar productos al menú'),
('eliminar_producto', 'Puede eliminar productos del menú'),
('gestionar_usuarios', 'Puede asignar roles a otros usuarios');

INSERT INTO rol_privilegio (id_rol, id_privilegio)
SELECT r.id, p.id
FROM roles r
INNER JOIN privilegios p
WHERE r.nombre = 'admin'
  AND p.clave IN ('ver_menu', 'ver_fidelidad', 'ver_admin', 'crear_producto', 'eliminar_producto', 'gestionar_usuarios');

INSERT INTO rol_privilegio (id_rol, id_privilegio)
SELECT r.id, p.id
FROM roles r
INNER JOIN privilegios p
WHERE r.nombre = 'empleado'
  AND p.clave IN ('ver_menu', 'ver_fidelidad');

INSERT INTO rol_privilegio (id_rol, id_privilegio)
SELECT r.id, p.id
FROM roles r
INNER JOIN privilegios p
WHERE r.nombre = 'cliente'
  AND p.clave IN ('ver_menu', 'ver_fidelidad');

INSERT INTO usuarios (username, password) VALUES
('admin1', '$2b$12$ObC46AOoEv0IetM3HSj7FuaSdtWONWP98BPbegbLqcJjr29iWjUey'),
('empleado1', '$2b$12$VH.yk3wXbP2m6yQmc3DZNehqco.1KMztBod2CYotvBYfh87xdaq16'),
('cliente1', '$2b$12$3Jk/CxerMSOM0z/vX6s88.SKkq4O9bW.HGsg4TCfYi9BsyeflTiWq');

INSERT INTO usuario_rol (id_usuario, id_rol)
SELECT u.id, r.id FROM usuarios u CROSS JOIN roles r WHERE u.username = 'admin1' AND r.nombre = 'admin';

INSERT INTO usuario_rol (id_usuario, id_rol)
SELECT u.id, r.id FROM usuarios u CROSS JOIN roles r WHERE u.username = 'empleado1' AND r.nombre = 'empleado';

INSERT INTO usuario_rol (id_usuario, id_rol)
SELECT u.id, r.id FROM usuarios u CROSS JOIN roles r WHERE u.username = 'cliente1' AND r.nombre = 'cliente';

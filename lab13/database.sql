DROP DATABASE IF EXISTS crepas_maree;
CREATE DATABASE crepas_maree;
USE crepas_maree;

CREATE TABLE productos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  imagen TEXT NOT NULL,
  categoria ENUM('arma', 'especiales', 'artesanales', 'saladas') NOT NULL
);

INSERT INTO productos (nombre, descripcion, precio, imagen, categoria)
VALUES
('Crepa Dulce Base', 'Base para personalizar con tus ingredientes favoritos.', 85.00, 'https://images.unsplash.com/photo-1515467837915-15c4777ba46d?auto=format&fit=crop&w=900&q=80', 'arma'),
('Fresa Suprema', 'Crepa con fresa, crema batida y chocolate.', 110.00, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80', 'especiales'),
('Miel Artesanal', 'Crepa con miel, nuez y queso crema.', 118.00, 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80', 'artesanales'),
('Jamón y Queso', 'Crepa salada clásica con queso gratinado.', 105.00, 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80', 'saladas');
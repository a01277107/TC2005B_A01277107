-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-03-2026 a las 17:59:31
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ejercicio`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actor`
--

CREATE TABLE `actor` (
  `nombre` varchar(100) NOT NULL,
  `dirección` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fechanacimiento` date DEFAULT NULL,
  `sexo` char(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `elenco`
--

CREATE TABLE `elenco` (
  `título` varchar(150) NOT NULL,
  `año` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `sueldo` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudio`
--

CREATE TABLE `estudio` (
  `nomestudio` varchar(100) NOT NULL,
  `dirección` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pelicula`
--

CREATE TABLE `pelicula` (
  `título` varchar(150) NOT NULL,
  `año` int(11) NOT NULL,
  `duración` int(11) DEFAULT NULL,
  `encolor` tinyint(1) DEFAULT NULL,
  `presupuesto` decimal(15,2) DEFAULT NULL,
  `nomestudio` varchar(100) DEFAULT NULL,
  `idproductor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productor`
--

CREATE TABLE `productor` (
  `idproductor` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `dirección` varchar(255) DEFAULT NULL,
  `teléfono` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actor`
--
ALTER TABLE `actor`
  ADD PRIMARY KEY (`nombre`);

--
-- Indices de la tabla `elenco`
--
ALTER TABLE `elenco`
  ADD PRIMARY KEY (`título`,`año`,`nombre`),
  ADD KEY `nombre` (`nombre`);

--
-- Indices de la tabla `estudio`
--
ALTER TABLE `estudio`
  ADD PRIMARY KEY (`nomestudio`);

--
-- Indices de la tabla `pelicula`
--
ALTER TABLE `pelicula`
  ADD PRIMARY KEY (`título`,`año`),
  ADD KEY `nomestudio` (`nomestudio`),
  ADD KEY `idproductor` (`idproductor`);

--
-- Indices de la tabla `productor`
--
ALTER TABLE `productor`
  ADD PRIMARY KEY (`idproductor`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `elenco`
--
ALTER TABLE `elenco`
  ADD CONSTRAINT `elenco_ibfk_1` FOREIGN KEY (`título`,`año`) REFERENCES `pelicula` (`título`, `año`),
  ADD CONSTRAINT `elenco_ibfk_2` FOREIGN KEY (`nombre`) REFERENCES `actor` (`nombre`);

--
-- Filtros para la tabla `pelicula`
--
ALTER TABLE `pelicula`
  ADD CONSTRAINT `pelicula_ibfk_1` FOREIGN KEY (`nomestudio`) REFERENCES `estudio` (`nomestudio`),
  ADD CONSTRAINT `pelicula_ibfk_2` FOREIGN KEY (`idproductor`) REFERENCES `productor` (`idproductor`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

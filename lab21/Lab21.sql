-- A. La suma de las cantidades e importe total de todas las entregas realizadas durante el 97.
SELECT 
    SUM(E.Cantidad) AS Total_Unidades,
    SUM(E.Cantidad * (m.precio + impuesto)) AS Importe_Total
    FROM Entregan E
JOIN Materiales M ON E.Clave = M.Clave
WHERE E.Fecha BETWEEN 01/01/199 AND 31/12/97;

-- B. Para cada proveedor, obtener la razón social, número de entregas e importe total.
SELECT P.RazonSocial AS Nombre_proveedor, COUNT(E.Clave) AS Total_Entregas, SUM(E.Cantidad * (m.precio + impuesto)) AS Monto_Acumulado
FROM Proveedores P
JOIN Entregan E ON P.RFC = E.RFC
JOIN Materiales M ON E.Clave = M.Clave
GROUP BY P.RFC, P.RazonSocial;
SELECT M.Clave, M.Descripcion, 
SUM(E.Cantidad) AS CantidadTotal, 
MIN(E.Cantidad) AS CantidadMinima, 
MAX(E.Cantidad) AS CantidadMaxima, 
SUM(E.Cantidad * (M.Costo + impuesto)) AS ImporteTotal
FROM Materiales M
JOIN Entregan E ON M.Clave = E.Clave
GROUP BY M.Clave, M.Descripcion
HAVING AVG(E.Cantidad) > 400;
-- D. Por proveedor: razón social y promedio por material (excluyendo promedios < 500).
SELECT P.RazonSocial, M.Clave, M.descripcion, AVG(E.Cantidad) AS Promedio_Entregado
FROM Proveedores P
JOIN Entregan E ON P.RFC = E.RFC
JOIN Materiales M ON E.Clave = M.Clave
GROUP BY P.RFC, P.RazonSocial, M.Clave, M.descripcion
HAVING AVG(E.Cantidad) >= 500;

-- E. Misma consulta anterior para dos grupos: Promedio < 370 y Promedio > 450.
SELECT P.RazonSocial, M.Clave, M.descripcion, AVG(E.Cantidad) AS Promedio, 'Bajo (<370)' AS Categoría
FROM Proveedores P JOIN Entregan E ON P.RFC = E.RFC JOIN Materiales M ON E.Clave = M.Clave
GROUP BY P.RFC, P.RazonSocial, M.Clave, M.descripcion HAVING AVG(E.Cantidad) < 370
UNION ALL
SELECT P.RazonSocial, M.Clave, M.descripcion, AVG(E.Cantidad) AS Promedio, 'Alto (>450)' AS Categoría
FROM Proveedores P JOIN Entregan E ON P.RFC = E.RFC JOIN Materiales M ON E.Clave = M.Clave
GROUP BY P.RFC, P.RazonSocial, M.Clave, M.descripcion HAVING AVG(E.Cantidad) > 450;


-- 2. INSERCIÓN DE NUEVOS MATERIALES
INSERT INTO Materiales VALUES (1000, 'Varilla 3/8', 150.50, 16);
INSERT INTO Materiales VALUES (1010, 'Cemento Gris saco 50kg', 210.00, 16);
INSERT INTO Materiales VALUES (1020, 'Arena de río (m3)', 380.00, 0);
INSERT INTO Materiales VALUES (1030, 'Grava triturada (m3)', 420.00, 0);
INSERT INTO Materiales VALUES (1040, 'Clavo para madera 2pulg', 45.00, 16);


-- 3. CONSULTAS CON ROLES Y SUBCONSULTAS

-- A. Clave y descripción de los materiales que nunca han sido entregados.
SELECT Clave, Descripcion
FROM Materiales
WHERE Clave NOT IN (SELECT DISTINCT Clave FROM Entregan);

-- B. Proveedores que han entregado tanto a 'Vamos México' como a 'Querétaro Limpio'.
SELECT P.RazonSocial
FROM Proveedores P
WHERE P.RFC IN (
    SELECT E.RFC FROM Entregan E 
    JOIN Proyectos PR ON E.Numero = PR.Numero 
    WHERE PR.Denominacion = 'Vamos México'
)
AND P.RFC IN (
    SELECT E.RFC FROM Entregan E 
    JOIN Proyectos PR ON E.Numero = PR.Numero 
    WHERE PR.Denominacion = 'Querétaro Limpio'
);

-- C. Descripción de los materiales que nunca han sido entregados al proyecto 'CIT Yucatán'.
SELECT Descripcion
FROM Materiales
WHERE Clave NOT IN (
    SELECT E.Clave FROM Entregan E
    JOIN Proyectos PR ON E.Numero = PR.Numero
    WHERE PR.Denominacion = 'CIT Yucatán'
);

-- D. Razón social y promedio de proveedores con promedio > al del RFC 'VAGO780901'.
SELECT P.RazonSocial, AVG(E.Cantidad) AS Promedio_General
FROM Proveedores P
JOIN Entregan E ON P.RFC = E.RFC
GROUP BY P.RFC, P.RazonSocial
HAVING AVG(E.Cantidad) > (
    SELECT AVG(Cantidad) FROM Entregan WHERE RFC = 'VAGO780901'
);

-- E. RFC y Razón social: Proyecto 'Infonavit Durango' y Qty(2000) > Qty(2001).
SELECT P.RFC, P.RazonSocial
FROM Proveedores P
JOIN Entregan E ON P.RFC = E.RFC
JOIN Proyectos PR ON E.Numero = PR.Numero
WHERE PR.Denominacion = 'Infonavit Durango'
GROUP BY P.RFC, P.RazonSocial
HAVING 
    (SELECT COALESCE(SUM(Cantidad),0) FROM Entregan E1 
     WHERE E1.RFC = P.RFC AND E1.Fecha BETWEEN '01/01/2000' AND '31/01/2000') 
    > 
    (SELECT COALESCE(SUM(Cantidad),0) FROM Entregan E2 
     WHERE E2.RFC = P.RFC AND E2.Fecha BETWEEN '01/01/2001' AND '31/12/2001');
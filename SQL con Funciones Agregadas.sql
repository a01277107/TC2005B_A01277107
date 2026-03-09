SELECT nombre, SUM(sueldo) AS ingreso_total
FROM Elenco
GROUP BY nombre;

SELECT nomestudio, SUM(presupuesto) AS monto_total_80s
FROM Pelicula
WHERE año BETWEEN 1980 AND 1989
GROUP BY nomestudio
ORDER BY SUM(presupuesto) DESC;

SELECT E.nombre, AVG(E.sueldo) AS sueldo_promedio
FROM Elenco E
JOIN Actor A ON E.nombre = A.nombre
WHERE A.sexo = 'M' 
GROUP BY E.nombre
HAVING AVG(E.sueldo) >= 5000000
ORDER BY AVG (e.sueldo) DESC;

SELECT título AS titulo_pelicula, MIN(presupuesto) AS presupuesto_minimo, MIN(presupuesto)
FROM Pelicula
GROUP BY título;

SELECT MAX(sueldo) AS sueldo_maximo_actriz
FROM Elenco E
JOIN Actor A ON E.nombre = A.nombre
WHERE A.sexo = 'F'; -- Asumiendo 'F' para femenino

                   
                     
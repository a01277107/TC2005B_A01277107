const productos = [
    { nombre: "Teclado RGB", stock: 12 },
    { nombre: "Mouse Óptico", stock: 3 },
    { nombre: "Monitor 4K", stock: 7 },
    { nombre: "Cables HDMI", stock: 2 },
    { nombre: "Audífonos", stock: 15 }
];

let totalProductos = 0;

console.log("Reporte de Stock");

for (let i = 0; i < productos.length; i++) {
    let productoActual = productos[i];
    totalProductos += productoActual.stock;

    if (productoActual.stock < 5) {
        console.log(`ALERTA: El producto "${productoActual.nombre}" solo tiene ${productoActual.stock} unidades.`);
    }
}

console.log(`Total de artículos en bodega: ${totalProductos}`);
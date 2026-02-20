const http = require('http');
const fs = require('fs');

const servidor = http.createServer((peticion, respuesta) => {
    
    fs.readFile('index.html', (error, contenido) => {
        if (error) {
            respuesta.writeHead(500, { 'Content-Type': 'text/plain' });
            respuesta.end('Error: No se pudo cargar el archivo.');
        } else {
            respuesta.writeHead(200, { 'Content-Type': 'text/html' });
            respuesta.end(contenido);
        }
    });
});

const puerto = 3001;
servidor.listen(puerto, () => {
    console.log(`¡Servidor listo y corriendo!`);
    console.log(`Abre tu navegador y entra a: http://localhost:${puerto}`);
});
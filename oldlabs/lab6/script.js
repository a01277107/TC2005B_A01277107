// 1. Configuración inicial
const prices = {
    qty1: 1200,
    qty2: 850,
    qty3: 1500
};

const inputs = document.querySelectorAll('.input-qty');
const helpBox = document.getElementById('dynamic-help');
const titles = document.querySelectorAll('.product-title');

// 2. Función para calcular totales e IVA
function calculateTotal() {
    let subtotal = 0;

    inputs.forEach(input => {
        let val = parseInt(input.value) || 0;

        // Validación de rangos (Requisito)
        if (val < 0) { val = 0; input.value = 0; }
        if (val > 10) { 
            val = 10; 
            input.value = 10; 
            alert("Por políticas de exclusividad, solo se permiten 10 unidades por pieza.");
        }
        
        subtotal += val * prices[input.id];
    });

    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    // Actualizar el DOM
    document.getElementById('subtotal').innerText = `$${subtotal.toLocaleString('es-MX')}.00`;
    document.getElementById('iva').innerText = `$${iva.toLocaleString('es-MX')}.00`;
    document.getElementById('total').innerText = `$${total.toLocaleString('es-MX')}.00`;
}

// 3. Asignación de Eventos
inputs.forEach(input => {
    // Evento de cálculo en tiempo real
    input.addEventListener('input', calculateTotal);
    
    // Evento de Ayuda Dinámica: onFocus
    input.addEventListener('focus', () => {
        helpBox.innerText = "Tip: Si compras más de 5 unidades, el envío es gratis.";
        helpBox.style.backgroundColor = "#d4edda";
    });
    
    // Evento de Ayuda Dinámica: onBlur (cuando sales del campo)
    input.addEventListener('blur', () => {
        helpBox.innerText = "Pasa el cursor sobre un producto o campo para recibir asistencia.";
        helpBox.style.backgroundColor = "#e9ecef";
    });
});

// Eventos para cambiar estilo de letras (onMouseEnter / onMouseLeave)
titles.forEach(title => {
    title.addEventListener('mouseenter', () => {
        title.style.fontFamily = "'Georgia', serif";
        title.style.fontStyle = "italic";
        title.style.color = "#777";
    });

    title.addEventListener('mouseleave', () => {
        title.style.fontFamily = "inherit";
        title.style.fontStyle = "normal";
        title.style.color = "inherit";
    });
});

// 4. Temporizador (setInterval) para el Banner de Oferta
let timeLeft = 600; // 10 minutos
const banner = document.getElementById('promo-banner');

const timer = setInterval(() => {
    let mins = Math.floor(timeLeft / 60);
    let secs = timeLeft % 60;
    secs = secs < 10 ? '0' + secs : secs;

    banner.innerText = `🔥 OFERTA ESPECIAL: 15% de descuento adicional si compras en los próximos ${mins}:${secs}`;

    if (timeLeft <= 0) {
        clearInterval(timer);
        banner.innerText = "La oferta flash ha terminado. ¡Sigue descubriendo nuestra colección!";
        banner.style.backgroundColor = "#555";
    }
    timeLeft--;
}, 1000);
const canvas = document.getElementById('canvasMRU');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

// Elementos del DOM
const velocidadInput = document.getElementById('velocidad');
const velValor = document.getElementById('velValor');
const posInicialInput = document.getElementById('posInicial');
const posInicialValor = document.getElementById('posInicialValor');
const iniciarBtn = document.getElementById('iniciarBtn');
const reiniciarBtn = document.getElementById('reiniciarBtn');
const tiempoDisplay = document.getElementById('tiempoDisplay');
const posicionDisplay = document.getElementById('posicionDisplay');

// Variables de simulación
let v = 2.0;                // velocidad (m/s)
let x0_m = 5.0;             // posición inicial en metros
let x_m = x0_m;             // posición actual en metros
let t = 0;                  // tiempo transcurrido
let animacionId = null;
let corriendo = false;
let ultimoTimestamp = null;

// Escala: 10 píxeles por metro (para que 0-70 m ocupe 700 píxeles, dentro del canvas de 800)
const escala = 10; // px/m

// Actualizar etiquetas de los sliders
function actualizarLabels() {
    velValor.textContent = v.toFixed(1);
    posInicialValor.textContent = x0_m.toFixed(1);
}

// Convertir metros a píxeles (con offset para centrar el dibujo)
function metroAPx(metros) {
    return metros * escala;
}

// Dibujar escena
function dibujar() {
    ctx.clearRect(0, 0, width, height);

    // Dibujar suelo / línea de referencia
    ctx.beginPath();
    ctx.moveTo(0, height - 50);
    ctx.lineTo(width, height - 50);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Marcas de posición (cada 10 metros = 100 px)
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    for (let i = 0; i <= width; i += 100) {
        ctx.beginPath();
        ctx.moveTo(i, height - 55);
        ctx.lineTo(i, height - 45);
        ctx.strokeStyle = '#999';
        ctx.stroke();
        let metro = i / escala;
        ctx.fillText(metro + ' m', i - 15, height - 60);
    }

    // Posición del objeto en píxeles
    let x_px = metroAPx(x_m);

    // Dibujar objeto (un círculo rojo)
    ctx.beginPath();
    ctx.arc(x_px, height - 70, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#e53e3e';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Mostrar vector velocidad si es positiva/negativa
    if (v !== 0) {
        ctx.beginPath();
        ctx.moveTo(x_px, height - 90);
        ctx.lineTo(x_px + (v > 0 ? 30 : -30), height - 90);
        ctx.strokeStyle = v >= 0 ? 'green' : 'red';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Dibujar flecha
        ctx.fillStyle = v >= 0 ? 'green' : 'red';
        if (v > 0) {
            ctx.beginPath();
            ctx.moveTo(x_px + 30, height - 90);
            ctx.lineTo(x_px + 20, height - 95);
            ctx.lineTo(x_px + 20, height - 85);
            ctx.fill();
        } else if (v < 0) {
            ctx.beginPath();
            ctx.moveTo(x_px - 30, height - 90);
            ctx.lineTo(x_px - 20, height - 95);
            ctx.lineTo(x_px - 20, height - 85);
            ctx.fill();
        }
    }
}

// Actualizar posición según el tiempo
function actualizarPosicion() {
    x_m = x0_m + v * t;
    // Opcional: limitar para que no se salga visualmente (pero dejamos que se salga)
}

// Actualizar displays de tiempo y posición
function actualizarDisplays() {
    tiempoDisplay.textContent = t.toFixed(2);
    posicionDisplay.textContent = x_m.toFixed(1);
}

// Bucle de animación
function animar(timestamp) {
    if (!corriendo) return;

    if (ultimoTimestamp === null) {
        ultimoTimestamp = timestamp;
        requestAnimationFrame(animar);
        return;
    }

    const delta = (timestamp - ultimoTimestamp) / 1000; // delta en segundos
    t += delta;
    actualizarPosicion();
    actualizarDisplays();
    dibujar();

    ultimoTimestamp = timestamp;
    animacionId = requestAnimationFrame(animar);
}

// Iniciar simulación
function iniciar() {
    if (corriendo) return;
    corriendo = true;
    ultimoTimestamp = null;
    animacionId = requestAnimationFrame(animar);
}

// Pausar simulación
function pausar() {
    if (animacionId) {
        cancelAnimationFrame(animacionId);
        animacionId = null;
    }
    corriendo = false;
}

// Reiniciar simulación
function reiniciar() {
    pausar();
    t = 0;
    x0_m = parseFloat(posInicialInput.value);
    x_m = x0_m;
    actualizarDisplays();
    dibujar();
}

// Event listeners para sliders
velocidadInput.addEventListener('input', (e) => {
    v = parseFloat(e.target.value);
    velValor.textContent = v.toFixed(1);
    // Si no está corriendo, actualizar vista previa
    if (!corriendo) {
        actualizarPosicion(); // recalcula x_m con el nuevo v? En pausa no se mueve, pero podemos mostrar la posición actual con el nuevo v solo si t>0? Mejor no recalcular posición, solo dibujar el vector.
        dibujar();
    }
});

posInicialInput.addEventListener('input', (e) => {
    x0_m = parseFloat(e.target.value);
    posInicialValor.textContent = x0_m.toFixed(1);
    if (!corriendo) {
        x_m = x0_m; // solo si está en pausa y queremos que la posición inicial se actualice
        actualizarDisplays();
        dibujar();
    }
});

iniciarBtn.addEventListener('click', () => {
    if (corriendo) {
        pausar();
        iniciarBtn.textContent = '▶ Iniciar';
    } else {
        iniciar();
        iniciarBtn.textContent = '⏸ Pausar';
    }
});

reiniciarBtn.addEventListener('click', () => {
    pausar();
    t = 0;
    x0_m = parseFloat(posInicialInput.value);
    x_m = x0_m;
    actualizarDisplays();
    dibujar();
    iniciarBtn.textContent = '▶ Iniciar';
});

// Inicializar
actualizarLabels();
dibujar();

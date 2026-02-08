// ============================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ============================================

// Elementos del DOM
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const btnBack = document.getElementById('btn-back');
const btnShare = document.getElementById('btn-share');
const screenOne = document.getElementById('screen-one');
const screenTwo = document.getElementById('screen-two');
const confettiCanvas = document.getElementById('confetti-canvas');
const notification = document.getElementById('copy-notification');
const letterDate = document.getElementById('letter-date');

// Canvas para confeti
const ctx = confettiCanvas.getContext('2d');
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

// Array de confeti
let confetti = [];

// ============================================
// INICIALIZACIÓN - Configurar fecha de la carta
// ============================================
function initializeLetterDate() {
    const today = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const dateString = today.toLocaleDateString('es-ES', options);
    letterDate.textContent = dateString.charAt(0).toUpperCase() + dateString.slice(1);
}

// ============================================
// FUNCIÓN: Cambiar entre pantallas
// ============================================
function switchScreen(from, to) {
    from.classList.remove('screen-active');
    setTimeout(() => {
        to.classList.add('screen-active');
    }, 100);
}

// ============================================
// FUNCIÓN: Botón NO - Se mueve aleatoriamente
// ============================================
function moveNoButton() {
    // Obtener dimensiones de la ventana
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Obtener dimensiones del botón
    const btnWidth = btnNo.offsetWidth;
    const btnHeight = btnNo.offsetHeight;

    // Margen de seguridad (el botón no se saldrá de la pantalla)
    const margin = 20;

    // Generar posición aleatoria dentro de los límites
    const randomX = Math.random() * (windowWidth - btnWidth - margin * 2) + margin;
    const randomY = Math.random() * (windowHeight - btnHeight - margin * 2) + margin;

    // Aplicar la posición con transición suave
    btnNo.style.position = 'fixed';
    btnNo.style.left = randomX + 'px';
    btnNo.style.top = randomY + 'px';
    btnNo.style.zIndex = '25';

    // Agregar animación de aparición
    btnNo.style.transition = 'all 0.3s ease-out';
    btnNo.style.transform = 'scale(1.05)';

    setTimeout(() => {
        btnNo.style.transform = 'scale(1)';
    }, 150);
}

// ============================================
// FUNCIÓN: Generar Confeti
// ============================================
function createConfetti() {
    const confettiCount = 50;
    const colors = ['#FF69B4', '#FFB6D9', '#E63946', '#FF1744', '#FFF0F7'];

    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 12,
            vy: Math.random() * 8 - 4,
            life: 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationVelocity: (Math.random() - 0.5) * 0.2,
            shape: Math.random() > 0.5 ? 'heart' : 'circle'
        });
    }
}

// ============================================
// FUNCIÓN: Animar Confeti
// ============================================
function animateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confetti = confetti.filter(particle => particle.life > 0);

    confetti.forEach(particle => {
        // Actualizar posición
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.2; // Gravedad
        particle.life -= 0.015;
        particle.rotation += particle.rotationVelocity;

        // Dibujar partícula
        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);

        if (particle.shape === 'heart') {
            drawHeart(0, 0, 8);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, 5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    });

    // Continuar animación si hay confeti activo
    if (confetti.length > 0) {
        requestAnimationFrame(animateConfetti);
    }
}

// ============================================
// FUNCIÓN: Dibujar corazón en canvas
// ============================================
function drawHeart(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size);
    ctx.bezierCurveTo(
        x - size * 1.5, y + size * 0.5,
        x - size * 1.5, y - size * 0.5,
        x, y - size * 0.5
    );
    ctx.bezierCurveTo(
        x + size * 1.5, y - size * 0.5,
        x + size * 1.5, y + size * 0.5,
        x, y + size
    );
    ctx.fill();
}

// ============================================
// FUNCIÓN: Mostrar notificación
// ============================================
function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ============================================
// FUNCIÓN: Copiar carta al portapapeles
// ============================================
function copyLetterToClipboard() {
    const letterContent = document.getElementById('letter-content').innerText;

    navigator.clipboard.writeText(letterContent).then(() => {
        showNotification('Carta copiada al portapapeles');
    }).catch(() => {
        showNotification(' Error al copiar. Intenta de nuevo.');
    });
}

// ============================================
// EVENT LISTENERS
// ============================================

// Botón SÍ - Dispara confeti y cambia a pantalla 2
btnYes.addEventListener('click', () => {
    // Crear y animar confeti
    createConfetti();
    animateConfetti();

    // Cambiar pantalla con retraso
    setTimeout(() => {
        switchScreen(screenOne, screenTwo);
    }, 300);
});

// Botón NO - Se mueve cuando se intenta hacer clic o se pasa el mouse
btnNo.addEventListener('mouseover', moveNoButton);
btnNo.addEventListener('mousedown', (e) => {
    e.preventDefault();
    moveNoButton();
});

// En móvil, también se mueve al intentar tocar
btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});

// Botón Atrás - Volver a la pantalla 1
btnBack.addEventListener('click', () => {
    switchScreen(screenTwo, screenOne);
    confetti = []; // Limpiar confeti
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    // Resetear posición del botón NO
    btnNo.style.position = 'static';
    btnNo.style.left = 'auto';
    btnNo.style.top = 'auto';
});

// Botón Compartir - Copiar carta
btnShare.addEventListener('click', copyLetterToClipboard);

// Resize del canvas cuando la ventana cambia de tamaño
window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});

// ============================================
// SOPORTE PARA TECLADO
// ============================================
document.addEventListener('keydown', (e) => {
    // Presionar Enter en el botón Sí
    if (e.key === 'Enter' && screenOne.classList.contains('screen-active')) {
        if (document.activeElement === btnYes) {
            btnYes.click();
        }
    }

    // ESC para volver
    if (e.key === 'Escape' && screenTwo.classList.contains('screen-active')) {
        btnBack.click();
    }
});

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeLetterDate();

    // Agregar un poco de interactividad al cargar
    console.log('💕 ¡Página de San Valentín cargada! ¡Que empiece la magia! 💕');
});

// ============================================
// EFECTO ADICIONAL: Hacer que los corazones flotantes
// se muevan más suavemente
// ============================================
window.addEventListener('mousemove', (e) => {
    // Efecto sutil de paralaje con los corazones flotantes
    const hearts = document.querySelectorAll('.heart');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    hearts.forEach((heart, index) => {
        const moveX = (x - 0.5) * 10 * (index % 2 === 0 ? 1 : -1);
        const moveY = (y - 0.5) * 10 * (index % 2 === 0 ? -1 : 1);

        heart.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// ============================================
// SOPORTE PARA ORIENTACIÓN EN DISPOSITIVOS
// ============================================
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }, 100);
});

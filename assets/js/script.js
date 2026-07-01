// --- EFECTO MÁQUINA DE ESCRIBIR (TYPEWRITER) ---
const textoTitulo = "Becerra Ymán";
const textoSubtitulo = "Desarrollador Full-Stack & Estudiante de Ingeniería de Sistemas";

const elementoTitulo = document.getElementById('efecto-typing');
const elementoSubtitulo = document.getElementById('efecto-subtitulo');
const cursor = document.querySelector('.cursor-escribiendo');

// Tiempos de escritura (en milisegundos por letra)
const velocidadTitulo = 100;
const velocidadSubtitulo = 40;

let indexTitulo = 0;
let indexSubtitulo = 0;

function escribirTitulo() {
    if (indexTitulo < textoTitulo.length) {
        elementoTitulo.textContent += textoTitulo.charAt(indexTitulo);
        indexTitulo++;
        setTimeout(escribirTitulo, velocidadTitulo);
    } else {
        // Cuando termine el título, esperamos un momento y empezamos el subtítulo
        setTimeout(escribirSubtitulo, 300);
    }
}

function escribirSubtitulo() {
    if (indexSubtitulo < textoSubtitulo.length) {
        elementoSubtitulo.textContent += textoSubtitulo.charAt(indexSubtitulo);
        indexSubtitulo++;
        setTimeout(escribirSubtitulo, velocidadSubtitulo);
    } else {
        // Desvanecer el cursor elegantemente al finalizar todo
        if (cursor) cursor.classList.add('ocultar-cursor');
    }
}

// Iniciar la animación al cargar la página por completo
window.addEventListener('DOMContentLoaded', () => {
    // Un pequeño delay inicial para que combine con la caída del carnet
    setTimeout(escribirTitulo, 500);
});
// --- LÓGICA DE FÍSICAS FLUIDAS PARA EL CARNET (60FPS) ---
const sistema = document.getElementById('sistema');
const cinta = document.getElementById('cinta');
const tarjeta = document.getElementById('tarjeta');
const anclaje = document.getElementById('puntoAnclaje');

let arrastrando = false;

// Limpieza de la animación de caída inicial
sistema.addEventListener('animationend', () => {
    sistema.classList.remove('caida-inicial');
});

function moverCarnet(clientX, clientY) {
    sistema.classList.remove('caida-inicial');

    const rectAnclaje = anclaje.getBoundingClientRect();
    const origenX = rectAnclaje.left + (rectAnclaje.width / 2); // Ajustado al centro real del anclaje
    const origenY = rectAnclaje.top;

    const dx = clientX - origenX;
    const dy = clientY - origenY;

    // Ángulo de inclinación del péndulo
    const anguloRad = Math.atan2(dx, dy);
    const anguloDeg = -anguloRad * (180 / Math.PI);

    // Distancia total recorrida por el cursor
    const distanciaTotal = Math.sqrt(dx * dx + dy * dy);

    // Factor de estiramiento basado en la altura de la cinta (120px)
    let factorEstiramiento = (distanciaTotal - 80) / 120;
    if (factorEstiramiento < 0.4) factorEstiramiento = 0.4; // Límites controlados
    if (factorEstiramiento > 2.3) factorEstiramiento = 2.3;

    // Cálculo del desplazamiento vertical de la tarjeta acoplada
    const desplazamientoTarjetaY = (factorEstiramiento - 1) * 120;

    // Inclinación aerodinámica lateral 3D
    const inclinacionTarjeta3D = (dx * 0.15);

    // Renderizado ultra-rápido por Hardware (GPU)
    sistema.style.transform = `rotate(${anguloDeg}deg)`;
    cinta.style.transform = `scaleY(${factorEstiramiento})`;
    tarjeta.style.transform = `translateY(${desplazamientoTarjetaY}px) rotate(${anguloDeg * -0.2}deg) rotateY(${inclinacionTarjeta3D}deg)`;
}

// --- CAPTURA DE EVENTOS (MOUSE & TOUCH UNIFICADOS) ---
const iniciarArrastre = (e) => {
    arrastrando = true;
    anclaje.style.zIndex = "100"; // Eleva el carnet sobre todo el contenido del portafolio
    document.body.classList.remove('regresando');
};

const finalizarArrastre = () => {
    if (!arrastrando) return;
    arrastrando = false;

    document.body.classList.add('regresando');

    // Reseteo con transiciones elásticas controladas por CSS cubic-bezier
    sistema.style.transform = 'rotate(0deg)';
    cinta.style.transform = 'scaleY(1)';
    tarjeta.style.transform = 'translateY(0px) rotate(0deg) rotateY(0deg)';

    // Limpieza de z-index tras terminar la transición elástica de regreso
    setTimeout(() => {
        if (!arrastrando) anclaje.style.zIndex = "40";
    }, 700);
};

// Listeners de Mouse
tarjeta.addEventListener('mousedown', iniciarArrastre);
window.addEventListener('mousemove', (e) => {
    if (!arrastrando) return;
    window.requestAnimationFrame(() => moverCarnet(e.clientX, e.clientY));
});
window.addEventListener('mouseup', finalizarArrastre);

// Listeners Táctiles (Mobile)
tarjeta.addEventListener('touchstart', iniciarArrastre, { passive: true });
window.addEventListener('touchmove', (e) => {
    if (!arrastrando) return;
    const touch = e.touches[0];
    window.requestAnimationFrame(() => moverCarnet(touch.clientX, touch.clientY));
}, { passive: true });
window.addEventListener('touchend', finalizarArrastre);

// --- Control Menú Móvil ---
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');

btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.add('hidden');
    });
});

// --- Filtro de Proyectos ---
function filterProjects(category) {
    // Actualizar botones de filtro
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active', 'bg-cyan-500', 'text-darkblue-950');
        btn.classList.add('border', 'border-white/5', 'text-slate-400');
    });

    // Activar botón seleccionado
    const activeBtn = event.currentTarget;
    activeBtn.classList.remove('border', 'border-white/5', 'text-slate-400');
    activeBtn.classList.add('active', 'bg-cyan-500', 'text-darkblue-950');

    // Filtrar cards de proyectos
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        if (category === 'todos' || card.getAttribute('data-cat') === category) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// --- Datos de los Proyectos para las Modales ---
const projectData = {
    clinica: {
        title: "Sistema de Gestión de Clínica",
        type: "Producción Real - Gestión Sanitaria",
        desc: "Se estructuró una solución completa para automatizar y administrar clínicas privadas, controlando el flujo desde que el paciente reserva una cita hasta el balance contable final del día.",
        challenge: "Se necesitaba agilizar el registro evitando errores manuales de identificación de pacientes y asegurar que los ingresos contables cuadrasen perfectamente sin pérdidas.",
        solution: "Desarrollé la arquitectura bajo el patrón de diseño MVC utilizando PHP. Integré una API externa de identificación para buscar de manera automatizada y precisa los datos mediante DNI. Programé un sistema contable de arqueo diario de caja para reportar balances con un clic.",
        stack: ["PHP", "Patrón MVC", "MySQL", "JavaScript / AJAX", "APIs de Identidad (DNI)"],
        icon: "fa-notes-medical"
    },
    pasajes: {
        title: "Pasajes Multiempresa",
        type: "Proyecto Final Universitario de Ciclo",
        desc: "Se concibió un portal centralizado que permite a los usuarios buscar y cotizar itinerarios de viajes terrestres de diversas compañías de buses en un único lugar.",
        challenge: "Coordinar múltiples programaciones, rutas de viaje cambiantes de buses e implementar de forma simulada un sistema transaccional de compra que sea seguro y no permita sobreventas de asientos.",
        solution: "Construido en el entorno corporativo de Java Web utilizando JSP, Servlets y base de datos MySQL relacional. Diseñé un modelo transaccional que asegura la disponibilidad de asientos en tiempo real y permite a los administradores parametrizar precios, flotas y horarios de viaje de múltiples cooperativas.",
        stack: ["Java Web", "JSP & Servlets", "MySQL", "CSS3 Estructurado"],
        icon: "fa-bus"
    },
    votacion: {
        title: "Votación Electrónica Escolar",
        type: "Proyecto de Prácticas Profesionales",
        desc: "Desarrollo institucional creado para agilizar y modernizar el sufragio de estudiantes a cargos de representación estudiantil.",
        challenge: "Los procesos electorales anteriores en papel tomaban horas de conteo manual y eran vulnerables a reclamos y errores de cálculo en el escrutinio de votos.",
        solution: "Desarrollé un sistema web ágil e interactivo con PHP, MySQL y Javascript nativo. Al cerrar las urnas virtuales, el sistema realiza la sumatoria matemática y visualiza gráficos con los resultados finales de inmediato, garantizando transparencia absoluta.",
        stack: ["PHP", "MySQL", "Vanilla JavaScript", "HTML5 & CSS3"],
        icon: "fa-square-poll-horizontal"
    }
};

// --- Control de Ventana Modal ---
const modal = document.getElementById('project-modal');
const modalContent = document.getElementById('modal-content');

function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalContent.innerHTML = `
                <div class="flex items-center gap-4 pb-4 border-b border-white/10">
                    <div class="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-2xl">
                        <i class="fa-solid ${data.icon}"></i>
                    </div>
                    <div>
                        <h3 class="font-display font-bold text-2xl text-white">${data.title}</h3>
                        <span class="text-xs text-cyan-400 font-semibold tracking-wide uppercase">${data.type}</span>
                    </div>
                </div>

                <div class="space-y-4 text-sm leading-relaxed">
                    <div>
                        <h4 class="font-display font-bold text-slate-200 mb-1">Descripción</h4>
                        <p class="text-slate-400">${data.desc}</p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div class="bg-darkblue-950/50 p-4 rounded-xl border border-white/5">
                            <h4 class="font-display font-bold text-emerald-400 text-xs uppercase tracking-wider mb-2">El Desafío</h4>
                            <p class="text-xs text-slate-400">${data.challenge}</p>
                        </div>
                        <div class="bg-darkblue-950/50 p-4 rounded-xl border border-white/5">
                            <h4 class="font-display font-bold text-cyan-400 text-xs uppercase tracking-wider mb-2">La Solución</h4>
                            <p class="text-xs text-slate-400">${data.solution}</p>
                        </div>
                    </div>

                    <div class="pt-2">
                        <h4 class="font-display font-bold text-slate-200 mb-2">Tecnologías Clave</h4>
                        <div class="flex flex-wrap gap-2">
                            ${data.stack.map(tech => `<span class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 border border-white/5">${tech}</span>`).join('')}
                        </div>
                    </div>
                </div>

                <div class="flex gap-4 pt-6 border-t border-white/10">
                    <a href="https://github.com/jos232004" target="_blank" class="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-darkblue-950 font-bold text-center hover:scale-[1.01] transition-transform duration-200">
                        <i class="fa-brands fa-github mr-1"></i> Explorar en GitHub
                    </a>
                    <button onclick="closeModal()" class="px-6 py-3.5 rounded-xl border border-white/10 text-white hover:text-slate-200 font-bold transition-all duration-200">
                        Cerrar
                    </button>
                </div>
            `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Bloquear scroll de fondo
}

function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // Restaurar scroll
}

// Cerrar modal al hacer click fuera del contenedor
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// --- Gestión Formulario de Contacto ---
function handleContactSubmit(event) {
    event.preventDefault();

    // Simulación estética de procesamiento en servidor
    const form = document.getElementById('contact-form');
    const alert = document.getElementById('success-alert');

    // Ocultar form con animación sutil, mostrar aviso de envío exitoso
    form.classList.add('opacity-50', 'pointer-events-none');

    setTimeout(() => {
        form.reset();
        form.classList.remove('opacity-50', 'pointer-events-none');
        alert.classList.remove('hidden');

        // Ocultar alerta de éxito automáticamente tras 6 segundos
        setTimeout(() => {
            alert.classList.add('hidden');
        }, 6000);
    }, 1000);
}
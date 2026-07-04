// ==========================================================================
// 1. --- EFECTO MÁQUINA DE ESCRIBIR CON BUCLE Y BORRADO (HERO SECTION) ---
// ==========================================================================
const textoTitulo = "Becerra Ymán";
const frasesSubtitulo = [
    "Desarrollador Full-Stack",
    "Estudiante de Ingeniería de Sistemas"
];

const elementoTitulo = document.getElementById('efecto-typing');
const elementoSubtitulo = document.getElementById('efecto-subtitulo');

let indexTitulo = 0;
let fraseActualIndex = 0;
let letraIndex = 0;
let estaBorrando = false;

function escribirTitulo() {
    if (indexTitulo < textoTitulo.length) {
        elementoTitulo.textContent += textoTitulo.charAt(indexTitulo);
        indexTitulo++;
        setTimeout(escribirTitulo, 100);
    } else {
        setTimeout(bucleSubtitulo, 400);
    }
}

function bucleSubtitulo() {
    const textoCompleto = frasesSubtitulo[fraseActualIndex];

    if (!estaBorrando) {
        elementoSubtitulo.textContent = textoCompleto.substring(0, letraIndex + 1);
        letraIndex++;

        if (letraIndex === textoCompleto.length) {
            estaBorrando = true;
            setTimeout(bucleSubtitulo, 2000);
            return;
        }
        setTimeout(bucleSubtitulo, 60);
    } else {
        elementoSubtitulo.textContent = textoCompleto.substring(0, letraIndex - 1);
        letraIndex--;

        if (letraIndex === 0) {
            estaBorrando = false;
            fraseActualIndex = (fraseActualIndex + 1) % frasesSubtitulo.length;
            setTimeout(bucleSubtitulo, 200);
            return;
        }
        setTimeout(bucleSubtitulo, 30);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(escribirTitulo, 500); // Sincronizado con la caída del carnet
});

// ==========================================================================
// 2. --- LÓGICA DE FÍSICAS FLUIDAS PARA EL CARNET (CORREGIDO Y BLINDADO) ---
// ==========================================================================
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
    if (!arrastrando) return;
    sistema.classList.remove('caida-inicial');

    const rectAnclaje = anclaje.getBoundingClientRect();
    const origenX = rectAnclaje.left + (rectAnclaje.width / 2);
    const origenY = rectAnclaje.top;

    const dx = clientX - origenX;
    const dy = clientY - origenY;

    // Control de fallos matemáticos por tirones bruscos (NaN guardrails)
    if (isNaN(dx) || isNaN(dy)) return;

    const anguloRad = Math.atan2(dx, dy);
    const anguloDeg = -anguloRad * (180 / Math.PI);
    const distanciaTotal = Math.sqrt(dx * dx + dy * dy);

    let factorEstiramiento = (distanciaTotal - 80) / 120;
    if (factorEstiramiento < 0.4) factorEstiramiento = 0.4;
    if (factorEstiramiento > 2.3) factorEstiramiento = 2.3;

    const desplazamientoTarjetaY = (factorEstiramiento - 1) * 120;
    const inclinacionTarjeta3D = (dx * 0.15);

    // Renderizado por aceleración de Hardware
    sistema.style.transform = `rotate(${anguloDeg}deg)`;
    cinta.style.transform = `scaleY(${factorEstiramiento})`;
    tarjeta.style.transform = `translateY(${desplazamientoTarjetaY}px) rotate(${anguloDeg * -0.2}deg) rotateY(${inclinacionTarjeta3D}deg)`;
}

// Controladores Unificados de Arrastre
const iniciarArrastre = (e) => {
    arrastrando = true;
    anclaje.style.zIndex = "100";
    document.body.classList.remove('regresando');
};

const finalizarArrastre = () => {
    if (!arrastrando) return;
    arrastrando = false;

    document.body.classList.add('regresando');

    // Reseteo limpio de vuelta al origen
    sistema.style.transform = 'rotate(0deg)';
    cinta.style.transform = 'scaleY(1)';
    tarjeta.style.transform = 'translateY(0px) rotate(0deg) rotateY(0deg)';

    setTimeout(() => {
        if (!arrastrando) anclaje.style.zIndex = "40";
    }, 700);
};

// 🌟 SOLUCIÓN AL PROBLEMA FÍSICO: Rastrear movimiento y soltado a nivel de WINDOW global
tarjeta.addEventListener('mousedown', iniciarArrastre);

window.addEventListener('mousemove', (e) => {
    if (!arrastrando) return;
    window.requestAnimationFrame(() => moverCarnet(e.clientX, e.clientY));
});

window.addEventListener('mouseup', finalizarArrastre);
// Freno de seguridad adicional por si el puntero abandona la ventana del navegador
window.addEventListener('mouseleave', finalizarArrastre);

// Listeners Táctiles Blindados (Mobile)
tarjeta.addEventListener('touchstart', iniciarArrastre, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (!arrastrando) return;
    const touch = e.touches[0];
    window.requestAnimationFrame(() => moverCarnet(touch.clientX, touch.clientY));
}, { passive: true });

window.addEventListener('touchend', finalizarArrastre);
window.addEventListener('touchcancel', finalizarArrastre); // Captura llamadas o interrupciones en celular

// ==========================================================================
// 3. --- CONTROL MENÚ MÓVIL ---
// ==========================================================================
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

// ==========================================================================
// 4. --- FILTRO DE PROYECTOS ---
// ==========================================================================
function filterProjects(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active', 'bg-cyan-500', 'text-darkblue-950');
        btn.classList.add('border', 'border-white/5', 'text-slate-400');
    });

    const activeBtn = event.currentTarget;
    activeBtn.classList.remove('border', 'border-white/5', 'text-slate-400');
    activeBtn.classList.add('active', 'bg-cyan-500', 'text-darkblue-950');

    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        if (category === 'todos' || card.getAttribute('data-cat') === category) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// ==========================================================================
// 5. --- DATOS DE LOS PROYECTOS Y MODALES ---
// ==========================================================================
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
        desc: "Desarrollo institutional creado para agilizar y modernizar el sufragio de estudiantes a cargos de representación estudiantil.",
        challenge: "Los procesos electorales anteriores en papel tomaban horas de conteo manual y eran vulnerables a reclamos y errores de cálculo en el escrutinio de votos.",
        solution: "Desarrollé un sistema web ágil e interactivo con PHP, MySQL y Javascript nativo. Al cerrar las urnas virtuales, el sistema realiza la sumatoria matemática y visualiza gráficos con los resultados finales de inmediato, garantizando transparencia absoluta.",
        stack: ["PHP", "MySQL", "Vanilla JavaScript", "HTML5 & CSS3"],
        icon: "fa-square-poll-horizontal"
    }
};

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
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// ==========================================================================
// 6. --- GESTIÓN FORMULARIO DE CONTACTO ---
// ==========================================================================
function handleContactSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('contact-form');
    const alert = document.getElementById('success-alert');

    form.classList.add('opacity-50', 'pointer-events-none');

    setTimeout(() => {
        form.reset();
        form.classList.remove('opacity-50', 'pointer-events-none');
        alert.classList.remove('hidden');

        setTimeout(() => {
            alert.classList.add('hidden');
        }, 6000);
    }, 1000);
}

// ==========================================================================
// 7. --- EFECTO MÁQUINA DE ESCRIBIR EN EL AVATAR (SOBRE MÍ) ---
// ==========================================================================
const textoAvatarUser = "jos232004";
const textoAvatarRol = "Full-Stack Dev";

const elementoAvatarUser = document.getElementById('typing-avatar');
const elementoAvatarRol = document.getElementById('typing-rol');
const cursorAvatar = document.querySelector('#sobre-mi .cursor-escribiendo');

let idxUser = 0;
let idxRol = 0;
let sobreMiAnimado = false;

function escribirAvatar() {
    if (idxUser < textoAvatarUser.length) {
        elementoAvatarUser.textContent += textoAvatarUser.charAt(idxUser);
        idxUser++;
        setTimeout(escribirAvatar, 90);
    }
    else if (idxRol < textoAvatarRol.length) {
        elementoAvatarRol.textContent += textoAvatarRol.charAt(idxRol);
        idxRol++;
        setTimeout(escribirAvatar, 60);
    }
    else {
        setTimeout(() => {
            if (cursorAvatar) cursorAvatar.style.display = 'none';
        }, 1500);
    }
}

const observerSobreMi = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !sobreMiAnimado) {
            sobreMiAnimado = true;
            setTimeout(escribirAvatar, 300);
        }
    });
}, { threshold: 0.25 });

const seccionSobreMi = document.getElementById('sobre-mi');
if (seccionSobreMi) {
    observerSobreMi.observe(seccionSobreMi);
}
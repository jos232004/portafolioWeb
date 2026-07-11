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

// Rastrear movimiento y soltado a nivel de WINDOW global para PC
tarjeta.addEventListener('mousedown', iniciarArrastre);

window.addEventListener('mousemove', (e) => {
    if (!arrastrando) return;
    window.requestAnimationFrame(() => moverCarnet(e.clientX, e.clientY));
});

window.addEventListener('mouseup', finalizarArrastre);
window.addEventListener('mouseleave', finalizarArrastre);

// 📱 LISTENERS TÁCTILES BLINDADOS (EVITA EL SCROLL DE LA WEB EN MÓVILES)
tarjeta.addEventListener('touchstart', iniciarArrastre, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (!arrastrando) return;

    // AQUÍ ESTÁ EL CAMBIO: Cancela por completo el scroll nativo del navegador móvil
    if (e.cancelable) {
        e.preventDefault();
    }

    const touch = e.touches[0];
    window.requestAnimationFrame(() => moverCarnet(touch.clientX, touch.clientY));
}, { passive: false }); //  CAMBIADO A FALSE: Obligatorio para permitir el preventDefault()

window.addEventListener('touchend', finalizarArrastre);
window.addEventListener('touchcancel', finalizarArrastre);

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
// 5. --- ARQUITECTURA DINÁMICA: DATOS POR FETCH ASÍNCRONO (OPTIMIZADO) ---
// ==========================================================================
const modal = document.getElementById('project-modal');
const modalContent = document.getElementById('modal-content');

// Función asíncrona para cargar los detalles del proyecto bajo demanda (Lazy Loading)
async function openModal(projectId) {
    try {
        // 1. Buscamos el botón o tarjeta que disparó el evento para darle feedback visual de carga
        const triggerButton = event?.currentTarget;
        if (triggerButton) triggerButton.style.cursor = 'wait';

        // 2. Consumo asíncrono del recurso JSON local
        const response = await fetch('data/proyectos.json');

        if (!response.ok) {
            throw new Error(`Error al cargar los datos. Status: ${response.status}`);
        }

        const projectData = await response.json();
        const data = projectData[projectId];

        if (!data) {
            console.error(`El ID de proyecto "${projectId}" no existe en el JSON.`);
            if (triggerButton) triggerButton.style.cursor = '';
            return;
        }

        // 3. Renderizado reactivo dentro del modal
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

        // 4. Mostramos el modal y restauramos el cursor
        if (triggerButton) triggerButton.style.cursor = '';
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

    } catch (error) {
        console.error("Error crítico en la arquitectura de datos:", error);
        alert("No se pudieron cargar los detalles del proyecto en este momento.");
    }
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
// 6. --- GESTIÓN FORMULARIO DE CONTACTO (ENVÍO A WHATSAPP SINCRONIZADO) ---
// ==========================================================================
function handleContactSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('contact-form');
    const alert = document.getElementById('success-alert');
    const submitBtn = form.querySelector('button[type="submit"]');

    // 1. Extraer los datos usando los IDs reales de tu HTML (name, email, subject, message)
    const nombre = document.getElementById('name')?.value || 'Usuario Anónimo';
    const correo = document.getElementById('email')?.value || 'No especificado';
    const asunto = document.getElementById('subject')?.value || 'Contacto desde Portafolio';
    const mensaje = document.getElementById('message')?.value || '';

    // 2. Tu número de teléfono con código de país (Ejemplo: 51 para Perú)
    // ⚠️ REEMPLAZA ESTE NÚMERO POR EL TUYO REAL
    const telefonoMiWsp = "51951833077";

    // 3. Formatear la plantilla limpia con Emojis y Markdown para WhatsApp
    const textoMensaje =
        `🚀 *NUEVO CONTACTO DESDE EL PORTAFOLIO* 🚀

👤 *Nombre:* ${nombre}
📧 *Correo:* ${correo}
📌 *Asunto:* ${asunto}

💬 *Mensaje:*
${mensaje}`;

    // 4. Codificar de forma segura la cadena de texto para la URL
    const mensajeCodificado = encodeURIComponent(textoMensaje);
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefonoMiWsp}&text=${mensajeCodificado}`;

    // 5. Feedback visual inmediato en la interfaz
    form.classList.add('opacity-50', 'pointer-events-none');
    if (submitBtn) {
        submitBtn.innerHTML = `Abriendo WhatsApp... <i class="fa-solid fa-spinner fa-spin text-xs ml-1"></i>`;
    }

    setTimeout(() => {
        // Abrir la API de WhatsApp en una pestaña externa
        window.open(urlWhatsApp, '_blank');

        // Restaurar botón y limpiar formulario
        if (submitBtn) {
            submitBtn.innerHTML = `Enviar Mensaje <i class="fa-solid fa-paper-plane text-xs ml-1"></i>`;
        }
        form.reset();
        form.classList.remove('opacity-50', 'pointer-events-none');

        // Desplegar alerta de éxito en el Portafolio
        if (alert) {
            alert.classList.remove('hidden');
            setTimeout(() => {
                alert.classList.add('hidden');
            }, 6000);
        }
    }, 800);
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
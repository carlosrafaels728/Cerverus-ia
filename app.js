// Configuración de la API (Asegúrate de usar tu clave y el modelo correcto)
const API_KEY = "TU_API_KEY_AQUI"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${API_KEY}`;

// Elementos del DOM
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');
const newChatBtn = document.getElementById('new-chat-btn');

// 1. Control del Menú Deslizante (Hamburguesa)
if (menuToggle && sidebar && sidebarOverlay) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('active');
    });

    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    });
}

// Botón de nueva conversación recarga o limpia
if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
        location.reload();
    });
}

// 2. Función para enviar mensajes al hacer clic en el botón o presionar enter
if (sendBtn && userInput) {
    sendBtn.addEventListener('click', enviarMensaje);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensaje();
        }
    });
}

async function enviarMensaje() {
    const texto = userInput.value.trim();
    if (!texto) return;

    // Eliminar pantalla de bienvenida si es el primer mensaje
    const welcomeSection = document.querySelector('.welcome-section');
    if (welcomeSection) {
        welcomeSection.remove();
    }

    // Agregar mensaje del usuario
    agregarMensajeAlChat(texto, 'user');
    userInput.value = '';
    userInput.style.height = 'auto';

    // Mostrar animación de los tres puntitos (pensando)
    const loadingId = mostrarCargando();

    try {
        const respuestaAI = await consultarGemini(texto);
        ocultarCargando(loadingId);
        agregarMensajeAlChat(respuestaAI, 'ai');
    } catch (error) {
        ocultarCargando(loadingId);
        agregarMensajeAlChat("Error de Gemini: No se pudo conectar con el servidor.", 'ai');
    }
}

function agregarMensajeAlChat(texto, tipo) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${tipo}`;
    messageDiv.textContent = texto;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function mostrarCargando() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai';
    loadingDiv.id = 'loading-indicator';
    loadingDiv.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return 'loading-indicator';
}

function ocultarCargando(id) {
    const element = document.getElementById(id);
    if (element) element.remove();
}

async function consultarGemini(prompt) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error("Respuesta inválida de la API");
    }
}

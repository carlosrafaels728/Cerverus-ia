document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
    const btnCloseSidebar = document.getElementById('btn-close-sidebar');
    
    const btnNewChat = document.getElementById('btn-new-chat');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const btnSend = document.getElementById('btn-send');

    // Menú de adjuntos (+ clip)
    const btnToggleClip = document.getElementById('btn-toggle-clip');
    const attachmentMenu = document.getElementById('attachment-menu');
    const btnAttachImage = document.getElementById('btn-attach-image');
    const btnAttachVideo = document.getElementById('btn-attach-video');
    const btnAttachFile = document.getElementById('btn-attach-file');

    // Modales
    const btnSettings = document.getElementById('btn-settings');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    const saveSettings = document.getElementById('save-settings');
    const apiKeyInput = document.getElementById('api-key-input');

    const btnProfileMenu = document.getElementById('btn-profile-menu');
    const profileModal = document.getElementById('profile-modal');
    const closeProfile = document.getElementById('close-profile');

    // Cargar API Key
    let API_KEY = localStorage.getItem('cerberus_gemini_key') || '';
    if (apiKeyInput && API_KEY) {
        apiKeyInput.value = API_KEY;
    }

    // Control de Sidebar (Menú lateral hamburguesa)
    if (btnToggleSidebar && sidebar) {
        btnToggleSidebar.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    if (btnCloseSidebar && sidebar) {
        btnCloseSidebar.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }

    // Modal de Configuración (API Key)
    if (btnSettings && settingsModal) {
        btnSettings.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
        });
    }

    if (closeSettings && settingsModal) {
        closeSettings.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
        });
    }

    if (saveSettings && apiKeyInput) {
        saveSettings.addEventListener('click', () => {
            const newKey = apiKeyInput.value.trim();
            if (newKey) {
                localStorage.setItem('cerberus_gemini_key', newKey);
                API_KEY = newKey;
                alert('¡Clave de API guardada correctamente en el dispositivo!');
                settingsModal.classList.add('hidden');
            } else {
                alert('Por favor, ingresa una clave válida.');
            }
        });
    }

    // Modal de Perfil de Usuario (Captura exacta)
    if (btnProfileMenu && profileModal) {
        btnProfileMenu.addEventListener('click', () => {
            profileModal.classList.remove('hidden');
        });
    }

    if (closeProfile && profileModal) {
        closeProfile.addEventListener('click', () => {
            profileModal.classList.add('hidden');
        });
    }

    // Menú desplegable de Clip
    if (btnToggleClip && attachmentMenu) {
        btnToggleClip.addEventListener('click', (e) => {
            e.stopPropagation();
            attachmentMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!attachmentMenu.contains(e.target) && e.target !== btnToggleClip) {
                attachmentMenu.classList.add('hidden');
            }
        });
    }

    if (btnAttachImage) btnAttachImage.addEventListener('click', () => { attachmentMenu.classList.add('hidden'); appendUserMessage('[Imagen adjuntada]'); });
    if (btnAttachVideo) btnAttachVideo.addEventListener('click', () => { attachmentMenu.classList.add('hidden'); appendUserMessage('[Video adjuntado]'); });
    if (btnAttachFile) btnAttachFile.addEventListener('click', () => { attachmentMenu.classList.add('hidden'); appendUserMessage('[Archivo adjuntado]'); });

    // Nueva conversación
    if (btnNewChat && chatMessages) {
        btnNewChat.addEventListener('click', () => {
            chatMessages.innerHTML = `
                <div class="message ai-message">
                    <p>Conversación reiniciada. ¿En qué te puedo ayudar hoy?</p>
                </div>
            `;
        });
    }

    // Enviar mensajes a la API de Gemini
    if (btnSend && userInput && chatMessages) {
        btnSend.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        if (!API_KEY) {
            appendAiMessage('⚠️ No hay una clave de API configurada. Toca el icono de engranaje (⚙️) abajo a la izquierda para ingresarla.');
            return;
        }

        appendUserMessage(text);
        userInput.value = '';

        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'message ai-message';
        loadingMsg.innerHTML = `<p>Cerberus IA está pensando...</p>`;
        chatMessages.appendChild(loadingMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: text }] }]
                })
            });

            const data = await response.json();
            chatMessages.removeChild(loadingMsg);

            if (data.candidates && data.candidates[0].content.parts[0].text) {
                const aiReply = data.candidates[0].content.parts[0].text;
                appendAiMessage(aiReply);
            } else if (data.error) {
                appendAiMessage(`Error de Gemini: ${data.error.message}`);
            } else {
                appendAiMessage('Lo siento, no pude procesar la respuesta.');
            }

        } catch (error) {
            chatMessages.removeChild(loadingMsg);
            appendAiMessage('Error de conexión con la red o la API de Google.');
        }
    }

    function appendUserMessage(text) {
        const userMsg = document.createElement('div');
        userMsg.className = 'message user-message';
        userMsg.textContent = text;
        chatMessages.appendChild(userMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function appendAiMessage(text) {
        const aiMsg = document.createElement('div');
        aiMsg.className = 'message ai-message';
        aiMsg.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
        chatMessages.appendChild(aiMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

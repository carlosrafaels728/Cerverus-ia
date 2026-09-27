document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos de la interfaz
    const btnNewChat = document.getElementById('btn-new-chat');
    const btnSettings = document.getElementById('btn-settings');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    
    const btnToggleClip = document.getElementById('btn-toggle-clip');
    const attachmentMenu = document.getElementById('attachment-menu');
    
    const btnAttachImage = document.getElementById('btn-attach-image');
    const btnAttachVideo = document.getElementById('btn-attach-video');
    const btnAttachFile = document.getElementById('btn-attach-file');
    
    const userInput = document.getElementById('user-input');
    const btnSend = document.getElementById('btn-send');
    const btnVoice = document.getElementById('btn-voice');
    const chatMessages = document.getElementById('chat-messages');

    // Configuración de la API de Google Gemini
    const API_KEY = 'AIzaSyCLJJcE4voLSUXgrZ6Dgjy920QzmIVFYj4'; 
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${API_KEY}`;


    // 1. Botón de Configuración
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

    // 2. Botón Nueva Conversación
    if (btnNewChat && chatMessages) {
        btnNewChat.addEventListener('click', () => {
            chatMessages.innerHTML = `
                <div class="message ai-message">
                    <p>Conversación reiniciada. ¿En qué te puedo ayudar hoy con <strong>Cerberus IA</strong>?</p>
                </div>
            `;
        });
    }

    // 3. Menú desplegable del Clip
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

    // 4. Acciones de adjuntos
    if (btnAttachImage) {
        btnAttachImage.addEventListener('click', () => {
            attachmentMenu.classList.add('hidden');
            appendUserMessage('[Imagen adjuntada]');
        });
    }

    if (btnAttachVideo) {
        btnAttachVideo.addEventListener('click', () => {
            attachmentMenu.classList.add('hidden');
            appendUserMessage('[Video adjuntado]');
        });
    }

    if (btnAttachFile) {
        btnAttachFile.addEventListener('click', () => {
            attachmentMenu.classList.add('hidden');
            appendUserMessage('[Archivo adjuntado]');
        });
    }

    // 5. Envío de mensajes y consumo de la API de Google Gemini
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

        appendUserMessage(text);
        userInput.value = '';

        // Indicador de "escribiendo..."
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'message ai-message';
        loadingMsg.innerHTML = `<p>Cerberus IA está pensando...</p>`;
        chatMessages.appendChild(loadingMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            // Petición real a la API de Google Gemini
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: text }]
                    }]
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
            if (API_KEY === 'AQUI_PEGA_TU_API_KEY_DE_GOOGLE') {
                appendAiMessage('Error: Debes colocar tu clave de API de Google en el código de app.js.');
            } else {
                appendAiMessage('Error de conexión con la red o la API de Google.');
            }
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

    // 6. Botón de Voz
    if (btnVoice) {
        btnVoice.addEventListener('click', () => {
            alert('Módulo de chat por voz en preparación...');
        });
    }
});

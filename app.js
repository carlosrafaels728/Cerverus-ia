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

    // 1. Botón de Configuración (Abrir/Cerrar Modal)
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

    // 2. Botón Nueva Conversación (Limpia el chat)
    if (btnNewChat && chatMessages) {
        btnNewChat.addEventListener('click', () => {
            chatMessages.innerHTML = `
                <div class="message ai-message">
                    <p>Conversación reiniciada. ¿En qué te puedo ayudar hoy con <strong>Cerberus IA</strong>?</p>
                </div>
            `;
        });
    }

    // 3. Menú desplegable del Clip (Adjuntar archivos)
    if (btnToggleClip && attachmentMenu) {
        btnToggleClip.addEventListener('click', (e) => {
            e.stopPropagation();
            attachmentMenu.classList.toggle('hidden');
        });

        // Ocultar menú si se hace clic fuera
        document.addEventListener('click', (e) => {
            if (!attachmentMenu.contains(e.target) && e.target !== btnToggleClip) {
                attachmentMenu.classList.add('hidden');
            }
        });
    }

    // 4. Acciones de los botones de adjuntos
    if (btnAttachImage) {
        btnAttachImage.addEventListener('click', () => {
            alert('Abriendo selector de cámara / galería para imagen...');
            attachmentMenu.classList.add('hidden');
            appendUserMessage('[Imagen adjuntada]');
        });
    }

    if (btnAttachVideo) {
        btnAttachVideo.addEventListener('click', () => {
            alert('Abriendo selector de video...');
            attachmentMenu.classList.add('hidden');
            appendUserMessage('[Video adjuntado]');
        });
    }

    if (btnAttachFile) {
        btnAttachFile.addEventListener('click', () => {
            alert('Abriendo explorador de archivos...');
            attachmentMenu.classList.add('hidden');
            appendUserMessage('[Archivo adjuntado]');
        });
    }

    // 5. Envío de mensajes de texto
    if (btnSend && userInput && chatMessages) {
        btnSend.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        // Agregar mensaje del usuario
        appendUserMessage(text);
        userInput.value = '';

        // Simular respuesta de la IA (preparado para API real)
        setTimeout(() => {
            const aiMsg = document.createElement('div');
            aiMsg.className = 'message ai-message';
            aiMsg.innerHTML = `<p>Mensaje procesado correctamente en Cerberus IA. Conecta tu API key en este script para recibir respuestas en vivo.</p>`;
            chatMessages.appendChild(aiMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 800);
    }

    function appendUserMessage(text) {
        const userMsg = document.createElement('div');
        userMsg.className = 'message user-message';
        userMsg.textContent = text;
        chatMessages.appendChild(userMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 6. Botón de Voz
    if (btnVoice) {
        btnVoice.addEventListener('click', () => {
            alert('Asistente de voz activado. Habla ahora...');
        });
    }
});

// ============================================================================
// CERBERUS IA — Aplicación de Chat con IA Generativa
// Creado por: carlosart
// Compilable para: Android nativo (Capacitor)
// ============================================================================

const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarClose = document.getElementById('sidebarClose');
const settingsPanel = document.getElementById('settingsPanel');
const settingsOpenBtn = document.getElementById('settingsOpenBtn');
const settingsCloseBtn = document.getElementById('settingsCloseBtn');
const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const tabBtns = [...document.querySelectorAll('.tab-btn')];

let currentTab = 'chat';
let typingActive = false;

// ============================================================================
// UTILIDADES DE ALMACENAMIENTO
// ============================================================================

function store(key, value) {
  localStorage.setItem(key, value);
}

function retrieve(key, defaultValue = '') {
  return localStorage.getItem(key) ?? defaultValue;
}

// ============================================================================
// GESTIÓN DE CONFIGURACIÓN
// ============================================================================

function loadSettings() {
  document.getElementById('apiUrl').value = retrieve('apiUrl');
  document.getElementById('apiKey').value = retrieve('apiKey');
  document.getElementById('apiModel').value = retrieve('apiModel', 'gpt-4o-mini');
  document.getElementById('systemPrompt').value = retrieve('systemPrompt', 'Eres Cerberus IA, un asistente inteligente, creativo y útil.');

  document.getElementById('imageApiUrl').value = retrieve('imageApiUrl');
  document.getElementById('imageApiKey').value = retrieve('imageApiKey');
  document.getElementById('imageModel').value = retrieve('imageModel', 'black-forest-labs/flux-1-schnell');

  document.getElementById('videoApiUrl').value = retrieve('videoApiUrl');
  document.getElementById('videoApiKey').value = retrieve('videoApiKey');
  document.getElementById('videoModel').value = retrieve('videoModel', 'kling-ai/kling-video-v1');
}

function saveSettings() {
  store('apiUrl', document.getElementById('apiUrl').value.trim());
  store('apiKey', document.getElementById('apiKey').value.trim());
  store('apiModel', document.getElementById('apiModel').value.trim());
  store('systemPrompt', document.getElementById('systemPrompt').value.trim());

  store('imageApiUrl', document.getElementById('imageApiUrl').value.trim());
  store('imageApiKey', document.getElementById('imageApiKey').value.trim());
  store('imageModel', document.getElementById('imageModel').value.trim());

  store('videoApiUrl', document.getElementById('videoApiUrl').value.trim());
  store('videoApiKey', document.getElementById('videoApiKey').value.trim());
  store('videoModel', document.getElementById('videoModel').value.trim());

  addMessage('✅ Configuración guardada correctamente.', 'system');
}

// ============================================================================
// GESTIÓN DE INTERFAZ
// ============================================================================

function openSettings() {
  settingsPanel.classList.add('show');
  loadSettings();
}

function closeSettings() {
  settingsPanel.classList.remove('show');
}

function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('active');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
}

// ============================================================================
// GESTIÓN DE MENSAJES
// ============================================================================

function addMessage(text, role = 'assistant') {
  const msg = document.createElement('div');
  msg.className = `message ${role}`;
  msg.textContent = text;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function renderHtmlMessage(html) {
  const msg = document.createElement('div');
  msg.className = 'message assistant';
  msg.innerHTML = html;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function showTyping() {
  if (typingActive) return;
  typingActive = true;

  const container = document.createElement('div');
  container.className = 'message assistant';
  container.id = 'typing-container';

  const typing = document.createElement('div');
  typing.className = 'typing-indicator';

  for (let i = 0; i < 3; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'typing-dot';
    typing.appendChild(dot);
  }

  container.appendChild(typing);
  chatArea.appendChild(container);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function hideTyping() {
  if (!typingActive) return;
  typingActive = false;

  const typing = document.getElementById('typing-container');
  if (typing) typing.remove();
}

function autoResizeTextarea() {
  userInput.style.height = 'auto';
  userInput.style.height = `${Math.min(userInput.scrollHeight, 120)}px`;
}

// ============================================================================
// LLAMADAS A APIS
// ============================================================================

async function callChatApi(prompt) {
  const url = retrieve('apiUrl');
  const key = retrieve('apiKey');
  const model = retrieve('apiModel', 'gpt-4o-mini');
  const systemPrompt = retrieve('systemPrompt', 'Eres Cerberus IA, un asistente inteligente, creativo y útil.');

  if (!url || !key || !model) {
    addMessage('⚠️ Configura la URL, la API key y el modelo del chat principal.', 'system');
    return null;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data, null, 2));
  }

  return data.choices?.[0]?.message?.content || data.content?.[0]?.text || '(sin respuesta)';
}

async function generateImage(prompt) {
  const url = retrieve('imageApiUrl');
  const key = retrieve('imageApiKey');
  const model = retrieve('imageModel', 'black-forest-labs/flux-1-schnell');

  if (!url || !key || !model) {
    addMessage('⚠️ Completa la URL, la API key y el modelo de imagen.', 'system');
    return null;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      'HTTP-Referer': 'https://cerberus-ia.app',
      'X-Title': 'Cerberus IA'
    },
    body: JSON.stringify({ model, prompt })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data, null, 2));
  }

  return data.data?.[0]?.url || data.url;
}

async function generateVideo(prompt) {
  const url = retrieve('videoApiUrl');
  const key = retrieve('videoApiKey');
  const model = retrieve('videoModel', 'kling-ai/kling-video-v1');

  if (!url || !key || !model) {
    addMessage('⚠️ Completa la URL, la API key y el modelo de video.', 'system');
    return null;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      'HTTP-Referer': 'https://cerberus-ia.app',
      'X-Title': 'Cerberus IA'
    },
    body: JSON.stringify({ model, prompt })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data, null, 2));
  }

  return data.data?.[0]?.url || data.url || data.status_url;
}

// ============================================================================
// ENVÍO DE MENSAJES
// ============================================================================

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  userInput.value = '';
  autoResizeTextarea();
  addMessage(text, 'user');
  showTyping();

  try {
    if (currentTab === 'images') {
      const imageUrl = await generateImage(text);
      hideTyping();

      if (!imageUrl) {
        addMessage('No se recibió ninguna imagen. Verifica el modelo y la API.', 'system');
        return;
      }

      renderHtmlMessage(`
        <div class="result-card">
          <strong>✅ Imagen generada</strong>
          <img src="${imageUrl}" alt="Imagen generada" />
        </div>
      `);
      return;
    }

    if (currentTab === 'video') {
      const videoUrl = await generateVideo(text);
      hideTyping();

      if (!videoUrl) {
        addMessage('No se recibió ningún video. Verifica el modelo y la API.', 'system');
        return;
      }

      renderHtmlMessage(`
        <div class="result-card">
          <strong>✅ Video solicitado</strong>
          <a href="${videoUrl}" target="_blank" rel="noopener noreferrer">Ver / Descargar</a>
        </div>
      `);
      return;
    }

    const reply = await callChatApi(text);
    hideTyping();

    if (reply) {
      addMessage(reply, 'assistant');
    } else {
      addMessage('(sin respuesta)', 'assistant');
    }
  } catch (error) {
    hideTyping();
    addMessage(`Error: ${error.message}`, 'error');
  }
}

// ============================================================================
// EVENTOS
// ============================================================================

userInput.addEventListener('input', autoResizeTextarea);

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendBtn.addEventListener('click', sendMessage);

menuBtn.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

settingsOpenBtn.addEventListener('click', openSettings);
settingsCloseBtn.addEventListener('click', closeSettings);
cancelSettingsBtn.addEventListener('click', closeSettings);

saveSettingsBtn.addEventListener('click', () => {
  saveSettings();
  closeSettings();
});

tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabBtns.forEach((item) => item.classList.remove('active'));
    btn.classList.add('active');
    currentTab = btn.dataset.tab;
  });
});

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

window.addEventListener('load', () => {
  loadSettings();
  addMessage('👋 Hola, soy Cerberus IA. Generado por carlosart.\n\n💬 Chat | 🖼️ Imágenes | 🎬 Video | 📝 Guiones', 'system');
});
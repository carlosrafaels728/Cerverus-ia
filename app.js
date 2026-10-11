function renderTyping() {
  if (typingActive) return;
  typingActive = true;
  const wrap = document.createElement("div");
  wrap.className = "typing-box";
  wrap.id = "typing-box";
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("span");
    dot.className = "typing-dot";
    wrap.appendChild(dot);
  }
  chatEl.appendChild(wrap);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function hideTyping() {
  if (!typingActive) return;
  typingActive = false;
  const existing = document.getElementById("typing-box");
  if (existing) existing.remove();
}

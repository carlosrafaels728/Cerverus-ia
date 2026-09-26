const $=id=>document.getElementById(id);
const messages=$('messages'), input=$('input');
function add(text,who='bot'){const d=document.createElement('div');d.className='msg '+who;d.textContent=text;messages.appendChild(d);d.scrollIntoView({behavior:'smooth'});}
add('Cerberus IA está listo. Esta versión es la base móvil; las conexiones reales a modelos de IA, generación de imágenes/vídeo y automatización se incorporarán por módulos.','bot');
$('send').onclick=()=>{const t=input.value.trim();if(!t)return;add(t,'user');input.value='';setTimeout(()=>add('Mensaje recibido. Conecta tu API de IA en el módulo correspondiente para obtener respuestas reales.'),350)};
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('send').click()}});
$('attach').onclick=()=>$('file').click();
$('file').onchange=e=>{if(e.target.files[0])add('Archivo seleccionado: '+e.target.files[0].name,'user')};
$('theme').onclick=()=>document.body.classList.toggle('light');
$('mic').onclick=()=>{
  const R=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!R){add('El reconocimiento de voz no está disponible en este navegador.');return}
  const r=new R();r.lang='es-DO';r.onresult=e=>input.value=e.results[0][0].transcript;r.start();
};

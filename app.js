(function(){
'use strict';
/* =========================================================
   Agenda Psicológica · prototipo de interfaz (datos ficticios)
   ========================================================= */
function _ahora(){var d=new Date(),z=function(n){return ('0'+n).slice(-2);};return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate())+' '+z(d.getHours())+':'+z(d.getMinutes());}
var AHORA=_ahora(),HOY=AHORA.slice(0,10);
setInterval(function(){var a=_ahora(),cambioDia=a.slice(0,10)!==HOY;AHORA=a;HOY=a.slice(0,10);if(cambioDia&&S.logged)render();},60000);
function nuevoId(){return Date.now()*1000+Math.floor(Math.random()*1000);}
var DIAS=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
var DIAS_C=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
var MESES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
var MESES_C=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
var HH=60;

/* ---------- Utilidades ---------- */
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function D(k){var p=k.split('-');return new Date(+p[0],+p[1]-1,+(p[2]||1));}
function K(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
function add(k,n){var d=D(k);d.setDate(d.getDate()+n);return K(d);}
function lunes(k){var d=D(k);return add(k,-((d.getDay()+6)%7));}
function mins(h){var p=h.split(':');return +p[0]*60+ +p[1];}
function hhmm(m){return ('0'+Math.floor(m/60)).slice(-2)+':'+('0'+m%60).slice(-2);}
function durMin(t){return parseInt(t.dur,10)||50;}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}
function largo(k){var d=D(k);return (k===HOY?'Hoy, ':'')+cap(DIAS[d.getDay()])+' '+d.getDate()+' de '+MESES[d.getMonth()];}
function corto(k){var d=D(k);return k===HOY?'Hoy':k===add(HOY,1)?'Mañana':k===add(HOY,-1)?'Ayer':DIAS_C[d.getDay()]+' '+d.getDate()+' '+MESES_C[d.getMonth()];}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function ini(n){return n.replace(/^(Lic\.|Dra?\.|Psic\.)\s*/i,'').split(' ').filter(Boolean).map(function(p){return p[0];}).join('').slice(0,2).toUpperCase();}
function color(n){var h=0;for(var i=0;i<n.length;i++)h=(h+n.charCodeAt(i))%3;return ['salvia','lavanda','arena'][h];}
function plata(v){return '$ '+Math.round(v).toLocaleString('es-AR');}
function num(v){return parseInt(String(v).replace(/\D/g,''),10)||0;}
function edad(nac){if(!nac)return null;var a=D(HOY),b=D(nac),e=a.getFullYear()-b.getFullYear();if(a.getMonth()<b.getMonth()||(a.getMonth()===b.getMonth()&&a.getDate()<b.getDate()))e--;return e;}
function ico(id,w,sw){return '<svg width="'+(w||20)+'" height="'+(w||20)+'" fill="none" stroke="currentColor" stroke-width="'+(sw||1.7)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#'+id+'"/></svg>';}
function toast(m,ms){var t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(function(){t.classList.remove('show');},ms||2600);}
function store(k,v){try{if(v===undefined){var x=localStorage.getItem(k);return x?JSON.parse(x):null;}localStorage.setItem(k,JSON.stringify(v));}catch(e){return null;}}

/* ---------- Paletas y logos ---------- */
var PALETAS={
  salvia:   {n:'Salvia y lavanda',p:'#557A5D',ph:'#476B4F',pd:'#2F5238',pl:'#E3EEE2',pl2:'#DFEADD',pl3:'#EEF3EA',pb:'#9DB8A0',a:'#8E79C9',al:'#ECE8F7',ad:'#4B3C78',at:'#7E68B8',bg:'#FAF8F3',side:'#F1F0E8'},
  encuentro:{n:'Encuentro',d:'Salvia, crema y arena',p:'#66775B',ph:'#56664C',pd:'#3E4C35',pl:'#E6EADF',pl2:'#DEE4D5',pl3:'#F0F2EB',pb:'#AAB79D',a:'#B59A6E',al:'#F3ECDD',ad:'#63502B',at:'#9A8156',bg:'#F8F5EE',side:'#EFEBE2'},
  ovillo:   {n:'Ovillo',d:'Terracota, rosa y salvia',p:'#A95C42',ph:'#924D36',pd:'#6E3522',pl:'#F5E2D8',pl2:'#F0D8CB',pl3:'#FAEFE9',pb:'#D8AE9A',a:'#7F9377',al:'#E4ECDF',ad:'#34472E',at:'#6E8466',bg:'#FCF6F0',side:'#F4ECE4'},
  divan:    {n:'Diván',d:'Línea, crema y rosado',p:'#6E5B4F',ph:'#5C4B41',pd:'#4A3B32',pl:'#EFE6DF',pl2:'#E9DDD3',pl3:'#F6F0EB',pb:'#C4AE9E',a:'#C98C7A',al:'#F6E3DC',ad:'#7A3E2C',at:'#B07462',bg:'#F7F1EC',side:'#EFE7E0'},
  lavanda:  {n:'Lavanda',d:'Lavanda y salvia',p:'#7A68B3',ph:'#67569C',pd:'#43367A',pl:'#ECE8F7',pl2:'#E4DEF4',pl3:'#F4F1FB',pb:'#B7AADB',a:'#5E8566',al:'#E3EEE2',ad:'#2F5238',at:'#5E8566',bg:'#FAF9F6',side:'#F1EFF4'},
  oceano:   {n:'Océano',d:'Azul sereno y coral',p:'#3E6F8C',ph:'#335D76',pd:'#1F4459',pl:'#E0ECF3',pl2:'#D6E6EF',pl3:'#EEF5F9',pb:'#93B6CB',a:'#D08568',al:'#FAE7DF',ad:'#7A3A24',at:'#C0705A',bg:'#F8F9F8',side:'#EEF2F3'},
  rosa:     {n:'Rosa empolvado',d:'Rosa y verde',p:'#A35B70',ph:'#8C4B5E',pd:'#6A3243',pl:'#F4E3E8',pl2:'#EFD9E0',pl3:'#FAF0F3',pb:'#D3A6B4',a:'#6F8B74',al:'#E3EEE4',ad:'#2F4D35',at:'#5E7C64',bg:'#FCF8F8',side:'#F4EEEF'},
  grafito:  {n:'Grafito',d:'Sobrio, gris y dorado',p:'#45505E',ph:'#39424E',pd:'#1F2730',pl:'#E5E8EC',pl2:'#DCE0E5',pl3:'#F1F3F5',pb:'#A9B2BD',a:'#B8924E',al:'#F3EAD8',ad:'#66501F',at:'#A5803C',bg:'#F9F8F6',side:'#EFEFEC'}
};
PALETAS.salvia.d='Verde salvia, blanco cálido y lavanda';
var LOGOS=[
  ['mono-serif','Letra clásica','ini'],['mono-script','Letra manuscrita','ini'],['mono-linea','Letra en círculo','ini'],
  ['mono-arco','Letra en arco','ini'],['mono-burbuja','Letra en diálogo','ini'],['mono-rama','Letra con rama','ini'],
  ['mono-firma','Letra firmada','ini'],['mono-sello','Letra en sello','ini'],
  ['divan','Diván','ilus'],['ovillo','Del enredo al círculo','ilus'],['sillones','Sillones','ilus'],['globos','Conversación','ilus'],['rama','Rama de olivo','ilus'],['arco','Arco con brote','ilus'],
  ['hoja','Hoja','otros'],['brote','Brote','otros'],['loto','Loto','otros'],['mariposa','Mariposa','otros'],['mente','Mente','otros'],['luna','Luna','otros'],
  ['dialogo','Diálogo','otros'],['corazon','Corazón','otros'],['infinito','Infinito','otros'],['sol','Sol','otros'],['psi','Psi (Ψ)','otros']
];
var GRUPOS_LOGO=[['ini','Con tu inicial'],['ilus','Inspirados en tus ilustraciones'],['otros','Otros símbolos']];
function lsvg(p){return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';}
var SVG_LOGO={
  sillones:lsvg('<path d="M12 3.6c-1.9 0-3.4 1.1-3.4 2.5 0 .8.5 1.5 1.3 2l-.4 1.5 1.7-1c.3 0 .5.1.8.1 1.9 0 3.4-1.1 3.4-2.6S13.9 3.6 12 3.6Z"/><path d="M2.5 18v-4.8a3 3 0 0 1 6 0V18Z"/><path d="M2.5 15.5h6M3.5 18 3 20.5M7.5 18l.5 2.5"/><path d="M21.5 18v-4.8a3 3 0 0 0-6 0V18Z"/><path d="M21.5 15.5h-6M20.5 18l.5 2.5M16.5 18l-.5 2.5"/>'),
  globos:lsvg('<path d="M9 4C5.7 4 3 6 3 8.5c0 1.4.8 2.6 2.1 3.4L4.5 15l3-1.9c.5.1 1 .1 1.5.1 3.3 0 6-2 6-4.5S12.3 4 9 4Z"/><path d="M15.4 9.3c.4-.1.7-.1 1.1-.1 2.5 0 4.5 1.6 4.5 3.6 0 1.1-.6 2.1-1.6 2.7l.5 2.6-2.4-1.5c-.3 0-.7.1-1 .1-1.9 0-3.6-1-4.2-2.3"/>'),
  rama:lsvg('<path d="M4.5 19.5C9 15.5 13 10.5 19.5 4.5"/><path d="M8 16c-1.8-.2-3-1.2-3.4-2.8 1.8-.1 3 .8 3.4 2.8Z"/><path d="M9.6 14.3c1.7-.5 3.2-.1 4.2 1.1-1.6.7-3.1.3-4.2-1.1Z"/><path d="M11.2 12.4c-.4-1.8.2-3.2 1.6-4.1.6 1.6 0 3.1-1.6 4.1Z"/><path d="M12.8 10.8c1.7-.6 3.2-.3 4.3.9-1.6.8-3.1.5-4.3-.9Z"/><path d="M15.2 8.2c-.2-1.8.6-3.1 2.1-3.8.4 1.7-.4 3-2.1 3.8Z"/>'),
  arco:lsvg('<path d="M6 20.5V11a6 6 0 0 1 12 0v9.5"/><path d="M3.5 20.5h17M12 20.5v-5"/><path d="M12 17.2c-1.6 0-2.6-1-2.8-2.4 1.6 0 2.6.9 2.8 2.4Z"/><path d="M12 16.1c1.4-.1 2.4-1 2.6-2.4-1.5 0-2.4.9-2.6 2.4Z"/>'),
  loto:lsvg('<path d="M12 19.5c-2.6-1.6-4.2-4.3-4.2-7.4 2.2.5 3.5 1.9 4.2 3.6.7-1.7 2-3.1 4.2-3.6 0 3.1-1.6 5.8-4.2 7.4Z"/><path d="M12 15.6c-1.1-2.6-1.1-6 0-9.6 1.1 3.6 1.1 7 0 9.6Z"/><path d="M7.8 12.4C5.6 12 4 12.6 3 14c1.3 3.3 4.8 5.5 9 5.5s7.7-2.2 9-5.5c-1-1.4-2.6-2-4.8-1.6"/>'),
  mariposa:lsvg('<path d="M12 8v11"/><path d="M12 10.5C10.4 7 7.6 5.6 5 6c-.5 3 1.4 6 7 6.5"/><path d="M12 10.5c1.6-3.5 4.4-4.9 7-4.5.5 3-1.4 6-7 6.5"/><path d="M12 12.5c-1 2.4-3 3.9-5 3.9 0-2 2-3.5 5-3.9Z"/><path d="M12 12.5c1 2.4 3 3.9 5 3.9 0-2-2-3.5-5-3.9Z"/><path d="M12 8l-1.4-2.6M12 8l1.4-2.6"/>'),
  mente:lsvg('<path d="M14.5 21v-3.2c2.6-1 4.5-3.6 4.5-6.6A7.2 7.2 0 0 0 11.8 4C8 4 5 7 5 10.6l-1.6 3 1.6.6V16a2 2 0 0 0 2 2h2v3"/><path d="M11 13c0-2.2 1.5-3.8 3.7-3.9 0 2.2-1.5 3.8-3.7 3.9Z"/><path d="M11 13v2"/>'),
  luna:lsvg('<path d="M19.5 14.5A7.8 7.8 0 1 1 9.5 4.5a6.2 6.2 0 0 0 10 10Z"/><path d="M17 4v3M15.5 5.5h3"/>'),
  divan:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9.2" cy="6.2" r="3"/><path d="M7.6 8.7 6.6 10.6l2.3-1.2"/><circle cx="14.8" cy="7" r="2.6"/><path d="m16.1 9.2.8 1.6-1.9-.8"/><path d="M3.5 19v-4.2a1.4 1.4 0 0 1 2.8 0V17"/><path d="M20.5 19v-4.2a1.4 1.4 0 0 0-2.8 0V17"/><path d="M6.3 16.6v-1.9A1.6 1.6 0 0 1 7.9 13h8.2a1.6 1.6 0 0 1 1.6 1.7v1.9"/><path d="M3.5 19h17M5 19v1.8M19 19v1.8M6.3 17h11.4"/></svg>',
  ovillo:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.2 9.3c2-1.6 3.6.5 2.2 2.1-1.3 1.4-3.6.4-2.7-1.4.9-1.8 4-.9 3.2 1.6-.6 1.9-3.4 2.4-3.9.9-.5-1.4 1.4-2.6 2.9-1.4 1.3 1 1.7 2.4 3.9 2.4h2.4"/><circle cx="17.6" cy="12" r="3.6"/></svg>'
};
function mtxt(L,x,y,fs,fam,ital){var f=L.length>1?fs*.72:fs;return '<text x="'+x+'" y="'+y+'" text-anchor="middle" font-family="'+fam+'" font-size="'+f+'"'+(ital?' font-style="italic"':'')+' fill="currentColor" stroke="none">'+L+'</text>';}
var SERIF='Fraunces, Georgia, serif',SCRIPT="'Great Vibes', cursive";
function msvg(inner){return '<svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">'+inner+'</svg>';}
var MONO_SVG={
  'mono-arco':function(L){return msvg('<path d="M12 32V19.5a8 8 0 0 1 16 0V32"/><path d="M9 32h22"/>'+mtxt(L,20,29.5,17,SERIF,true));},
  'mono-burbuja':function(L){return msvg('<path d="M20 8.5c-6.4 0-11.5 4.1-11.5 9.3 0 2.9 1.6 5.4 4.2 7.1L11.8 31l5.6-3.6c.9.2 1.7.2 2.6.2 6.4 0 11.5-4.1 11.5-9.3S26.4 8.5 20 8.5Z"/>'+mtxt(L,20,23.8,15,SERIF,true));},
  'mono-rama':function(L){return msvg(mtxt(L,17.5,26,19,SERIF,true)+'<path d="M22.5 31.5c3.6-1.2 6.6-4 8.2-8.2"/><path d="M26.2 29.6c-.2-1.6.5-2.8 1.9-3.4.3 1.5-.4 2.7-1.9 3.4Z"/><path d="M28.6 27.2c1.5-.5 2.8-.1 3.6.9-1.4.6-2.7.3-3.6-.9Z"/><path d="M29.4 25.4c-.4-1.5.1-2.8 1.3-3.6.5 1.4 0 2.7-1.3 3.6Z"/>');},
  'mono-firma':function(L){return msvg(mtxt(L,20,26,24,SCRIPT,false)+'<path d="M10 30.5c5.5-1.6 13.5-1.9 20.5-.6"/>');},
  'mono-sello':function(L){return msvg('<circle cx="20" cy="20" r="14.5"/><circle cx="20" cy="20" r="11.8" stroke-dasharray="1.2 2.2"/>'+mtxt(L,20,25.6,16,SERIF,false));}
};
function letra(){var c=CFG.letra&&CFG.letra.trim();if(c)return c.slice(0,2);var n=CFG.prof.replace(/^(Lic\.|Dra?\.|Psic\.)\s*/i,'').trim();return (n[0]||'A').toUpperCase();}
function logoHtml(tipo,cls){
  tipo=tipo||CFG.logo;cls=cls||'';
  if(tipo==='imagen'&&CFG.logoImg)return '<span class="logo '+cls+'" style="background:#fff"><img src="'+CFG.logoImg+'" alt=""></span>';
  if(MONO_SVG[tipo])return '<span class="logo msvg '+tipo+' '+cls+'" aria-hidden="true">'+MONO_SVG[tipo](esc(letra()))+'</span>';
  if(tipo.indexOf('mono')===0)return '<span class="logo '+tipo+' '+cls+'" aria-hidden="true">'+esc(letra())+'</span>';
  if(tipo==='psi')return '<span class="logo psi '+cls+'" aria-hidden="true">Ψ</span>';
  if(SVG_LOGO[tipo])return '<span class="logo '+cls+'">'+SVG_LOGO[tipo]+'</span>';
  return '<span class="logo '+cls+'"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#l-'+tipo+'"/></svg></span>';
}
function marcaHtml(){var m=CFG.marca.trim()||'Agenda Psicológica',p=m.split(' ');return esc(p[0])+(p.length>1?' <i>'+esc(p.slice(1).join(' '))+'</i>':'');}
function aplicarTema(){
  var t=PALETAS[CFG.tema]||PALETAS.salvia,r=document.documentElement.style;
  ['p','ph','pd','pl','pl2','pl3','pb','a','al','ad','at','bg','side'].forEach(function(k){r.setProperty('--'+k,t[k]);});
  $$('[data-brand]').forEach(function(b){b.innerHTML=logoHtml(null,'')+'<span>'+marcaHtml()+'</span>';});
  $$('[data-nombre-prof]').forEach(function(b){b.textContent=CFG.prof||'Mi consultorio';});
  $$('[data-ini-prof]').forEach(function(b){b.textContent=ini(CFG.prof||'Mi Consultorio');});
}

/* ---------- Configuración del consultorio ---------- */
var CFG={
  prof:'',titulo:'',matricula:'',tel:'',email:'',
  dir:'',enlace:'',
  dias:[1,2,3,4,5,6],desde:8,hasta:21,descanso:'10 min',dur:'50 min',honor:25000,presencial:true,virtual:true,
  politica:'',
  tema:'salvia',logo:'hoja',marca:'Agenda Psicológica',letra:'',logoImg:null,ilus:'sillones',
  lugares:[],
  copiaDrive:{activo:false,frec:'mensual',hojas:{pac:true,tur:true,pag:true,res:true},tema:'',ultima:''},emailCuenta:'',
  autoRec:true,antic:24,avisoSemana:true,avisoDia:true,horaRec:'10:00',canalWa:false,canalMail:false
};
(function(){var g=store('ap_apariencia');if(g)['tema','logo','marca','letra','logoImg','ilus'].forEach(function(k){if(g[k]!=null)CFG[k]=g[k];});})();
function guardarApariencia(){store('ap_apariencia',{tema:CFG.tema,logo:CFG.logo,marca:CFG.marca,letra:CFG.letra,logoImg:CFG.logoImg,ilus:CFG.ilus});}
var ILUS=[['sillones','Sillones','ilus-sillones.jpg'],['ovillo','Del enredo al círculo','ilus-hilo.jpg'],['divan','Diván','ilus-divan.jpg'],['ninguna','Ninguna',null]];

/* ---------- Pacientes ---------- */
var pid=1, PAC=[];
function P(o){o.id=o.id||nuevoId();o.notas=o.notas||[];PAC.push(o);return o;}

function pacPorNombre(n){return PAC.filter(function(p){return p.nombre.toLowerCase()===n.toLowerCase();})[0];}

/* ---------- Turnos ---------- */
var uid=1,TURNOS=[];
var MEDIOS=['Transferencia','Efectivo','Mercado Pago'];
function T(fecha,hora,nombre,mod,estado,pagado,extra){
  var p=pacPorNombre(nombre);
  var t={id:nuevoId(),fecha:fecha,hora:hora,nombre:nombre,mod:mod,estado:estado,pagado:pagado,dur:'50 min',monto:p?p.honor:CFG.honor,nota:'',medio:null,fpago:null};
  for(var x in extra||{})t[x]=extra[x];
  if(t.pagado===true&&!t.medio){t.medio=MEDIOS[t.id%3];t.fpago=t.fecha;}
  TURNOS.push(t);return t;
}


/* ---------- Recordatorios ---------- */
var PLANT={
  turno:'¡Hola {paciente}! Te confirmo tu sesión del {fecha} a las {hora}.\nSi no podés venir, avisame.\n{profesional}\n\nAgendala en tu calendario:\n{calendario}',
  semana:'¡Hola {paciente}! Te recuerdo que tenés sesión el {fecha} a las {hora}.\nSi necesitás cambiar el día, avisame con tiempo.\n{profesional}\n\nAgendala en tu calendario:\n{calendario}',
  sesion:'¡Hola {paciente}! Te recuerdo tu sesión de mañana, {fecha} a las {hora}.\nSi necesitás reprogramar, avisame.\n{profesional}',
  confirmar:'¡Hola {paciente}! ¿Me confirmás tu asistencia a la sesión del {fecha} a las {hora}? Respondé SÍ o NO.\nGracias,\n{profesional}\n\nAgendala en tu calendario:\n{calendario}',
  enlace:'¡Hola {paciente}! Te paso el enlace para la sesión virtual del {fecha} a las {hora}:\n{enlace}\n{profesional}'
};
var PLANT_VIEJAS=[{"turno": "Hola {paciente}, te confirmo tu sesión del {fecha} a las {hora}. Agendala en tu calendario: {calendario} — Si no podés venir, avisame. {profesional}", "semana": "Hola {paciente}, te recuerdo que tenés sesión el {fecha} a las {hora}. Si necesitás cambiar el día, avisame con tiempo. Agendala en tu calendario: {calendario} — {profesional}", "sesion": "Hola {paciente}, te recuerdo tu sesión de mañana, {fecha} a las {hora}. Si necesitás reprogramar, avisame. {profesional}", "confirmar": "Hola {paciente}, ¿me confirmás tu asistencia a la sesión del {fecha} a las {hora}? Respondé SÍ o NO. Gracias, {profesional}", "enlace": "Hola {paciente}, te paso el enlace para la sesión virtual del {fecha} a las {hora}: {enlace} — {profesional}"},{"turno": "¡Hola {paciente}! Te confirmo tu sesión del {fecha} a las {hora}.\nSi no podés venir, avisame.\n{profesional}\n\n📅 Agendala en tu calendario:\n{calendario}", "semana": "¡Hola {paciente}! Te recuerdo que tenés sesión el {fecha} a las {hora}.\nSi necesitás cambiar el día, avisame con tiempo.\n{profesional}\n\n📅 Agendala en tu calendario:\n{calendario}", "sesion": "¡Hola {paciente}! Te recuerdo tu sesión de mañana, {fecha} a las {hora}.\nSi necesitás reprogramar, avisame.\n{profesional}", "confirmar": "¡Hola {paciente}! ¿Me confirmás tu asistencia a la sesión del {fecha} a las {hora}? Respondé SÍ o NO.\nGracias,\n{profesional}\n\n📅 Agendala en tu calendario:\n{calendario}", "enlace": "¡Hola {paciente}! Te paso el enlace para la sesión virtual del {fecha} a las {hora}:\n{enlace}\n{profesional}"}];
var REC_TIPO={turno:'Confirmación del turno',semana:'Aviso una semana antes',sesion:'Recordatorio de sesión',confirmar:'Confirmar asistencia',enlace:'Enlace de videollamada'};
var RECX={}; // cambios manuales: id → 'enviado' | 'pausado'
function envioDe(t,dias){return add(t.fecha,-dias)+' '+CFG.horaRec;}
function recordatorios(){
  var out=[];
  TURNOS.forEach(function(t){
    if(t.estado==='cancelada'||t.fecha<add(HOY,-2)||t.fecha>add(HOY,15))return;
    var avisos=[];
    if(CFG.avisoSemana)avisos.push({id:t.id+'-s',tipo:'semana',envio:envioDe(t,7),cuando:'Una semana antes'});
    if(CFG.avisoDia)avisos.push({id:t.id+'-d',tipo:t.mod==='v'?'enlace':(t.estado==='pendiente'?'confirmar':'sesion'),envio:envioDe(t,1),cuando:'El día anterior'});
    avisos.forEach(function(a){
      if(a.envio.slice(0,10)<add(HOY,-2)||a.envio.slice(0,10)>add(HOY,7))return;
      a.t=t;a.estado=RECX[a.id]||(a.envio<=AHORA?'enviado':(CFG.autoRec?'programado':'pausado'));out.push(a);
    });
  });
  return out.sort(function(a,b){return a.envio<b.envio?-1:1;});
}
function ejemploTurno(){return TURNOS.filter(function(t){return t.fecha>HOY;})[0]||{nombre:'Ana Pérez',fecha:add(HOY,7),hora:'10:00',mod:'p'};}
function b64url(o){var b=btoa(unescape(encodeURIComponent(JSON.stringify(o))));return b.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function baseApp(){return location.origin+location.pathname.replace(/[^\/]*$/,'');}
function codAzar(n){var a=new Uint8Array(n),c='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789',o='';try{crypto.getRandomValues(a);}catch(e){for(var i=0;i<n;i++)a[i]=Math.random()*256|0;}for(var j=0;j<n;j++)o+=c[a[j]%c.length];return o;}
function linkCalendario(t){
  var lugar=t.mod==='v'?(CFG.enlace||''):(CFG.dir||'');
  var o={f:t.fecha,h:t.hora,m:t.mod,k:CFG.tema||'salvia',i:letra()};if(CFG.tel)o.w=telWa(CFG.tel);if(durMin(t)!==50)o.d=durMin(t);if(lugar)o.l=lugar;if(CFG.prof)o.p=CFG.prof;if(CFG.marca&&CFG.marca!=='Agenda Psicológica')o.c=CFG.marca;var c=[o.f.replace(/-/g,'').slice(2),o.h.replace(':',''),o.m||'',o.k==='salvia'?'':o.k,o.i||'',o.d||'',o.l||'',o.p||'',o.c||'',o.w||''].map(function(x){return String(x).replace(/\|/g,'/');}).join('|').replace(/\|+$/,'');var b=btoa(unescape(encodeURIComponent(c))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');return baseApp()+'turno.html#2'+b;
}
var VARS={paciente:'Nombre del paciente',fecha:'Fecha',hora:'Hora',profesional:'Tu nombre',enlace:'Enlace de videollamada',calendario:'Link al calendario'};
function chipVar(v){return '<span class="var" contenteditable="false" data-v="'+v+'">'+esc(VARS[v]||v)+'</span>';}
function plantHtml(t){return esc(t||'').replace(/\{(\w+)\}/g,function(m,v){return VARS[v]?chipVar(v):m;}).replace(/\n/g,'<br>');}
function plantTexto(el){
  var out='';
  Array.prototype.forEach.call(el.childNodes,function(n){
    if(n.nodeType===3)out+=n.nodeValue.replace(/ /g,' ');
    else if(n.nodeType===1){
      if(n.getAttribute('data-v'))out+='{'+n.getAttribute('data-v')+'}';
      else if(n.tagName==='BR')out+='\n';
      else if(n.tagName==='DIV'||n.tagName==='P'){if(out&&out.slice(-1)!=='\n')out+='\n';out+=plantTexto(n);}
      else out+=plantTexto(n);
    }
  });
  return out;
}
var _plantR=null;
function plantRango(){var sel=window.getSelection();if(sel&&sel.rangeCount){var r=sel.getRangeAt(0),ed=r.startContainer.nodeType===1?r.startContainer.closest('[data-plant]'):r.startContainer.parentNode.closest('[data-plant]');if(ed)_plantR={k:ed.getAttribute('data-plant'),r:r.cloneRange()};}}
function plantGuardar(ed){var k=ed.getAttribute('data-plant');PLANT[k]=plantTexto(ed).replace(/\n$/,'');var pv=$('[data-prev="'+k+'"]');if(pv)pv.textContent=textoRec(k,ejemploTurno());guardarPronto();}
function plantInsertar(k,v){
  var ed=$('[data-plant="'+k+'"]');if(!ed)return;
  ed.focus();
  var sel=window.getSelection();
  if(_plantR&&_plantR.k===k&&ed.contains(_plantR.r.startContainer)){sel.removeAllRanges();sel.addRange(_plantR.r);}
  else{var r=document.createRange();r.selectNodeContents(ed);r.collapse(false);sel.removeAllRanges();sel.addRange(r);}
  document.execCommand('insertHTML',false,chipVar(v)+'&nbsp;');
  plantRango();plantGuardar(ed);
}
function textoRec(tipo,t){
  var d=D(t.fecha),f=DIAS[d.getDay()]+' '+d.getDate()+' de '+MESES[d.getMonth()];
  var txt=PLANT[tipo]||PLANT.turno||'';
  if(txt.indexOf('{calendario}')>=0)txt=txt.replace(/\{calendario\}/g,linkCalendario(t));
  txt=txt.replace(/\{paciente\}/g,t.nombre.split(' ')[0]).replace(/\{fecha\}/g,f).replace(/\{hora\}/g,t.hora).replace(/\{profesional\}/g,CFG.prof||'').replace(/\{enlace\}/g,CFG.enlace||'');
  return txt.split('\n').map(function(l){return l.replace(/[ \t]+$/,'');}).join('\n').replace(/\n{3,}/g,'\n\n').trim();
}
function envioTxt(e){var p=e.split(' ');return corto(p[0])+', '+p[1];}

/* ---------- Consultas comunes ---------- */
function delDia(k){return TURNOS.filter(function(t){return t.fecha===k;}).sort(function(a,b){return a.hora<b.hora?-1:1;});}
function byId(id){return TURNOS.filter(function(t){return t.id===+id;})[0];}
function pac(id){return PAC.filter(function(p){return p.id===+id;})[0];}
function deuda(t){return t.pagado===false&&t.estado!=='cancelada'&&t.fecha<=HOY;}
function porCobrar(){return TURNOS.filter(deuda).sort(function(a,b){return (a.fecha+a.hora)<(b.fecha+b.hora)?-1:1;});}
function cobradoMes(ym){return TURNOS.filter(function(t){return t.pagado===true&&t.fpago&&t.fpago.slice(0,7)===ym;}).reduce(function(a,t){return a+t.monto;},0);}
function pagoTxt(t){return t.pagado===true?'Pagado':t.pagado===false?(t.fecha<=HOY?'A cobrar':'—'):'Sin cargo';}
function turnosDe(p){return TURNOS.filter(function(t){return t.nombre===p.nombre;}).sort(function(a,b){return (a.fecha+a.hora)<(b.fecha+b.hora)?-1:1;});}
function futuro(t){return (t.fecha+' '+t.hora)>AHORA;}
function proximo(p){return turnosDe(p).filter(function(t){return futuro(t)&&t.estado!=='cancelada';})[0];}
function saldo(p){return turnosDe(p).filter(deuda).reduce(function(a,t){return a+t.monto;},0);}
function diasAtencion(){return CFG.dias.slice().sort(function(a,b){return ((a+6)%7)-((b+6)%7);});}

/* ---------- Google: ingreso y planilla en el Drive de cada psicóloga ---------- */
var GCLIENT=window.AP_GOOGLE_CLIENT_ID||'';
var SCOPE_DRIVE='https://www.googleapis.com/auth/drive.file';
var SCOPES=SCOPE_DRIVE+' openid email profile';
var SHEETS='https://sheets.googleapis.com/v4/spreadsheets/';
var DRIVE='https://www.googleapis.com/drive/v3/files';
var UPLOAD='https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name';
var TOK=store('ap_tok')||null;      // {t, exp}
var USER=store('ap_user')||null;    // {email, name}
var SSID=null, META=null, TABHASH={}, DATOS_FILAS=0;
var VERSION=0,ULTIMO='',PENDIENTE=false,ENVIANDO=false,_tGuardar=null;
var TOKEN=USER?'g':'';              // compatibilidad: hay sesión si hay usuaria
function claveU(k){return 'ap_'+k+'_'+(USER?USER.email:'');}

var _gsi=null;
function cargarGSI(){if(window.google&&google.accounts&&google.accounts.oauth2)return Promise.resolve();if(_gsi)return _gsi;_gsi=new Promise(function(ok,mal){var sc=document.createElement('script');sc.src='https://accounts.google.com/gsi/client';sc.async=true;sc.onload=ok;sc.onerror=function(){_gsi=null;mal();};document.head.appendChild(sc);});return _gsi;}
if(GCLIENT)cargarGSI().catch(function(){});
function tokenOk(margen){return !!(TOK&&TOK.exp>Date.now()+(margen||60000));}
var _tc=null,_tcCb=null;
function pedirToken(prompt){
  // Tiene que llamarse dentro de un toque de la usuaria (abre una ventanita de Google).
  if(!(window.google&&google.accounts&&google.accounts.oauth2))return Promise.reject({error:'gsi'});
  if(!_tc)_tc=google.accounts.oauth2.initTokenClient({client_id:GCLIENT,scope:SCOPES,
    callback:function(r){var cb=_tcCb;_tcCb=null;if(cb)cb(r);},
    error_callback:function(err){
      var tipo=(err&&err.type)||'cancelado';
      // A veces Google avisa "ventana cerrada" antes de mandar el permiso: esperamos un poco antes de dar por cancelado.
      if(tipo==='popup_closed'){var cbP=_tcCb;setTimeout(function(){if(_tcCb===cbP&&cbP){_tcCb=null;cbP({error:tipo});}},4000);return;}
      var cb=_tcCb;_tcCb=null;if(cb)cb({error:tipo});}});
  return new Promise(function(ok,mal){
    _tcCb=function(r){
      if(!r||r.error){mal(r||{error:'cancelado'});return;}
      if(!google.accounts.oauth2.hasGrantedAllScopes(r,SCOPE_DRIVE)){mal({error:'permiso'});return;}
      TOK={t:r.access_token,exp:Date.now()+(+r.expires_in||3600)*1000};store('ap_tok',TOK);ok();
    };
    var o={prompt:prompt};if(USER&&USER.email)o.login_hint=USER.email;
    _tc.requestAccessToken(o);
  });
}
function gfetch(url,opt){
  if(!tokenOk())return Promise.reject({auth:true});
  opt=opt||{};opt.headers=opt.headers||{};opt.headers.Authorization='Bearer '+TOK.t;
  if(opt.json!==undefined){opt.body=JSON.stringify(opt.json);opt.headers['Content-Type']='application/json';delete opt.json;}
  return fetch(url,opt).then(function(r){
    if(r.status===401){TOK=null;store('ap_tok',null);return Promise.reject({auth:true});}
    if(!r.ok)return r.text().then(function(t){return Promise.reject({status:r.status,body:t});});
    return r.status===204?{}:r.json();
  });
}

/* --- Ingreso --- */
function ingresarGoogle(btn){
  var e=$('#gErr');if(e)e.textContent='';
  if(!GCLIENT){if(e)e.textContent='Falta configurar el ID de Google en config.js.';return;}
  var primera=!USER;
  pedirToken('').then(function(){
    if(e)e.textContent='Abriendo tu agenda…';
    return gfetch('https://www.googleapis.com/oauth2/v3/userinfo');
  }).then(function(u){
    var email=String(u.email||'').toLowerCase();
    if(USER&&USER.email!==email){/* cambió de cuenta en este equipo */}
    USER={email:email,name:u.name||''};store('ap_user',USER);TOKEN='g';S.logged=true;
    var c=store(claveU('cache'));if(c&&c.datos)aplicarDatos(c.datos,c.version,true);else{ULTIMO='';}
    var p=store(claveU('pend'));if(p&&p.datos){aplicarDatos(p.datos,p.base,true);PENDIENTE=true;}
    if(!CFG.emailCuenta)CFG.emailCuenta=email;
    var dst=S.destino&&S.destino!=='ingresar'?S.destino:'inicio';S.destino=null;
    location.hash=dst;susCargar();render();susUI();verificarSus(true);
    return iniciarPlanilla();
  }).catch(function(err){
    var m=err&&err.error==='permiso'?'Para usar la agenda tenés que permitir que guarde su planilla en tu Drive. Probá de nuevo y marcá esa opción.':
      err&&err.error==='popup_failed_to_open'?'El navegador bloqueó la ventana de Google. Permití las ventanas emergentes para esta página y probá de nuevo.':
      err&&err.error==='access_denied'?'No se dieron los permisos. Probá de nuevo y tocá Continuar en las pantallas de Google.':
      err&&(err.error==='popup_closed'||err.error==='cancelado')?'Se cerró la ventana de Google antes de terminar. Probá de nuevo.':
      err&&err.error==='gsi'?'No se pudo cargar Google. Revisá la conexión.':'No se pudo ingresar ('+esc(String((err&&(err.error||err.status))||'error'))+'). Probá de nuevo.';
    if(e)e.textContent=m;
  });
}
function reconectar(){
  pedirToken('').then(function(){mostrarReconectar(false);if(!SSID)iniciarPlanilla();else if(PENDIENTE)enviar();else cargar();})
  .catch(function(){toast('No se pudo conectar con Google. Probá de nuevo.');});
}
function mostrarReconectar(si){var b=$('#reconn');if(b)b.hidden=!si;if(si)estadoGuardado(PENDIENTE?'Sin guardar · conectá con Google':'Conectá con Google','err');}

/* --- Planilla en Drive --- */
function buscarPlanilla(){
  var q="appProperties has { key='agendaPsicologica' and value='datos' } and trashed=false";
  return gfetch(DRIVE+'?q='+encodeURIComponent(q)+'&spaces=drive&fields=files(id,name)').then(function(r){return r.files&&r.files[0]?r.files[0].id:null;});
}
function crearPlanilla(){
  var nombre=(CFG.marca||'Agenda Psicológica')+' – datos';
  return gfetch(SHEETS.slice(0,-1),{method:'POST',json:{properties:{title:nombre,locale:'es_AR',timeZone:'America/Argentina/Buenos_Aires'},
    sheets:[{properties:{sheetId:1,title:'Pacientes',index:0}},{properties:{sheetId:2,title:'Resumen',index:1}},{properties:{sheetId:3,title:'Notas de sesión',index:2}},{properties:{sheetId:9,title:'_datos',index:3,hidden:true}}]}})
  .then(function(r){SSID=r.spreadsheetId;return gfetch(DRIVE+'/'+SSID,{method:'PATCH',json:{appProperties:{agendaPsicologica:'datos'}}});})
  .then(function(){store(claveU('ss'),SSID);return SSID;});
}
function leerMeta(){return gfetch(SHEETS+SSID+'?fields=sheets.properties(sheetId,title,index,hidden,gridProperties)').then(function(r){META=(r.sheets||[]).map(function(s){return s.properties;});return META;});}
function leerDatos(){
  return gfetch(SHEETS+SSID+'/values/'+encodeURIComponent("'_datos'!A1:A")+'?majorDimension=COLUMNS').then(function(j){
    var col=(j.values&&j.values[0])||[];DATOS_FILAS=col.length;
    var meta={};try{meta=col[0]?JSON.parse(col[0]):{};}catch(x){}
    var txt=col.slice(1).join('');var d=null;try{d=txt?JSON.parse(txt):null;}catch(x){d=null;}
    return {datos:d,version:meta.v||0};
  });
}
function iniciarPlanilla(){
  estadoGuardado('Conectando…','');
  var guard=store(claveU('ss'));
  return (guard?Promise.resolve(guard):buscarPlanilla()).then(function(id){
    if(!id)return null;
    SSID=id;return leerMeta().then(function(){return id;},function(err){if(err&&err.status===404){store(claveU('ss'),null);SSID=null;return buscarPlanilla().then(function(i2){if(!i2)return null;SSID=i2;return leerMeta().then(function(){return i2;});});}throw err;});
  }).then(function(id){
    if(!id){
      toast('Creando tu planilla en Google Drive…');
      return crearPlanilla().then(leerMeta).then(function(){
        if(!ULTIMO){aplicarDatos({pacientes:[],turnos:[],cfg:null,plant:null,recx:{}},0,true);}
        VERSION=0;PENDIENTE=true;TABHASH={};enviar();render();
      });
    }
    store(claveU('ss'),SSID);
    if(PENDIENTE){return leerDatos().then(function(r){if(r.version===VERSION)enviar();else{PENDIENTE=false;store(claveU('pend'),null);aplicarDatos(r.datos||{},r.version);render();toast('Había cambios hechos en otro dispositivo: se cargaron.');}});}
    return leerDatos().then(function(r){var antes=ULTIMO;aplicarDatos(r.datos||{pacientes:[],turnos:[]},r.version);if(ULTIMO!==antes)render();estadoGuardado('Guardado','ok');revisarCopia();});
  }).catch(function(err){
    if(err&&err.auth){mostrarReconectar(true);return;}
    estadoGuardado('Sin conexión con Drive','err');
  });
}

/* --- Datos en memoria --- */
function estadoDatos(){return {pacientes:PAC,turnos:TURNOS.map(function(t){var c={};for(var k in t)if(k.charAt(0)!=='_')c[k]=t[k];return c;}),cfg:CFG,plant:PLANT,recx:RECX};}
function aplicarDatos(d,version,local){
  if(!d)return;
  PAC.length=0;(d.pacientes||[]).forEach(function(p){p.notas=p.notas||[];p.dispDias=p.dispDias||[];PAC.push(p);});
  TURNOS.length=0;(d.turnos||[]).forEach(function(t){TURNOS.push(t);});
  if(d.cfg)for(var k in d.cfg)CFG[k]=d.cfg[k];
  if(!CFG.copiaDrive||!CFG.copiaDrive.hojas)CFG.copiaDrive={activo:false,frec:'mensual',hojas:{pac:true,tur:true,pag:true,res:true},tema:'',ultima:''};
  if(d.plant)for(var k2 in d.plant){if(PLANT_VIEJAS.some(function(o){return o[k2]===d.plant[k2];}))continue;PLANT[k2]=d.plant[k2];}
  for(var k3 in RECX)delete RECX[k3];if(d.recx)for(var k4 in d.recx)RECX[k4]=d.recx[k4];
  if(version!=null)VERSION=version;
  ULTIMO=JSON.stringify(estadoDatos());
  if(!local)store(claveU('cache'),{datos:JSON.parse(ULTIMO),version:VERSION});
  aplicarTema();
}
function estadoGuardado(txt,cls){$$('[data-sync]').forEach(function(e){e.textContent=txt;e.className='sync '+(cls||'');});}
function guardarPronto(){
  if(!S.logged||!ULTIMO)return;
  if(soloLectura()){var j0=JSON.stringify(estadoDatos());if(j0!==ULTIMO&&!PENDIENTE){aplicarDatos(JSON.parse(ULTIMO),null,true);}return;}
  var j=JSON.stringify(estadoDatos());if(j===ULTIMO&&!PENDIENTE)return;
  if(j!==ULTIMO){PENDIENTE=true;store(claveU('pend'),{datos:JSON.parse(j),base:VERSION});}
  estadoGuardado('Guardando…','');
  clearTimeout(_tGuardar);_tGuardar=setTimeout(enviar,1800);
}
function enviar(){
  if(ENVIANDO||!PENDIENTE||!SSID||soloLectura())return;
  if(!tokenOk()){mostrarReconectar(true);return;}
  ENVIANDO=true;
  var j=JSON.stringify(estadoDatos()),base=VERSION;
  leerVersion().then(function(v){
    if(v!==base)return leerDatos().then(function(r){return {conflicto:true,datos:r.datos,version:r.version};});
    var nv=base+1;
    return leerMeta().then(function(){return gfetch(SHEETS+SSID+':batchUpdate',{method:'POST',json:{requests:armarPedidos(JSON.parse(j),nv)}});}).then(function(){return {ok:true,version:nv};});
  }).then(function(r){
    ENVIANDO=false;
    if(r.conflicto){PENDIENTE=false;store(claveU('pend'),null);TABHASH={};aplicarDatos(r.datos||{},r.version);render();estadoGuardado('Actualizado','ok');toast('Había cambios hechos en otro dispositivo: se cargaron. Revisá tu último cambio.');return;}
    VERSION=r.version;
    if(JSON.stringify(estadoDatos())===j){ULTIMO=j;PENDIENTE=false;store(claveU('pend'),null);store(claveU('cache'),{datos:JSON.parse(j),version:VERSION});estadoGuardado('Guardado en tu Drive','ok');}
    else{ULTIMO=j;enviar();}
  }).catch(function(err){
    ENVIANDO=false;
    if(err&&err.auth){mostrarReconectar(true);return;}
    TABHASH={};
    estadoGuardado(navigator.onLine===false?'Sin conexión · se guardará al volver':'No se pudo guardar · se reintenta','err');
  });
}
function leerVersion(){return gfetch(SHEETS+SSID+'/values/'+encodeURIComponent("'_datos'!A1")).then(function(j){try{return JSON.parse(j.values[0][0]).v||0;}catch(x){return 0;}});}
function cargar(){
  if(PENDIENTE||ENVIANDO||!SSID)return;
  if(!tokenOk()){mostrarReconectar(true);return;}
  leerDatos().then(function(r){
    if(PENDIENTE)return;
    var antes=ULTIMO;aplicarDatos(r.datos||{},r.version);if(ULTIMO!==antes){TABHASH={};render();}
    estadoGuardado('Guardado en tu Drive','ok');
  }).catch(function(err){if(err&&err.auth)mostrarReconectar(true);else estadoGuardado('Sin conexión','err');});
}
function salir(){
  TOK=null;store('ap_tok',null);
  if(USER){store(claveU('cache'),null);store(claveU('pend'),null);store(claveU('ss'),null);}
  USER=null;store('ap_user',null);TOKEN='';SSID=null;META=null;TABHASH={};
  S.logged=false;PENDIENTE=false;PAC.length=0;TURNOS.length=0;ULTIMO='';mostrarReconectar(false);location.hash='ingresar';render();
}
window.addEventListener('online',function(){if(PENDIENTE)enviar();});
setInterval(function(){if(PENDIENTE)enviar();},30000);
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&S.logged){if(PENDIENTE)enviar();else cargar();}});
document.addEventListener('input',function(){if(S.logged)guardarPronto();});
document.addEventListener('change',function(){if(S.logged)setTimeout(guardarPronto,0);});
function telWa(t){var d=String(t||'').replace(/\D/g,'');if(d.indexOf('0')===0)d=d.slice(1);if(d.indexOf('54')!==0)d='549'+d;return d;}

/* --- Dibujo de la planilla: colores y una hoja por mes --- */
function rgb(h){h=h.replace('#','');return {red:parseInt(h.slice(0,2),16)/255,green:parseInt(h.slice(2,4),16)/255,blue:parseInt(h.slice(4,6),16)/255};}
function celda(v,f){var c={userEnteredFormat:f||{}};if(v===null||v===undefined||v==='')return c;c.userEnteredValue=typeof v==='number'?{numberValue:v}:{stringValue:String(v)};return c;}
function nombreMes(ym){var d=D(ym+'-01');return cap(MESES[d.getMonth()])+' '+d.getFullYear();}
function dmy(k){if(!k)return '';var p=String(k).split('-');return p.length===3?p[2]+'/'+p[1]+'/'+p[0]:k;}
var MES_RE=/^(Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre) \d{4}$/;
function tablasPlanilla(d){
  var turnos=(d.turnos||[]).slice().sort(function(a,b){return (a.fecha+a.hora)<(b.fecha+b.hora)?-1:1;});
  var pagoE=function(t){return t.pagado===true?'Cobrado':t.pagado===null?'Sin cargo':(t.fecha<=HOY?'A cobrar':'');};
  var T=[];
  // Pacientes
  T.push({titulo:'Pacientes',sub:(d.pacientes||[]).length+' pacientes',cols:[{t:'Paciente',w:190},{t:'DNI',w:95},{t:'Nacimiento',w:95},{t:'Teléfono',w:135},{t:'Email',w:200},{t:'Cobertura',w:115},{t:'Coseguro',w:90,f:'$'},{t:'Honorario',w:90,f:'$'},{t:'Modalidad',w:95},{t:'Estado',w:85,tag:1},{t:'Dónde trabaja',w:180},{t:'Horario de trabajo',w:160},{t:'Días que puede',w:125},{t:'Horario que puede',w:125},{t:'Próxima sesión',w:120},{t:'Saldo',w:90,f:'$'}],
    filas:(d.pacientes||[]).slice().sort(function(a,b){return a.nombre<b.nombre?-1:1;}).map(function(p){
      var suyos=turnos.filter(function(t){return t.nombre===p.nombre;});
      var pr=suyos.filter(function(t){return (t.fecha+' '+t.hora)>AHORA&&t.estado!=='cancelada';})[0];
      var sd=suyos.filter(function(t){return t.pagado===false&&t.estado!=='cancelada'&&t.fecha<=HOY;}).reduce(function(a,t){return a+(+t.monto||0);},0);
      return [p.nombre,p.dni||'',dmy(p.nac),p.tel||'',p.email||'',p.obra||'',+p.coseguro||'',+p.honor||'',p.mod==='v'?'Virtual':'Presencial',({activo:'Activo',pausa:'En pausa',alta:'Alta'})[p.estado]||'Activo',p.trabajo||'',p.horTrabajo||'',diasTxt(p.dispDias),p.dispDesde?p.dispDesde+' a '+(p.dispHasta||'')+' h':'',pr?dmy(pr.fecha)+' '+pr.hora:'',sd||''];
    })});
  // Resumen
  var m={};turnos.forEach(function(t){var k=t.fecha.slice(0,7);m[k]=m[k]||{s:0,x:0,c:0,a:0};if(t.estado==='cancelada'){m[k].x++;return;}if(t.fecha<=HOY)m[k].s++;if(t.pagado===true)m[k].c+=(+t.monto||0);else if(t.pagado===false&&t.fecha<=HOY)m[k].a+=(+t.monto||0);});
  var rf=Object.keys(m).sort().reverse().map(function(k){return [nombreMes(k),m[k].s,m[k].x,m[k].c,m[k].a];});
  var sum=function(i){return rf.reduce(function(a,r){return a+r[i];},0);};
  T.push({titulo:'Resumen',sub:'Por mes',cols:[{t:'Mes',w:150},{t:'Sesiones realizadas',w:130},{t:'Canceladas',w:100},{t:'Cobrado',w:120,f:'$'},{t:'A cobrar',w:120,f:'$'}],filas:rf,total:rf.length?['Total',sum(1),sum(2),sum(3),sum(4)]:null});
  // Una hoja por mes (la más nueva primero)
  Object.keys(m).sort().reverse().forEach(function(ym){
    var ts=turnos.filter(function(t){return t.fecha.slice(0,7)===ym;});
    var pg=ts.filter(function(t){return t.estado!=='cancelada'&&t.fecha<=HOY;});
    var cob=pg.filter(function(t){return t.pagado===true;}).reduce(function(a,t){return a+(+t.monto||0);},0),deb=pg.filter(function(t){return t.pagado===false;}).reduce(function(a,t){return a+(+t.monto||0);},0);
    T.push({titulo:nombreMes(ym),sub:ts.length+' turnos',mes:true,cols:[{t:'Fecha',w:90},{t:'Día',w:90},{t:'Hora',w:60},{t:'Paciente',w:190},{t:'Modalidad',w:95},{t:'Duración',w:80},{t:'Estado',w:100,tag:1},{t:'Pago',w:95,tag:1},{t:'Monto',w:95,f:'$'},{t:'Medio de pago',w:125},{t:'Fecha de pago',w:105},{t:'Nota',w:220}],
      filas:ts.map(function(t){var e=String(t.estado||'');return [dmy(t.fecha),cap(DIAS[D(t.fecha).getDay()]),t.hora,t.nombre,t.mod==='v'?'Virtual':'Presencial',t.dur||'',e.charAt(0).toUpperCase()+e.slice(1),pagoE(t),+t.monto||'',t.pagado===true?(t.medio||''):'',t.pagado===true?dmy(t.fpago||t.fecha):'',t.nota||''];}),
      total:ts.length?['Total',pg.length+' sesiones','','','','','','',cob+deb,'Cobrado: $ '+cob.toLocaleString('es-AR'),'A cobrar: $ '+deb.toLocaleString('es-AR'),'']:null});
  });
  // Notas
  var notas=[];(d.pacientes||[]).forEach(function(p){(p.notas||[]).forEach(function(n){notas.push([n.f,p.nombre,n.t]);});});
  notas.sort(function(a,b){return a[0]<b[0]?1:-1;});
  T.push({titulo:'Notas de sesión',sub:'Privado',cols:[{t:'Fecha',w:95},{t:'Paciente',w:190},{t:'Nota',w:600,wrap:1}],filas:notas.map(function(n){return [dmy(n[0]),n[1],n[2]];})});
  return T;
}
function armarPedidos(d,nv){
  var pal=PALETAS[(d.cfg&&d.cfg.tema)||CFG.tema]||PALETAS.salvia;
  var marca=(d.cfg&&d.cfg.marca)||'Agenda Psicológica',prof=(d.cfg&&d.cfg.prof)||'';
  var T=tablasPlanilla(d),R=[],usados={};
  var porTitulo={};(META||[]).forEach(function(s){porTitulo[s.title]=s;usados[s.sheetId]=1;});
  var nuevoSid=function(){var n;do{n=100+Math.floor(Math.random()*2000000000);}while(usados[n]);usados[n]=1;return n;};
  var BL={red:1,green:1,blue:1},GR=rgb('#5C6660'),TX=rgb('#1F2A22');
  var TAG={'confirmado':[pal.pl2,pal.pd],'pendiente':['#F6E6D2','#6E4C1F'],'realizada':['#ECEAE3','#4A524C'],'cancelada':['#F3E1E1','#7A3B3B'],'cobrado':[pal.pl2,pal.pd],'a cobrar':['#F6E6D2','#6E4C1F'],'sin cargo':['#ECEAE3','#4A524C'],'activo':[pal.pl2,pal.pd],'en pausa':[pal.al,pal.ad],'alta':['#ECEAE3','#4A524C']};
  var PESOS={type:'CURRENCY',pattern:'"$" #,##0'};
  // Hojas que tienen que existir, en orden
  var orden=T.map(function(t){return t.titulo;}).concat(['_datos']);
  orden.forEach(function(tit){if(!porTitulo[tit]){var sid=nuevoSid();R.push({addSheet:{properties:{sheetId:sid,title:tit,hidden:tit==='_datos'}}});porTitulo[tit]={sheetId:sid,title:tit,gridProperties:{rowCount:1000,columnCount:26},nueva:true};TABHASH[tit]=null;}});
  // Borrar hojas de meses que ya no tienen turnos
  (META||[]).forEach(function(s){if(MES_RE.test(s.title)&&orden.indexOf(s.title)<0){R.push({deleteSheet:{sheetId:s.sheetId}});delete TABHASH[s.title];}});
  orden.forEach(function(tit,i){R.push({updateSheetProperties:{properties:{sheetId:porTitulo[tit].sheetId,index:i},fields:'index'}});});
  // Dibujar cada hoja visible (solo las que cambiaron)
  T.forEach(function(t){
    var sid=porTitulo[t.titulo].sheetId,n=t.cols.length;
    var hash=JSON.stringify([t,pal,marca,prof]);
    if(TABHASH[t.titulo]===hash)return;TABHASH[t.titulo]=hash;
    var filas=[];
    var fTit={backgroundColor:rgb(pal.pl3),textFormat:{fontFamily:'Georgia',fontSize:16,bold:true,foregroundColor:rgb(pal.pd)},verticalAlignment:'MIDDLE'};
    var fSub={backgroundColor:rgb(pal.pl3),textFormat:{fontSize:10,foregroundColor:GR}};
    filas.push({values:t.cols.map(function(c,i){return celda(i?'':marca+' · '+t.titulo,fTit);})});
    filas.push({values:t.cols.map(function(c,i){return celda(i?'':[prof,t.sub].filter(Boolean).join(' · '),fSub);})});
    filas.push({values:[]});
    filas.push({values:t.cols.map(function(c){return celda(c.t,{backgroundColor:rgb(pal.p),textFormat:{bold:true,foregroundColor:BL},verticalAlignment:'MIDDLE',wrapStrategy:'WRAP'});})});
    if(!t.filas.length)filas.push({values:[celda(t.mes?'Sin turnos':'Todavía no hay datos',{textFormat:{italic:true,foregroundColor:GR}})]});
    t.filas.forEach(function(f,fi){
      filas.push({values:t.cols.map(function(c,ci){
        var v=f[ci],fmt={backgroundColor:fi%2?rgb(pal.pl3):BL,textFormat:{foregroundColor:TX},verticalAlignment:'MIDDLE',borders:{bottom:{style:'SOLID',color:rgb(pal.pb)}}};
        if(c.f==='$'&&typeof v==='number')fmt.numberFormat=PESOS;
        if(c.wrap)fmt.wrapStrategy='WRAP';
        if(c.tag&&v){var tg=TAG[String(v).toLowerCase()];if(tg){fmt.backgroundColor=rgb(tg[0]);fmt.textFormat={foregroundColor:rgb(tg[1]),bold:true};fmt.horizontalAlignment='CENTER';}}
        return celda(v,fmt);
      })});
    });
    if(t.total){filas.push({values:t.cols.map(function(c,ci){var v=t.total[ci],fmt={backgroundColor:rgb(pal.pl2),textFormat:{bold:true,foregroundColor:rgb(pal.pd)},borders:{top:{style:'SOLID_MEDIUM',color:rgb(pal.p)}}};if(c.f==='$'&&typeof v==='number')fmt.numberFormat=PESOS;return celda(v,fmt);})});}
    var g=porTitulo[t.titulo].gridProperties||{rowCount:1000,columnCount:26};
    var filasNec=Math.max(filas.length+20,100),colsNec=Math.max(n,26);
    R.push({updateSheetProperties:{properties:{sheetId:sid,tabColor:t.mes?rgb(pal.p):rgb(pal.pd),gridProperties:{rowCount:Math.max(filasNec,g.rowCount||0),columnCount:colsNec,frozenRowCount:4,hideGridlines:true}},fields:'tabColor,gridProperties.rowCount,gridProperties.columnCount,gridProperties.frozenRowCount,gridProperties.hideGridlines'}});
    R.push({unmergeCells:{range:{sheetId:sid}}});
    R.push({updateCells:{range:{sheetId:sid},fields:'userEnteredValue,userEnteredFormat'}});
    R.push({updateCells:{start:{sheetId:sid,rowIndex:0,columnIndex:0},rows:filas,fields:'userEnteredValue,userEnteredFormat'}});
    R.push({mergeCells:{range:{sheetId:sid,startRowIndex:0,endRowIndex:1,startColumnIndex:0,endColumnIndex:n},mergeType:'MERGE_ALL'}});
    R.push({mergeCells:{range:{sheetId:sid,startRowIndex:1,endRowIndex:2,startColumnIndex:0,endColumnIndex:n},mergeType:'MERGE_ALL'}});
    R.push({updateDimensionProperties:{range:{sheetId:sid,dimension:'ROWS',startIndex:0,endIndex:1},properties:{pixelSize:36},fields:'pixelSize'}});
    R.push({updateDimensionProperties:{range:{sheetId:sid,dimension:'ROWS',startIndex:3,endIndex:4},properties:{pixelSize:30},fields:'pixelSize'}});
    t.cols.forEach(function(c,ci){R.push({updateDimensionProperties:{range:{sheetId:sid,dimension:'COLUMNS',startIndex:ci,endIndex:ci+1},properties:{pixelSize:c.w||110},fields:'pixelSize'}});});
  });
  // Datos completos (la app lee de acá): hoja oculta _datos
  var txt=JSON.stringify(d),partes=[],sz=40000;
  for(var i=0;i<txt.length;i+=sz)partes.push(txt.slice(i,i+sz));
  var dsid=porTitulo['_datos'].sheetId,dg=porTitulo['_datos'].gridProperties||{rowCount:1000};
  var total=Math.max(partes.length+1,DATOS_FILAS);
  var filasD=[{values:[celda(JSON.stringify({v:nv,app:'Agenda Psicológica',fecha:AHORA}))]}].concat(partes.map(function(p){return {values:[celda(p)]};}));
  while(filasD.length<total)filasD.push({values:[{}]});
  if((dg.rowCount||0)<total+5)R.push({updateSheetProperties:{properties:{sheetId:dsid,gridProperties:{rowCount:total+50}},fields:'gridProperties.rowCount'}});
  R.push({updateCells:{start:{sheetId:dsid,rowIndex:0,columnIndex:0},rows:filasD,fields:'userEnteredValue'}});
  DATOS_FILAS=partes.length+1;
  return R;
}

/* --- Copias en Excel guardadas en su Drive --- */
function carpetaExcel(){
  var q="appProperties has { key='agendaPsicologica' and value='excel' } and trashed=false";
  return gfetch(DRIVE+'?q='+encodeURIComponent(q)+'&spaces=drive&fields=files(id)').then(function(r){
    if(r.files&&r.files[0])return r.files[0].id;
    return gfetch(DRIVE+'?fields=id',{method:'POST',json:{name:(CFG.marca||'Agenda Psicológica')+' – Excel',mimeType:'application/vnd.google-apps.folder',appProperties:{agendaPsicologica:'excel'}}}).then(function(f){return f.id;});
  });
}
function subirExcel(buf,nombre){
  return carpetaExcel().then(function(folder){
    var b='agenda'+Date.now(),meta={name:nombre,parents:[folder]};
    var cuerpo=new Blob(['--'+b+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'+JSON.stringify(meta)+'\r\n--'+b+'\r\nContent-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\r\n\r\n',buf,'\r\n--'+b+'--'],{type:'multipart/related; boundary='+b});
    return gfetch(UPLOAD,{method:'POST',body:cuerpo,headers:{'Content-Type':'multipart/related; boundary='+b}});
  });
}
function periodoCopia(frec,actual){
  var h=D(HOY);
  if(actual){var ym=HOY.slice(0,7);return {clave:'manual',desde:ym+'-01',hasta:HOY,txt:nombreMes(ym)+' (hasta hoy)'};}
  if(frec==='semanal'){var lun=add(lunes(HOY),-7),dom=add(lun,6);return {clave:lun,desde:lun,hasta:dom,txt:'Semana del '+dmy(lun)+' al '+dmy(dom)};}
  var ini=K(new Date(h.getFullYear(),h.getMonth()-1,1)),fin=K(new Date(h.getFullYear(),h.getMonth(),0));
  return {clave:ini.slice(0,7),desde:ini,hasta:fin,txt:nombreMes(ini.slice(0,7))};
}
function guardarCopia(actual){
  var X=CFG.copiaDrive,per=periodoCopia(X.frec,actual);
  return cargarExcelJS().then(function(){return armarExcel(X.hojas,per,PALETAS[X.tema||CFG.tema]||PALETAS.salvia);})
  .then(function(buf){var nombre=(CFG.marca||'Agenda').replace(/[^\wáéíóúñÁÉÍÓÚÑ -]/g,'').trim().replace(/\s+/g,'_')+'_'+per.desde+'_al_'+per.hasta+'.xlsx';return subirExcel(buf,nombre).then(function(){return {nombre:nombre,per:per};});});
}
function revisarCopia(){
  var X=CFG.copiaDrive;if(!X||!X.activo||!tokenOk(300000))return;
  var per=periodoCopia(X.frec,false);if(X.ultima===per.clave)return;
  if(X.frec==='semanal'&&add(per.hasta,1)>HOY)return;
  guardarCopia(false).then(function(r){X.ultima=per.clave;guardarPronto();toast('Se guardó la copia en Excel de '+r.per.txt+' en tu Drive');}).catch(function(){});
}
function guardarCopiaAhora(btn){
  if(!tokenOk()){mostrarReconectar(true);return;}
  btn.disabled=true;var txt=btn.innerHTML;btn.textContent='Guardando…';
  guardarCopia(true).then(function(r){btn.disabled=false;btn.innerHTML=txt;toast('Listo: "'+r.nombre+'" quedó en tu Drive, en la carpeta '+(CFG.marca||'Agenda Psicológica')+' – Excel');})
  .catch(function(err){btn.disabled=false;btn.innerHTML=txt;if(err&&err.auth)mostrarReconectar(true);else toast('No se pudo guardar la copia. Probá de nuevo.');});
}

/* ---------- Descargar Excel ---------- */
function abrirExcel(origen){
  var meses={};TURNOS.forEach(function(t){meses[t.fecha.slice(0,7)]=1;});meses[HOY.slice(0,7)]=1;
  var ms=Object.keys(meses).sort().reverse();
  var pals=Object.keys(PALETAS).map(function(k){var t=PALETAS[k];return '<button type="button" class="paleta" data-xlpal="'+k+'" aria-pressed="'+(CFG.tema===k)+'"><span class="sw4"><i style="background:'+t.p+'"></i><i style="background:'+t.pl+'"></i><i style="background:'+t.a+'"></i></span><b>'+t.n+'</b></button>';}).join('');
  function chk(k,l,on){return '<label class="chk"><input type="checkbox" name="xl'+k+'"'+(on?' checked':'')+'>'+l+'</label>';}
  $('#xlBody').innerHTML='<div class="fsec">Qué incluir</div><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">'+
    chk('pac','Pacientes',origen!=='pagos')+chk('tur','Turnos',true)+chk('pag','Pagos',true)+chk('res','Resumen por mes',origen==='pagos')+'</div>'+
    '<label class="f">Período (turnos y pagos)<select id="xlPer"><option value="todo">Todo</option>'+ms.map(function(m){var d=D(m+'-01');return '<option value="'+m+'"'+(m===HOY.slice(0,7)&&origen==='pagos'?' selected':'')+'>'+cap(MESES[d.getMonth()])+' '+d.getFullYear()+'</option>';}).join('')+'</select></label>'+
    '<div class="fsec">Colores de la planilla</div><div class="paletas xl">'+pals+'</div>';
  openOv('#ovExcel');
}
var _xlLib=null;
function cargarExcelJS(){if(window.ExcelJS)return Promise.resolve();if(_xlLib)return _xlLib;_xlLib=new Promise(function(ok,mal){var sc=document.createElement('script');sc.src='exceljs.min.js';sc.onload=ok;sc.onerror=function(){_xlLib=null;mal();};document.head.appendChild(sc);});return _xlLib;}
function argb(h){return 'FF'+h.replace('#','').toUpperCase();}
function fechaXL(k){if(!k)return null;var p=k.split('-');return new Date(Date.UTC(+p[0],+p[1]-1,+p[2]));}
function descargarExcel(){
  var b=$('#bExcel'),per=$('#xlPer').value,palK=($$('[data-xlpal]').filter(function(x){return x.getAttribute('aria-pressed')==='true';})[0]||{}).getAttribute?$$('[data-xlpal]').filter(function(x){return x.getAttribute('aria-pressed')==='true';})[0].getAttribute('data-xlpal'):CFG.tema;
  var inc={pac:$('[name=xlpac]').checked,tur:$('[name=xltur]').checked,pag:$('[name=xlpag]').checked,res:$('[name=xlres]').checked};
  if(!inc.pac&&!inc.tur&&!inc.pag&&!inc.res){toast('Elegí al menos una hoja');return;}
  b.disabled=true;b.textContent='Armando…';
  cargarExcelJS().then(function(){return armarExcel(inc,per,PALETAS[palK]||PALETAS.salvia);}).then(function(buf){
    var nombre=(CFG.marca||'Agenda').replace(/[^\wáéíóúñÁÉÍÓÚÑ -]/g,'').trim().replace(/\s+/g,'_')+'_'+(per==='todo'?HOY:per)+'.xlsx';
    var url=URL.createObjectURL(new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
    var a=document.createElement('a');a.href=url;a.download=nombre;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},4000);
    b.disabled=false;b.textContent='Descargar';closeOv();toast('Excel descargado: '+nombre);
  }).catch(function(e){b.disabled=false;b.textContent='Descargar';toast('No se pudo armar el Excel. Revisá la conexión e intentá de nuevo.');if(window.console)console.error(e);});
}
function armarExcel(inc,per,pal){
  var wb=new ExcelJS.Workbook();wb.creator=CFG.prof||'Agenda Psicológica';wb.created=new Date();
  var enRango=function(k){return per==='todo'||(typeof per==='object'?(k>=per.desde&&k<=per.hasta):k.slice(0,7)===per);};
  var perTxt=per==='todo'?'Todo':typeof per==='object'?per.txt:cap(MESES[D(per+'-01').getMonth()])+' '+per.slice(0,4);
  var borde={style:'thin',color:{argb:argb(pal.pb)}};
  var PESOS='"$" #,##0';
  function hoja(nombre,titulo,cols,filas,opc){
    opc=opc||{};
    var ws=wb.addWorksheet(nombre,{views:[{state:'frozen',ySplit:4,showGridLines:false}],properties:{tabColor:{argb:argb(pal.p)}}});
    ws.columns=cols.map(function(c){return {key:c.k,width:c.w||16};});
    var n=cols.length;
    ws.mergeCells(1,1,1,n);ws.mergeCells(2,1,2,n);
    var t=ws.getCell(1,1);t.value=(CFG.marca||'Agenda Psicológica')+' · '+titulo;t.font={name:'Georgia',size:16,bold:true,color:{argb:argb(pal.pd)}};t.alignment={vertical:'middle'};ws.getRow(1).height=30;
    var st=ws.getCell(2,1);st.value=[CFG.prof,opc.sub,'Descargado el '+largo(HOY).replace('Hoy, ','').toLowerCase()].filter(Boolean).join(' · ');st.font={size:10,color:{argb:'FF5C6660'}};
    for(var c=1;c<=n;c++){ws.getCell(1,c).fill={type:'pattern',pattern:'solid',fgColor:{argb:argb(pal.pl3)}};ws.getCell(2,c).fill={type:'pattern',pattern:'solid',fgColor:{argb:argb(pal.pl3)}};}
    var hr=ws.getRow(4);hr.values=cols.map(function(c){return c.t;});hr.height=24;
    hr.eachCell(function(cell){cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:argb(pal.p)}};cell.font={bold:true,color:{argb:'FFFFFFFF'}};cell.alignment={vertical:'middle',wrapText:true};cell.border={bottom:borde};});
    filas.forEach(function(f,i){
      var r=ws.addRow(f);r.height=20;
      r.eachCell({includeEmpty:true},function(cell,ci){
        var col=cols[ci-1];if(!col)return;
        if(i%2===1)cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:argb(pal.pl3)}};
        cell.border={bottom:{style:'hair',color:{argb:argb(pal.pb)}}};cell.alignment={vertical:'middle',wrapText:!!col.wrap};
        if(col.f==='$')cell.numFmt=PESOS;
        if(col.f==='d')cell.numFmt='dd/mm/yyyy';
        if(col.tag&&cell.value){var cl=col.tag[String(cell.value).toLowerCase()];if(cl){cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:argb(cl[0])}};cell.font={color:{argb:argb(cl[1])},bold:true};cell.alignment={horizontal:'center',vertical:'middle'};}}
      });
    });
    if(!filas.length){var r0=ws.addRow(['Sin datos para este período']);r0.getCell(1).font={italic:true,color:{argb:'FF5C6660'}};}
    if(opc.total&&filas.length){
      var tr=ws.addRow(opc.total(filas));tr.height=24;
      tr.eachCell({includeEmpty:true},function(cell,ci){var col=cols[ci-1];if(!col)return;cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:argb(pal.pl2)}};cell.font={bold:true,color:{argb:argb(pal.pd)}};cell.border={top:{style:'medium',color:{argb:argb(pal.p)}}};if(col.f==='$')cell.numFmt=PESOS;});
    }
    if(filas.length)ws.autoFilter={from:{row:4,column:1},to:{row:4+filas.length,column:n}};
    ws.pageSetup={orientation:'landscape',fitToPage:true,fitToWidth:1,fitToHeight:0,paperSize:9};
    return ws;
  }
  var TAG_EST={confirmado:[pal.pl2,pal.pd],pendiente:['#F6E6D2','#6E4C1F'],realizada:['#ECEAE3','#4A524C'],cancelada:['#F3E1E1','#7A3B3B'],'cobrado':[pal.pl2,pal.pd],'a cobrar':['#F6E6D2','#6E4C1F'],'sin cargo':['#ECEAE3','#4A524C'],activo:[pal.pl2,pal.pd],'en pausa':[pal.al,pal.ad],alta:['#ECEAE3','#4A524C']};
  var pagoE=function(t){return t.pagado===true?'Cobrado':t.pagado===null?'Sin cargo':(t.fecha<=HOY?'A cobrar':'');};
  if(inc.pac){
    var pf=PAC.slice().sort(function(a,b){return a.nombre<b.nombre?-1:1;}).map(function(p){var pr=proximo(p),e=edad(p.nac);
      return [p.nombre,p.dni||'',fechaXL(p.nac),e==null?'':e,p.tel||'',p.email||'',p.obra||'',p.coseguro||null,p.honor||null,p.mod==='v'?'Virtual':'Presencial',({activo:'Activo',pausa:'En pausa',alta:'Alta'})[p.estado],p.trabajo||'',p.horTrabajo||'',diasTxt(p.dispDias),p.dispDesde?p.dispDesde+' a '+(p.dispHasta||'')+' h':'',pr?corto(pr.fecha)+' '+pr.hora:'',saldo(p)||null];});
    hoja('Pacientes','Pacientes',[{t:'Paciente',w:24},{t:'DNI',w:13},{t:'Nacimiento',w:13,f:'d'},{t:'Edad',w:7},{t:'Teléfono',w:18},{t:'Email',w:26},{t:'Cobertura',w:15},{t:'Coseguro',w:12,f:'$'},{t:'Honorario',w:12,f:'$'},{t:'Modalidad',w:12},{t:'Estado',w:11,tag:TAG_EST},{t:'Dónde trabaja',w:24,wrap:true},{t:'Horario de trabajo',w:20,wrap:true},{t:'Días que puede',w:16},{t:'Horario que puede',w:16},{t:'Próxima sesión',w:16},{t:'Saldo',w:12,f:'$'}],pf,{sub:PAC.length+' pacientes'});
  }
  var ts=TURNOS.filter(function(t){return enRango(t.fecha);}).sort(function(a,b){return (a.fecha+a.hora)<(b.fecha+b.hora)?-1:1;});
  if(inc.tur){
    hoja('Turnos','Turnos',[{t:'Fecha',w:12,f:'d'},{t:'Día',w:11},{t:'Hora',w:8},{t:'Paciente',w:24},{t:'Modalidad',w:12},{t:'Duración',w:10},{t:'Estado',w:13,tag:TAG_EST},{t:'Pago',w:12,tag:TAG_EST},{t:'Monto',w:12,f:'$'},{t:'Nota',w:30,wrap:true}],
      ts.map(function(t){return [fechaXL(t.fecha),cap(DIAS[D(t.fecha).getDay()]),t.hora,t.nombre,t.mod==='v'?'Virtual':'Presencial',t.dur,cap(t.estado),pagoE(t),t.monto||null,t.nota||''];}),{sub:perTxt+' · '+ts.length+' turnos'});
  }
  if(inc.pag){
    var pg=ts.filter(function(t){return t.estado!=='cancelada'&&t.fecha<=HOY&&t.monto>0;});
    hoja('Pagos','Pagos',[{t:'Fecha de sesión',w:14,f:'d'},{t:'Paciente',w:24},{t:'Modalidad',w:12},{t:'Monto',w:13,f:'$'},{t:'Estado',w:12,tag:TAG_EST},{t:'Medio de pago',w:16},{t:'Fecha de pago',w:14,f:'d'}],
      pg.map(function(t){return [fechaXL(t.fecha),t.nombre,t.mod==='v'?'Virtual':'Presencial',t.monto,pagoE(t),t.pagado===true?(t.medio||''):'',t.pagado===true?fechaXL(t.fpago||t.fecha):null];}),
      {sub:perTxt,total:function(){var c=pg.filter(function(t){return t.pagado===true;}).reduce(function(a,t){return a+t.monto;},0),d=pg.filter(function(t){return t.pagado===false;}).reduce(function(a,t){return a+t.monto;},0);return ['Total',pg.length+' sesiones','',c+d,'Cobrado: $ '+c.toLocaleString('es-AR'),'A cobrar: $ '+d.toLocaleString('es-AR'),''];}});
  }
  if(inc.res){
    var m={};TURNOS.forEach(function(t){if(!enRango(t.fecha))return;var k=t.fecha.slice(0,7);m[k]=m[k]||{s:0,c:0,a:0,x:0};if(t.estado==='cancelada'){m[k].x++;return;}if(t.fecha<=HOY)m[k].s++;if(t.pagado===true)m[k].c+=t.monto;else if(t.pagado===false&&t.fecha<=HOY)m[k].a+=t.monto;});
    var rf=Object.keys(m).sort().map(function(k){var d=D(k+'-01');return [cap(MESES[d.getMonth()])+' '+d.getFullYear(),m[k].s,m[k].x,m[k].c,m[k].a];});
    hoja('Resumen','Resumen por mes',[{t:'Mes',w:18},{t:'Sesiones realizadas',w:14},{t:'Canceladas',w:12},{t:'Cobrado',w:14,f:'$'},{t:'A cobrar',w:14,f:'$'}],rf,{sub:perTxt,total:function(f){return ['Total',f.reduce(function(a,r){return a+r[1];},0),f.reduce(function(a,r){return a+r[2];},0),f.reduce(function(a,r){return a+r[3];},0),f.reduce(function(a,r){return a+r[4];},0)];}});
  }
  if(CFG.logo==='imagen'&&CFG.logoImg&&/^data:image\/(png|jpe?g)/.test(CFG.logoImg)){
    var id=wb.addImage({base64:CFG.logoImg,extension:/png/.test(CFG.logoImg.slice(0,20))?'png':'jpeg'});
    wb.worksheets.forEach(function(ws){ws.addImage(id,{tl:{col:ws.columns.length-1+0.4,row:0.15},ext:{width:44,height:44}});});
  }
  return wb.xlsx.writeBuffer();
}

/* ---------- Estado de la interfaz ---------- */
var S={dash:HOY,q:'',vista:'mes',fecha:HOY,
  pq:'',pf:'activo',pagq:'',pagf:'todos',pmes:HOY.slice(0,7),recf:'proximos',cfgTab:'consultorio',anual:false,
  logged:!!TOKEN,destino:null,verTodo:false};

/* ---------- Navegación ---------- */
var NAV=[['inicio','Inicio','i-home'],['calendario','Calendario','i-cal'],['pacientes','Pacientes','i-users'],['pagos','Pagos','i-card'],['recordatorios','Recordatorios','i-bell'],['configuracion','Configuración','i-set']];
var BNAV=[['inicio','Inicio','i-home'],['calendario','Calendario','i-cal'],['pacientes','Pacientes','i-users'],['pagos','Pagos','i-card'],['mas','Más','i-menu']];
function seccion(k){return k.indexOf('paciente-')===0?'pacientes':k;}
function renderNav(cur){
  var s=seccion(cur),prog=recordatorios().filter(function(r){return r.estado==='programado';}).length;
  $('#menu').innerHTML=NAV.map(function(n){return '<button class="nav-a" data-go="'+n[0]+'"'+(n[0]===s?' aria-current="page"':'')+'>'+ico(n[2])+n[1]+(n[0]==='recordatorios'&&prog?'<span class="badge">'+prog+'</span>':'')+'</button>';}).join('');
  $('#bnav').innerHTML=BNAV.map(function(n){var c=(n[0]===s)||(n[0]==='mas'&&['recordatorios','configuracion'].indexOf(s)>=0);return '<button data-go="'+n[0]+'"'+(c?' aria-current="page"':'')+'>'+ico(n[2],22)+n[1]+'</button>';}).join('');
}

/* ================= INICIO ================= */
function kp(go,ic,cls,n,l,s){return '<button class="kpi" data-go="'+go+'"><div class="ic '+cls+'">'+ico(ic)+'</div><div><div class="n">'+n+'</div><div class="l">'+l+'</div><div class="s">'+s+'</div></div></button>';}
function kpis(){
  var h=delDia(HOY).filter(function(t){return t.estado!=='cancelada';}),pen=h.filter(function(t){return t.estado==='pendiente';}).length;
  var deu=porCobrar().reduce(function(a,t){return a+t.monto;},0),rec=recordatorios().filter(function(r){return r.estado==='programado';}).length;
  function ch(go,ic,cls,n,l){return '<button class="chipk" data-go="'+go+'"><span class="ic '+cls+'">'+ico(ic,17)+'</span><b>'+n+'</b>'+l+'</button>';}
  return '<section class="resumen" aria-label="Resumen">'+
  ch('calendario','i-cal','p',h.length,h.length===1?'turno hoy':'turnos hoy')+
  ch('calendario','i-clock','s',pen,'sin confirmar')+
  ch('pagos','i-wallet','s',plata(deu),'por cobrar')+
  ch('recordatorios','i-bell','a',rec,rec===1?'recordatorio':'recordatorios')+'</section>';
}
function filaTurno(t,conFecha){
  return '<button class="row" data-tid="'+t.id+'"><span class="h">'+t.hora+'</span><span class="av '+color(t.nombre)+'">'+ini(t.nombre)+'</span><span class="who"><span class="nm">'+esc(t.nombre)+'</span><span class="dt">'+ico(t.mod==='v'?'i-video':'i-pin',15)+(conFecha?corto(t.fecha)+' · ':'')+(t.mod==='v'?'Virtual':'Presencial')+' · '+t.dur+'</span></span><span class="pg">'+pagoTxt(t)+'</span><span class="tag t-'+t.estado+'">'+t.estado+'</span></button>';
}
function agenda(){
  var k=S.dash,q=S.q.trim().toLowerCase(),todos=delDia(k);
  var lista=todos.filter(function(t){return !q||t.nombre.toLowerCase().indexOf(q)>=0;});
  var conf=todos.filter(function(t){return t.estado==='confirmado';}).length;
  var res=todos.length+(todos.length===1?' sesión':' sesiones')+(conf?' · '+conf+(conf===1?' confirmada':' confirmadas'):'');
  if(q)res='Buscando “'+esc(S.q)+'” · '+lista.length+' resultado'+(lista.length===1?'':'s');
  var l0=lunes(HOY),dias='';
  for(var i=0;i<6;i++){var dk=add(l0,i),d=D(dk),n=delDia(dk).length;
    dias+='<button class="day'+(dk===HOY?' hoy':'')+'" data-dash="'+dk+'" aria-pressed="'+(dk===k)+'"><span class="d1">'+(dk===HOY?'Hoy':DIAS_C[d.getDay()])+'</span><span class="d2">'+d.getDate()+'</span><span class="d3">'+n+(n===1?' turno':' turnos')+'</span></button>';}
  var rows=lista.map(function(t){return filaTurno(t);}).join('');
  if(!lista.length)rows='<div class="empty">'+(q?'Ningún turno coincide con la búsqueda.':'No hay turnos este día.')+' <button class="link" data-nuevo style="font-size:15px;font-weight:600">Agendar uno</button></div>';
  var d=D(k);
  return '<section class="card" aria-labelledby="tAg"><div class="card-h"><div><h2 id="tAg">'+(k===HOY?'Turnos de hoy':'Turnos del '+DIAS[d.getDay()]+' '+d.getDate())+'</h2><div class="muted" style="font-size:14px;margin-top:2px">'+res+'</div></div><button class="link" data-cal="dia" data-f="'+k+'">Ver en el calendario'+ico('i-arrow',16,1.8)+'</button></div><div class="days" role="group" aria-label="Semana actual">'+dias+'</div><div>'+rows+'</div></section>';
}
function lateral(){
  var pc=porCobrar(),total=pc.reduce(function(a,t){return a+t.monto;},0);
  var pays=pc.slice(0,3).map(function(t){return '<div class="pay"><div><div class="nm">'+esc(t.nombre)+'</div><div class="dt">'+corto(t.fecha)+' · '+t.hora+'</div></div><div style="display:flex;align-items:center"><span class="m">'+plata(t.monto)+'</span><button class="mini" data-pagar="'+t.id+'">Cobrar</button></div></div>';}).join('');
  if(!pc.length)pays='<div class="pay"><div class="dt">No hay pagos pendientes.</div></div>';
  return '<section class="card" style="padding:24px;gap:4px" aria-labelledby="tPag"><div class="card-h" style="margin-bottom:8px"><h2 id="tPag" style="font-size:22px">Por cobrar</h2><button class="link" data-go="pagos" style="font-size:14px">'+(pc.length>3?'Ver los '+pc.length:'Ir a pagos')+'</button></div>'+pays+'<div class="total"><span>Total</span><span class="m">'+plata(total)+'</span></div></section>';
}
function nombreCorto(){return (CFG.prof||'').replace(/^(Lic\.|Dra?\.|Psic\.|Mg\.)\s*/i,'').split(' ')[0];}
function saludo(){var h=+AHORA.slice(11,13);return h<12?'Buenos días':h<20?'Buenas tardes':'Buenas noches';}
function dashboard(){
  var m=delDia(add(HOY,1)).filter(function(t){return t.estado!=='cancelada';}),nom=CFG.prof.replace(/^(Lic\.|Dra?\.|Psic\.)\s*/i,'').split(' ')[0];
  return '<header class="head"><div><h1>'+saludo()+(nom?', '+esc(nom):'')+'</h1><div class="sub">'+largo(HOY).replace('Hoy, ','')+(m.length?' · Mañana tenés '+m.length+(m.length===1?' sesión':' sesiones')+', la primera a las '+m[0].hora:'')+'</div></div>'+
  '<div class="actions"><button class="btn-primary" data-nuevo>'+ico('i-plus',17,2)+'Nuevo turno</button></div></header>'+
  (!CFG.prof||!PAC.length?'<section class="card" style="flex-direction:row;flex-wrap:wrap;align-items:center;gap:16px;background:var(--pl3)"><div style="flex:1;min-width:220px"><h2 style="font-size:21px">Para empezar</h2><div class="muted" style="font-size:14.5px;margin-top:4px">'+(!CFG.prof?'Cargá tu nombre y los datos del consultorio. ':'')+(!PAC.length?'Después agregá tus pacientes y agendá el primer turno.':'')+'</div></div>'+(!CFG.prof?'<button class="btn-ghost" data-go="configuracion">Mis datos</button>':'')+(!PAC.length?'<button class="btn-primary" data-npac>Agregar paciente</button>':'')+'</section>':'')+
  kpis()+'<div class="cols solo">'+agenda()+'</div>';
}

/* ================= CALENDARIO ================= */
function rango(){
  var d=D(S.fecha);
  if(S.vista==='dia')return largo(S.fecha);
  if(S.vista==='mes')return cap(MESES[d.getMonth()])+' '+d.getFullYear();
  var ds=diasSemana(),a=D(ds[0]),b=D(ds[ds.length-1]);
  return a.getDate()+(a.getMonth()!==b.getMonth()?' '+MESES_C[a.getMonth()]:'')+' – '+b.getDate()+' '+MESES_C[b.getMonth()]+' '+b.getFullYear();
}
function diasSemana(){var l=lunes(S.fecha);return diasAtencion().map(function(n){return add(l,(n+6)%7);});}
function calTool(){
  function v(id,l){return '<button data-vista="'+id+'" aria-pressed="'+(S.vista===id)+'">'+l+'</button>';}
  return '<div class="ctool"><div class="cnav"><button class="icb" data-mover="-1" aria-label="Anterior">'+ico('i-left',18,2)+'</button><button class="icb" data-mover="1" aria-label="Siguiente">'+ico('i-right',18,2)+'</button><button class="btn-ghost" data-hoy>Hoy</button><span class="rango" aria-live="polite">'+rango()+'</span></div>'+
  '<div class="cnav"><div class="segv" role="group" aria-label="Vista">'+v('mes','Mes')+v('dia','Día')+'</div><button class="btn-primary" data-nuevo>'+ico('i-plus',17,2)+'Nuevo turno</button></div></div>';
}
function lanes(lista){var fin=[];lista.forEach(function(t){var s=mins(t.hora),i=0;while(fin[i]!==undefined&&fin[i]>s)i++;fin[i]=s+durMin(t);t._l=i;});return Math.max(1,fin.length);}
function evHtml(t,n,ancho){
  var H0=CFG.desde,top=(mins(t.hora)-H0*60)/60*HH,h=Math.max(26,durMin(t)/60*HH-4),w=100/n;
  var cls='ev'+(t.mod==='v'?' v':'')+(t.estado==='pendiente'?' pend':'')+(t.estado==='cancelada'?' canc':'')+(t.estado==='realizada'?' real':'');
  var hf=hhmm(mins(t.hora)+durMin(t));
  return '<button class="'+cls+'" data-tid="'+t.id+'" style="top:'+(top+2)+'px;height:'+h+'px;left:calc('+(t._l*w)+'% + 4px);width:calc('+w+'% - 8px)" aria-label="'+esc(t.nombre)+', '+t.hora+', '+t.estado+'"><b>'+esc(t.nombre)+'</b>'+(h>36?'<small>'+ico(t.mod==='v'?'i-video':'i-pin',12)+t.hora+' – '+hf+(ancho&&(t.estado==='pendiente'||t.estado==='cancelada')?' · '+t.estado:'')+'</small>':'')+'</button>';
}
function grilla(dias,ancho){
  var H0=CFG.desde,H1=CFG.hasta,cols='64px repeat('+dias.length+',minmax('+(ancho?'0':'110px')+',1fr))';
  var head='<div class="whead" style="grid-template-columns:'+cols+'"><div></div>'+dias.map(function(k){var d=D(k),n=delDia(k).filter(function(t){return t.estado!=='cancelada';}).length;return '<button class="wd'+(k===HOY?' hoy':'')+'" data-cal="dia" data-f="'+k+'"><span class="dn">'+DIAS_C[d.getDay()]+'</span><span class="num">'+d.getDate()+'</span><span class="cnt">'+(n?n+(n===1?' turno':' turnos'):'libre')+'</span></button>';}).join('')+'</div>';
  var horas='';for(var h=H0+1;h<H1;h++)horas+='<span style="top:'+((h-H0)*HH)+'px">'+('0'+h).slice(-2)+':00</span>';
  var body='<div class="wbody" style="grid-template-columns:'+cols+';height:'+((H1-H0)*HH)+'px"><div class="hcol">'+horas+'</div>'+dias.map(function(k){
    var l=delDia(k).filter(function(t){return mins(t.hora)>=H0*60&&mins(t.hora)<H1*60;}),n=lanes(l);
    return '<div class="dcol'+(k===HOY?' hoy':'')+'" data-slot="'+k+'" title="Tocá un horario libre para agendar">'+l.map(function(t){return evHtml(t,n,ancho);}).join('')+'</div>';
  }).join('')+'</div>';
  return '<div class="cal"><div class="cal-scroll"><div style="min-width:'+(ancho?'0':Math.max(420,dias.length*120+64)+'px')+'">'+head+body+'</div></div></div>';
}
function leyenda(){return '<div class="legend"><span><i style="background:var(--pl);border-left:3px solid var(--p)"></i>Presencial</span><span><i style="background:var(--al);border-left:3px solid var(--a)"></i>Virtual</span><span><i style="background:repeating-linear-gradient(135deg,var(--pl) 0 3px,#fff 3px 5px)"></i>Pendiente de confirmar</span><span><i style="background:#F1EFE9"></i>Cancelado</span><span style="margin-left:auto">Tocá un horario libre para agendar</span></div>';}
function vistaDia(){
  var k=S.fecha,l=delDia(k),act=l.filter(function(t){return t.estado!=='cancelada';});
  var cobrar=l.filter(deuda).reduce(function(a,t){return a+t.monto;},0),cobrado=l.filter(function(t){return t.pagado===true;}).reduce(function(a,t){return a+t.monto;},0);
  var lista=l.length?l.map(function(t){return filaTurno(t);}).join(''):'<div class="empty">Día libre. <button class="link" data-nuevo style="font-size:15px;font-weight:600">Agendar un turno</button></div>';
  var atiende=CFG.dias.indexOf(D(k).getDay())>=0;
  return '<div class="dayl">'+grilla([k],true)+'<section class="card" style="padding:24px;gap:12px"><h2 style="font-size:22px">'+largo(k)+'</h2>'+(atiende?'':'<div class="note">Este día no figura en tu horario de atención.</div>')+
  '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px"><div class="rec"><div class="dt">Sesiones</div><div style="font-family:var(--serif);font-size:24px">'+act.length+'</div></div><div class="rec"><div class="dt">Cobrado</div><div style="font-family:var(--serif);font-size:19px">'+plata(cobrado)+'</div></div><div class="rec"><div class="dt">A cobrar</div><div style="font-family:var(--serif);font-size:19px;color:#7A5A2E">'+plata(cobrar)+'</div></div></div><div>'+lista+'</div></section></div>';
}
function vistaMes(){
  var d=D(S.fecha),p=new Date(d.getFullYear(),d.getMonth(),1),i0=lunes(K(p)),out='';
  ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].forEach(function(x){out+='<div class="mh">'+x+'</div>';});
  for(var i=0;i<42;i++){
    var k=add(i0,i),dd=D(k),fuera=dd.getMonth()!==d.getMonth();
    if(i===35&&fuera)break;
    var l=delDia(k),chips=l.slice(0,3).map(function(t){return '<button class="chip'+(t.mod==='v'?' v':'')+(t.estado==='cancelada'?' canc':'')+'" data-tid="'+t.id+'">'+t.hora+' '+esc(t.nombre.split(' ')[0])+'</button>';}).join('');
    var dots='<span class="dots">'+l.filter(function(t){return t.estado!=='cancelada';}).slice(0,4).map(function(t){return '<i class="'+(t.mod==='v'?'v':'')+'"></i>';}).join('')+'</span>';
    out+='<div class="mc'+(fuera?' fuera':'')+(k===HOY?' hoy':'')+'" data-cal="dia" data-f="'+k+'"><button class="mn" data-cal="dia" data-f="'+k+'" aria-label="'+largo(k)+'">'+dd.getDate()+'</button>'+chips+(l.length>3?'<span class="mas">+'+(l.length-3)+' más</span>':'')+dots+'</div>';
  }
  return '<div class="cal"><div class="mgrid">'+out+'</div></div>';
}
function calendario(){
  HH=window.innerWidth<860?40:48;
  var dn=diasAtencion().map(function(n){return DIAS[n];});
  if(S.vista!=='dia')S.vista='mes';
  var v=S.vista==='dia'?vistaDia():vistaMes();
  return '<header class="head cal-head"><h1>Calendario</h1></header>'+calTool()+v;
}
function mover(n){S.fecha=S.vista==='dia'?add(S.fecha,n):S.vista==='semana'?add(S.fecha,7*n):(function(){var d=D(S.fecha);return K(new Date(d.getFullYear(),d.getMonth()+n,1));})();render();}

/* ================= PACIENTES ================= */
function pacientes(){
  var c={activo:0,pausa:0,alta:0};PAC.forEach(function(p){c[p.estado]++;});
  var q=S.pq.trim().toLowerCase();
  var lista=PAC.filter(function(p){return (S.pf==='todos'||p.estado===S.pf)&&(!q||(p.nombre+' '+p.dni+' '+p.tel+' '+p.email).toLowerCase().indexOf(q)>=0);}).sort(function(a,b){return a.nombre<b.nombre?-1:1;});
  function tb(id,l,n){return '<button data-pf="'+id+'" aria-pressed="'+(S.pf===id)+'">'+l+'<span class="c">'+n+'</span></button>';}
  var filas=lista.map(function(p){
    var pr=proximo(p),sd=saldo(p);
    return '<tr class="clic" data-pac="'+p.id+'" tabindex="0"><td><div class="pcell"><span class="av sm '+color(p.nombre)+'">'+ini(p.nombre)+'</span><div><div class="nm">'+esc(p.nombre)+'</div><div class="dt">'+(pr?'Próxima: '+corto(pr.fecha)+' · '+pr.hora:'Sin turno agendado')+'</div></div></div></td>'+
    '<td class="hide-sm">'+esc(p.tel)+'</td><td class="num">'+(sd?'<span style="color:#7A5A2E;font-weight:600">'+plata(sd)+'</span>':'')+'</td><td class="hide-sm" style="width:1%"><span class="tag t-'+p.estado+'">'+({activo:'activo',pausa:'en pausa',alta:'alta'})[p.estado]+'</span></td></tr>';
  }).join('');
  if(!lista.length)filas='<tr><td colspan="4" class="muted" style="padding:28px 18px">No hay pacientes que coincidan.</td></tr>';
  return '<header class="head"><h1>Pacientes</h1><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn-ghost" data-excel="pacientes">'+ico('i-download',16,1.8)+'Descargar Excel</button><button class="btn-primary" data-npac>'+ico('i-user-plus',18,1.8)+'Nuevo paciente</button></div></header>'+
  '<div class="toolbar"><div class="tabs" role="group" aria-label="Filtrar por estado">'+tb('activo','Activos',c.activo)+tb('pausa','En pausa',c.pausa)+tb('alta','Alta',c.alta)+tb('todos','Todos',PAC.length)+'</div><label class="search">'+ico('i-search',17,1.8)+'<span class="sr">Buscar paciente</span><input id="pq" type="search" placeholder="Nombre, DNI o teléfono" value="'+esc(S.pq)+'"></label></div>'+
  '<div class="tbox"><div class="tscroll"><table class="t compact"><thead><tr><th>Paciente</th><th class="hide-sm">Teléfono</th><th class="num">Saldo</th><th class="hide-sm">Estado</th></tr></thead><tbody id="ptb">'+filas+'</tbody></table></div></div>';
}
var DIAS_ORDEN=[1,2,3,4,5,6,0];
function diasTxt(arr){if(!arr||!arr.length)return '';var o=DIAS_ORDEN.filter(function(n){return arr.indexOf(n)>=0;});if(o.length>=3){var i0=DIAS_ORDEN.indexOf(o[0]),ok=o.every(function(n,k){return DIAS_ORDEN.indexOf(n)===i0+k;});if(ok)return DIAS_C[o[0]]+' a '+DIAS_C[o[o.length-1]].toLowerCase();}return o.map(function(n,k){return k?DIAS_C[n].toLowerCase():DIAS_C[n];}).join(', ');}
function dispTxt(p){var d=diasTxt(p.dispDias);if(!d&&!p.dispDesde)return '';return (d||'Cualquier día')+(p.dispDesde?' · '+p.dispDesde+' a '+(p.dispHasta||'')+' h':'');}
function fueraDisp(p,fecha,hora){if(!p)return '';var w=D(fecha).getDay();if(p.dispDias&&p.dispDias.length&&p.dispDias.indexOf(w)<0)return 'Ese día no figura en los días que puede asistir ('+diasTxt(p.dispDias)+').';if(p.dispDesde&&p.dispHasta&&(hora<p.dispDesde||hora>=p.dispHasta))return 'Ese horario está fuera de su disponibilidad ('+p.dispDesde+' a '+p.dispHasta+' h).';return '';}
function daypickHtml(name,sel){var dl=['D','L','M','M','J','V','S'];return '<div class="daypick sm">'+DIAS_ORDEN.map(function(n){return '<label title="'+DIAS[n]+'"><input type="checkbox" name="'+name+'" value="'+n+'"'+(sel&&sel.indexOf(n)>=0?' checked':'')+'><span aria-hidden="true">'+dl[n]+'</span><span class="sr">'+DIAS[n]+'</span></label>';}).join('')+'</div>';}
function datosHtml(p){
  function dato(l,v){return '<div><span>'+l+'</span>'+(v?esc(v):'<span>—</span>')+'</div>';}
  return '<div class="dgrid">'+dato('DNI',p.dni)+dato('Fecha de nacimiento',p.nac?D(p.nac).getDate()+' de '+MESES[D(p.nac).getMonth()]+' de '+D(p.nac).getFullYear():'')+dato('Teléfono',p.tel)+dato('Email',p.email)+dato('Cobertura',p.obra)+dato('Coseguro',p.coseguro?plata(p.coseguro):'')+dato('Honorario por sesión',plata(p.honor))+dato('Modalidad preferida',p.mod==='v'?'Virtual':'Presencial')+'</div>'+
  '<div class="fsec" style="margin:14px 0 2px">Trabajo y disponibilidad</div><div class="dgrid">'+dato('Dónde trabaja',p.trabajo)+dato('Horario de trabajo',p.horTrabajo)+dato('Días que puede asistir',diasTxt(p.dispDias))+dato('Horario en que puede asistir',p.dispDesde?p.dispDesde+' a '+(p.dispHasta||'')+' h':'')+'</div><div class="dgrid" style="grid-template-columns:minmax(0,1fr)">'+dato('Contacto de emergencia',p.contacto)+dato('Motivo de consulta',p.motivo)+'</div>';
}
function abrirDatos(p){
  $('#tDet').textContent=p.nombre;
  $('#detBody').innerHTML=datosHtml(p);
  $('#detAct').innerHTML='<button class="btn-ghost" data-epac="'+p.id+'">'+ico('i-edit',16,1.8)+'Editar</button><button class="btn-primary" data-close>Cerrar</button>';
  openOv('#ovDet');
}
function ficha(id){
  var p=pac(id);if(!p)return pacientes();
  var ts=turnosDe(p),fut=ts.filter(futuro),pas=ts.filter(function(t){return !futuro(t);}).reverse();
  var ses=ts.filter(function(t){return t.estado==='realizada';}).length,sd=saldo(p),pr=proximo(p),e=edad(p.nac);
  var hist=(S.verTodo?pas:pas.slice(0,5)).map(function(t){return filaTurno(t,true);}).join('')||'<div class="empty">Todavía no hay sesiones.</div>';
  var futs=fut.slice(0,4).map(function(t){return filaTurno(t,true);}).join('')||'<div class="empty">Sin turnos agendados. <button class="link" data-nuevo data-paciente="'+esc(p.nombre)+'" style="font-size:15px;font-weight:600">Agendar</button></div>';
  var notas=p.notas.slice().sort(function(a,b){return a.f<b.f?1:-1;}).map(function(n){return '<div class="nota"><div class="f">'+largo(n.f)+'</div>'+esc(n.t)+'</div>';}).join('')||'<div class="note">Todavía no hay notas.</div>';
  var pagos=ts.filter(function(t){return t.pagado===true;}).slice(-4).reverse().map(function(t){return '<div class="pay"><div><div class="nm">'+corto(t.fpago||t.fecha)+'</div><div class="dt">'+esc(t.medio||'')+'</div></div><span class="m">'+plata(t.monto)+'</span></div>';}).join('')||'<div class="note">Sin pagos registrados.</div>';
  function dato(l,v){return '<div><span>'+l+'</span>'+(v?esc(v):'<span>—</span>')+'</div>';}
  return '<div><button class="link" data-go="pacientes">'+ico('i-back',16,1.8)+'Pacientes</button></div>'+
  '<section class="card"><div class="ficha-h"><span class="av lg '+color(p.nombre)+'">'+ini(p.nombre)+'</span><div class="info"><h1 style="font-size:34px">'+esc(p.nombre)+'</h1><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><span class="tag t-'+p.estado+'">'+({activo:'activo',pausa:'en pausa',alta:'alta'})[p.estado]+'</span><span class="muted" style="font-size:14.5px">'+(e!=null?e+' años · ':'')+esc(p.obra)+(p.coseguro?' · coseguro '+plata(p.coseguro):'')+' · En tratamiento desde '+MESES[D(p.alta).getMonth()]+' '+D(p.alta).getFullYear()+'</span></div>'+(dispTxt(p)?'<div class="disp">'+ico('i-clock',15,1.8)+'Puede asistir: '+esc(dispTxt(p))+'</div>':'')+'</div>'+
  '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn-ghost" data-datos="'+p.id+'">'+ico('i-user-plus',16,1.8)+'Datos del paciente</button>'+(p.tel?'<a class="btn-ghost" href="https://wa.me/'+telWa(p.tel)+'" target="_blank" rel="noopener">'+ico('i-chat',16,1.8)+'WhatsApp</a>':'<button class="btn-ghost" disabled title="Cargá su teléfono">'+ico('i-chat',16,1.8)+'WhatsApp</button>')+'<button class="btn-ghost" data-epac="'+p.id+'">'+ico('i-edit',16,1.8)+'Editar</button><button class="btn-primary" data-nuevo data-paciente="'+esc(p.nombre)+'">'+ico('i-plus',17,2)+'Nuevo turno</button></div></div></section>'+
  '<section class="kpis k3"><div class="kpi"><div class="n">'+ses+'</div><div class="l">Sesiones realizadas</div></div><div class="kpi"><div class="n" style="font-size:26px">'+(pr?corto(pr.fecha)+', '+pr.hora:'—')+'</div><div class="l">Próxima sesión</div></div><div class="kpi"><div class="n" style="'+(sd?'color:#7A5A2E':'')+'">'+plata(sd)+'</div><div class="l">Saldo a cobrar</div>'+(sd?'<button class="link" data-go="pagos" style="font-size:14px">Registrar pago</button>':'')+'</div></section>'+
  '<div class="cols"><div style="display:flex;flex-direction:column;gap:24px">'+
  '<section class="card"><h2>Próximos turnos</h2><div>'+futs+'</div></section>'+
  '<section class="card"><div class="card-h"><h2>Historial</h2>'+(pas.length>5?'<button class="link" data-vertodo style="font-size:14px">'+(S.verTodo?'Ver menos':'Ver las '+pas.length)+'</button>':'')+'</div><div>'+hist+'</div></section>'+
  '</div>'+
  '<div style="display:flex;flex-direction:column;gap:24px"><section class="card" style="padding:24px;gap:14px"><div class="card-h"><h2 style="font-size:22px">Notas de sesión</h2><span class="privado">'+ico('i-lock',14,1.8)+'Solo vos</span></div>'+
  '<form id="fNota" data-p="'+p.id+'" style="display:flex;flex-direction:column;gap:8px"><label class="sr" for="nTxt">Nueva nota</label><textarea id="nTxt" rows="3" placeholder="Escribí una nota de la sesión…" style="font:inherit;font-size:14.5px;border:1px solid var(--line2);border-radius:12px;padding:12px;outline:none;resize:vertical"></textarea><div style="display:flex;justify-content:flex-end"><button class="btn-ghost" type="submit">'+ico('i-note',16,1.8)+'Guardar nota</button></div></form><div class="notas">'+notas+'</div></section></div></div>';
}

/* ================= PAGOS ================= */
function pagos(){
  var ym=S.pmes,d=D(ym),ini0=ym+'-01',finD=new Date(d.getFullYear(),d.getMonth()+1,0),fin=K(finD);
  var mes=TURNOS.filter(function(t){return t.fecha>=ini0&&t.fecha<=fin&&t.estado!=='cancelada'&&t.fecha<=HOY&&t.monto>0;});
  var cob=cobradoMes(ym),pend=porCobrar(),pendT=pend.reduce(function(a,t){return a+t.monto;},0);
  var real=mes.length,prom=real?Math.round(mes.reduce(function(a,t){return a+t.monto;},0)/real):0;
  // barras por semana
  var bars='',w=lunes(ini0),mx=1,data=[];
  while(w<=fin){var we=add(w,6),c=0,e=0;TURNOS.forEach(function(t){if(t.estado==='cancelada')return;if(t.pagado===true&&t.fpago>=w&&t.fpago<=we&&t.fpago.slice(0,7)===ym)c+=t.monto;else if(t.fecha>HOY&&t.fecha>=w&&t.fecha<=we&&t.fecha.slice(0,7)===ym)e+=t.monto;});data.push({w:w,c:c,e:e});mx=Math.max(mx,c,e);w=add(w,7);}
  data.forEach(function(x){var v=x.c||x.e,fut=!x.c&&x.e;var a=D(x.w<ini0?ini0:x.w);bars+='<div class="bar"><span class="v">'+(v?plata(v).replace('$ ','$'):'')+'</span><div class="b'+(fut?' fut':'')+'" style="height:'+Math.round(v/mx*120)+'px"></div><span class="k">'+a.getDate()+' '+MESES_C[a.getMonth()]+'</span></div>';});
  var q=S.pagq.trim().toLowerCase();
  var lista=mes.filter(function(t){return (S.pagf==='todos'||(S.pagf==='cobrados'?t.pagado===true:t.pagado===false))&&(!q||t.nombre.toLowerCase().indexOf(q)>=0);}).sort(function(a,b){return (a.fecha+a.hora)<(b.fecha+b.hora)?1:-1;});
  var filas=lista.map(function(t){var p=pacPorNombre(t.nombre);return '<tr><td>'+corto(t.fecha)+' · '+t.hora+'</td><td><button class="link" data-pac="'+(p?p.id:'')+'" style="color:var(--ink);font-weight:500;text-align:left">'+esc(t.nombre)+'</button></td><td class="hide-sm">'+(t.mod==='v'?'Virtual':'Presencial')+'</td><td class="hide-sm">'+(t.medio?esc(t.medio):'<span class="muted">—</span>')+'</td><td class="num">'+plata(t.monto)+'</td><td>'+(t.pagado===true?'<span class="tag t-cobrado">cobrado</span>':'<button class="mini" style="margin:0" data-pagar="'+t.id+'">Cobrar</button>')+'</td></tr>';}).join('');
  if(!lista.length)filas='<tr><td colspan="6" class="muted" style="padding:28px 18px">No hay movimientos con ese filtro.</td></tr>';
  function tb(id,l){return '<button data-pagf="'+id+'" aria-pressed="'+(S.pagf===id)+'">'+l+'</button>';}
  return '<header class="head"><div><h1>Pagos</h1></div><button class="btn-ghost" data-excel="pagos">'+ico('i-download',16,1.8)+'Descargar Excel</button></header>'+
  '<div class="ctool"><div class="cnav"><button class="icb" data-pmes="-1" aria-label="Mes anterior">'+ico('i-left',18,2)+'</button><button class="icb" data-pmes="1" aria-label="Mes siguiente">'+ico('i-right',18,2)+'</button><span class="rango">'+cap(MESES[d.getMonth()])+' '+d.getFullYear()+'</span></div></div>'+


  '<div class="toolbar"><div class="tabs" role="group" aria-label="Filtrar">'+tb('todos','Todos')+tb('cobrados','Cobrados')+tb('pendientes','A cobrar')+'</div><label class="search">'+ico('i-search',17,1.8)+'<span class="sr">Buscar paciente</span><input id="pagq" type="search" placeholder="Buscar paciente" value="'+esc(S.pagq)+'"></label></div>'+
  '<div class="tbox"><div class="tscroll"><table class="t compact"><thead><tr><th>Sesión</th><th>Paciente</th><th class="hide-sm">Modalidad</th><th class="hide-sm">Medio</th><th class="num">Monto</th><th>Estado</th></tr></thead><tbody>'+filas+'</tbody></table></div></div>';
}

/* ================= RECORDATORIOS ================= */
function recordatoriosV(){
  var R=recordatorios(),prog=R.filter(function(r){return r.estado==='programado'||r.estado==='pausado';}),env=R.filter(function(r){return r.estado==='enviado';}).reverse();
  var lista=S.recf==='proximos'?prog:env;
  var filas=lista.map(function(r){
    var acc=r.estado==='programado'?'<button class="mini" data-rec="enviar" data-id="'+r.id+'">'+ico('i-send',14,1.8)+' Enviar ahora</button><button class="mini" data-rec="pausar" data-id="'+r.id+'">Pausar</button>':r.estado==='pausado'?'<button class="mini" data-rec="activar" data-id="'+r.id+'">Reactivar</button>':'';
    return '<div class="rec" style="flex-direction:row;align-items:center;gap:14px;flex-wrap:wrap"><span class="av '+color(r.t.nombre)+'">'+ini(r.t.nombre)+'</span><div style="flex:1;min-width:200px;display:flex;flex-direction:column;gap:3px"><div class="top" style="justify-content:flex-start;gap:10px">'+esc(r.t.nombre)+'<span class="tag t-'+r.estado+'">'+r.estado+'</span></div><div class="dt">'+(r.tipo==='semana'?'Una semana antes':'El día anterior · '+REC_TIPO[r.tipo].toLowerCase())+' · sesión '+corto(r.t.fecha).toLowerCase()+' '+r.t.hora+'</div><div class="dt">'+ico('i-clock',13,1.8)+' '+(r.estado==='enviado'?'Enviado ':'Envío ')+envioTxt(r.envio).toLowerCase()+'</div></div><div style="display:flex;gap:6px">'+acc+'</div><details style="width:100%"><summary class="link" style="font-size:13.5px;cursor:pointer">Ver mensaje</summary><div class="burbuja" style="margin-top:10px">'+esc(textoRec(r.tipo,r.t))+'</div></details></div>';
  }).join('')||'<div class="note" style="padding:12px 0">No hay recordatorios '+(S.recf==='proximos'?'programados':'enviados')+'.</div>';
  var ej=ejemploTurno();
  function plant(k){return '<details class="plant"><summary class="card-h"><h3>'+REC_TIPO[k]+'</h3><span class="note">'+({turno:'Al agendar, con el botón WhatsApp del turno',semana:'7 días antes',sesion:'Día anterior · confirmados',confirmar:'Día anterior · sin confirmar',enlace:'Día anterior · virtuales'})[k]+'</span></summary><div class="ed" contenteditable="true" role="textbox" aria-multiline="true" data-plant="'+k+'" aria-label="Mensaje '+REC_TIPO[k]+'">'+plantHtml(PLANT[k])+'</div><div class="vars"><span class="note">Agregar:</span>'+Object.keys(VARS).map(function(v){return '<button type="button" data-var="'+v+'" data-k="'+k+'">+ '+VARS[v]+'</button>';}).join('')+'</div><div class="note">Vista previa:</div><div class="burbuja" data-prev="'+k+'">'+esc(textoRec(k,ej))+'</div></details>';}
  function tb(id,l,n){return '<button data-recf="'+id+'" aria-pressed="'+(S.recf===id)+'">'+l+'<span class="c">'+n+'</span></button>';}
  return '<header class="head"><div><h1>Recordatorios</h1><div class="sub">Cada turno se recuerda solo: una semana antes y el día anterior.</div></div></header>'+
  '<div class="recstack"><section class="card" style="gap:14px"><div class="toolbar"><div class="tabs" role="group">'+tb('proximos','Programados',prog.length)+tb('enviados','Enviados',env.length)+'</div></div>'+filas+'<div class="note">Los avisos no salen solos: cuando llega el día, tocá <b>Enviar ahora</b> y se abre WhatsApp con el mensaje listo para mandar.</div></section>'+
  '<section class="card" style="padding:24px;gap:0"><h2 style="font-size:22px;margin-bottom:8px">Ajustes</h2><div class="recaj">'+
  '<label class="sw"><span class="txt">Recordatorios automáticos<span>Se programan solos al agendar un turno</span></span><input type="checkbox" data-cfgset="autoRec"'+(CFG.autoRec?' checked':'')+'></label>'+
  '<label class="sw"><span class="txt">Una semana antes<span>Aviso 7 días antes de cada turno</span></span><input type="checkbox" data-cfgset="avisoSemana"'+(CFG.avisoSemana?' checked':'')+'></label>'+
  '<label class="sw"><span class="txt">El día anterior<span>Recordatorio, confirmación o enlace, según el turno</span></span><input type="checkbox" data-cfgset="avisoDia"'+(CFG.avisoDia?' checked':'')+'></label>'+
  '<div class="sw" style="cursor:default"><span class="txt">Hora de envío<span>A qué hora quedan listos para enviar</span></span><select data-cfgset="horaRec" style="font:inherit;border:1px solid var(--line2);border-radius:12px;padding:9px 10px;background:#fff">'+['08:00','09:00','10:00','11:00','12:00','16:00','18:00','20:00'].map(function(h){return '<option'+(CFG.horaRec===h?' selected':'')+'>'+h+'</option>';}).join('')+'</select></div></div></section>'+
  '<section class="card" style="padding:24px;gap:0"><h2 style="font-size:22px;margin-bottom:4px">Mensajes</h2><div class="note" style="margin-bottom:6px">Tocá un mensaje para editarlo. Tocá una variable para sumarla al texto.</div>'+plant('turno')+plant('semana')+plant('sesion')+plant('confirmar')+plant('enlace')+'</section></div>';
}

/* ================= CONFIGURACIÓN ================= */
function campo(l,k,tipo,extra){return '<label class="f'+(extra&&extra.full?' full':'')+'">'+l+'<input data-cfgset="'+k+'" type="'+(tipo||'text')+'" value="'+esc(CFG[k])+'"'+(extra&&extra.ph?' placeholder="'+extra.ph+'"':'')+'>'+(extra&&extra.hint?'<span class="hint">'+extra.hint+'</span>':'')+'</label>';}
function configuracion(){
  var tabs=[['consultorio','Consultorio','i-user-plus'],['horarios','Horarios','i-clock'],['sesiones','Sesiones y honorarios','i-wallet'],['apariencia','Apariencia','i-palette'],['excel','Planilla y copias','i-download'],['seguridad','Seguridad','i-lock']];
  var nav='<nav class="cfg-nav" aria-label="Secciones">'+tabs.map(function(t){return '<button class="nav-a" data-cfg="'+t[0]+'"'+(S.cfgTab===t[0]?' aria-current="page"':'')+'>'+ico(t[2],18)+t[1]+'</button>';}).join('')+'</nav>';
  var body='';
  if(S.cfgTab==='consultorio'){
    body='<section class="card"><h2>Datos del consultorio</h2><div class="fgrid">'+campo('Nombre profesional','prof','text',{full:true,hint:'Se usa en el saludo, en los mensajes y en el monograma del logo.'})+campo('Título','titulo')+campo('Matrícula','matricula')+campo('Teléfono','tel','tel')+campo('Email','email','email')+campo('Dirección del consultorio','dir','text',{full:true})+campo('Enlace de videollamada','enlace','text',{full:true,hint:'Se envía a los pacientes de sesiones virtuales.'})+'</div></section>'+
    '<section class="card"><div class="card-h"><div><h2>Dónde trabajás y en qué horarios</h2><div class="note" style="margin-top:4px">Tu consultorio y otros lugares de trabajo (hospital, institución, otro consultorio).</div></div><button class="btn-ghost" data-lugar="nuevo">'+ico('i-plus',16,2)+'Agregar lugar</button></div>'+
    (CFG.lugares.length?CFG.lugares.map(function(l,i){return '<div class="lugar"><div class="lugar-h"><label class="f" style="flex:1">Lugar<input data-lg="'+i+'" data-k="nombre" value="'+esc(l.nombre)+'" placeholder="Ej.: Hospital San Bernardo"></label><button class="x" data-lugar="borrar" data-i="'+i+'" aria-label="Quitar lugar" title="Quitar">'+ico('i-x',16,2)+'</button></div><div class="f">Días'+daypickHtml('lg'+i,l.dias).replace(/name="lg\d+"/g,'data-lgdia="'+i+'"')+'</div><div class="fgrid"><label class="f">Desde<input type="time" data-lg="'+i+'" data-k="desde" value="'+esc(l.desde)+'"></label><label class="f">Hasta<input type="time" data-lg="'+i+'" data-k="hasta" value="'+esc(l.hasta)+'"></label></div>'+(l.consultorio?'<div class="note">Es tu consultorio: el calendario usa los días y horas de la pestaña Horarios.</div>':'')+'</div>';}).join(''):'<div class="note">Todavía no cargaste lugares de trabajo.</div>')+'</section>';
  }else if(S.cfgTab==='horarios'){
    var dl=['D','L','M','M','J','V','S'],orden=[1,2,3,4,5,6,0];
    var hs='';for(var h=6;h<=23;h++)hs+='<option value="'+h+'">'+('0'+h).slice(-2)+':00</option>';
    body='<section class="card"><h2>Horario de atención</h2><div class="f">Días de atención<div class="daypick">'+orden.map(function(n){return '<label title="'+DIAS[n]+'"><input type="checkbox" data-dia-at="'+n+'"'+(CFG.dias.indexOf(n)>=0?' checked':'')+'><span aria-hidden="true">'+dl[n]+'</span><span class="sr">'+DIAS[n]+'</span></label>';}).join('')+'</div></div>'+
    '<div class="fgrid"><label class="f">Desde<select data-cfgset="desde">'+hs.replace('value="'+CFG.desde+'"','value="'+CFG.desde+'" selected')+'</select></label><label class="f">Hasta<select data-cfgset="hasta">'+hs.replace('value="'+CFG.hasta+'"','value="'+CFG.hasta+'" selected')+'</select></label>'+
    '<label class="f">Descanso entre sesiones<select data-cfgset="descanso">'+['Sin descanso','5 min','10 min','15 min'].map(function(o){return '<option'+(CFG.descanso===o?' selected':'')+'>'+o+'</option>';}).join('')+'</select></label></div><div class="note">El calendario muestra solo estos días y horas.</div></section>';
  }else if(S.cfgTab==='excel'){
    var X=CFG.copiaDrive,xt=X.tema||CFG.tema;
    function xh(k,l){return '<label class="chk"><input type="checkbox" data-eah="'+k+'"'+(X.hojas[k]?' checked':'')+'>'+l+'</label>';}
    body='<section class="card"><div><h2>Tu planilla en Google Drive</h2><div class="note" style="margin-top:4px">Todo lo que cargás se guarda en una planilla de tu Drive, con una hoja por mes y los colores que elegiste en Apariencia. Cargá y corregí los datos desde la app: si los cambiás a mano en la planilla, la app los vuelve a escribir.</div></div>'+
    '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">'+(SSID?'<a class="btn-ghost" href="https://docs.google.com/spreadsheets/d/'+SSID+'" target="_blank" rel="noopener">'+ico('i-arrow',16,1.8)+'Abrir mi planilla</a>':'<span class="note">Conectando con tu Drive…</span>')+'<span class="note">'+esc(USER?USER.email:'')+'</span></div></section>'+
    '<section class="card"><div><h2>Copias automáticas en Excel</h2><div class="note" style="margin-top:4px">Se guarda un archivo de Excel con colores en tu Drive, en la carpeta “'+esc(CFG.marca||'Agenda Psicológica')+' – Excel”. Se genera la primera vez que abrís la app después de cada semana o de cada mes.</div></div>'+
    '<label class="sw"><span class="txt">Guardar copias automáticamente<span>'+(X.activo?'Activado'+(X.ultima&&X.ultima!=='manual'?' · última: '+esc(X.ultima):''):'Desactivado')+'</span></span><input type="checkbox" data-ea="activo"'+(X.activo?' checked':'')+'></label>'+
    '<label class="f">Frecuencia<select data-ea="frec"><option value="semanal"'+(X.frec==='semanal'?' selected':'')+'>Cada semana (la semana anterior)</option><option value="mensual"'+(X.frec==='mensual'?' selected':'')+'>Cada mes (el mes anterior)</option></select></label>'+
    '<div class="f">Qué incluir<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:4px">'+xh('pac','Pacientes')+xh('tur','Turnos')+xh('pag','Pagos')+xh('res','Resumen por mes')+'</div></div>'+
    '<div class="f">Colores del Excel<div class="paletas xl" style="margin-top:6px">'+Object.keys(PALETAS).map(function(k){var t=PALETAS[k];return '<button type="button" class="paleta" data-xatema="'+k+'" aria-pressed="'+(xt===k)+'"><span class="sw4"><i style="background:'+t.p+'"></i><i style="background:'+t.pl+'"></i><i style="background:'+t.a+'"></i></span><b>'+t.n+'</b></button>';}).join('')+'</div></div>'+
    '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><button type="button" class="btn-ghost" data-copiaya>'+ico('i-download',16,1.8)+'Guardar una copia ahora</button><span class="note">Del mes en curso.</span></div></section>';
  }else if(S.cfgTab==='seguridad'){
    var pd=pinDatos();
    body='<section class="card"><div><h2>PIN de bloqueo</h2><div class="note" style="margin-top:4px">Pide un PIN de 4 números para abrir la agenda, así nadie que agarre tu celular o tu computadora puede ver a tus pacientes. El PIN es de este dispositivo: en cada celular o computadora lo creás por separado. Si te lo olvidás, entrás con tu cuenta de Google y lo creás de nuevo.</div></div>'+
    (pd?'<label class="sw" style="pointer-events:none"><span class="txt">PIN activado<span>En este dispositivo</span></span>'+ico('i-check',20,2.2)+'</label>'+
      '<label class="f">Bloquear la agenda<select data-pinmin>'+[[0,'Apenas salgo de la app'],[1,'Después de 1 minuto sin usarla'],[5,'Después de 5 minutos sin usarla'],[15,'Después de 15 minutos sin usarla']].map(function(o){return '<option value="'+o[0]+'"'+(pd.min===o[0]?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select></label>'+
      '<div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" class="btn-ghost" data-pinact="bloquear">'+ico('i-lock',16,1.8)+'Bloquear ahora</button><button type="button" class="btn-ghost" data-pinact="cambiar">Cambiar PIN</button><button type="button" class="btn-ghost" data-pinact="quitar">Quitar PIN</button></div>'
     :'<div><button type="button" class="btn-primary" data-pinact="crear">'+ico('i-lock',18,1.8)+'Crear PIN</button></div>')+'</section>'+
    '<section class="card"><h2>Más cuidados</h2><ul class="tips">'+
      '<li><b>Activá la verificación en dos pasos de tu Gmail.</b> Es la llave de tu planilla. Se activa en <a href="https://myaccount.google.com/security" target="_blank" rel="noopener">myaccount.google.com/security</a>.</li>'+
      '<li><b>Poné bloqueo de pantalla en el celular.</b></li>'+
      '<li><b>En una computadora compartida, tocá Salir al terminar.</b> Se borra la copia guardada en ese equipo.</li>'+
      '<li><b>No compartas tu planilla de Drive.</b> Quien la reciba ve todos los datos.</li>'+
      '<li><b>No pongas datos clínicos en los mensajes de WhatsApp.</b></li></ul></section>';
  }else if(S.cfgTab==='sesiones'){
    body='<section class="card"><h2>Sesiones y honorarios</h2><div class="fgrid"><label class="f">Duración predeterminada<select data-cfgset="dur">'+['30 min','45 min','50 min','60 min','90 min'].map(function(o){return '<option'+(CFG.dur===o?' selected':'')+'>'+o+'</option>';}).join('')+'</select></label><label class="f">Honorario predeterminado<input data-cfgset="honor" inputmode="numeric" value="'+CFG.honor.toLocaleString('es-AR')+'"></label></div>'+
    '<div><label class="sw"><span class="txt">Sesiones presenciales<span>'+esc(CFG.dir)+'</span></span><input type="checkbox" data-cfgset="presencial"'+(CFG.presencial?' checked':'')+'></label><label class="sw"><span class="txt">Sesiones virtuales<span>Con el enlace de videollamada del consultorio</span></span><input type="checkbox" data-cfgset="virtual"'+(CFG.virtual?' checked':'')+'></label></div>'+
    '<label class="f full">Política de cancelación<textarea data-cfgset="politica" rows="3">'+esc(CFG.politica)+'</textarea></label></section>';
  }else{
    var pal=Object.keys(PALETAS).map(function(k){var t=PALETAS[k];return '<button class="paleta" data-tema="'+k+'" aria-pressed="'+(CFG.tema===k)+'"><span class="sw4"><i style="background:'+t.p+'"></i><i style="background:'+t.pl+'"></i><i style="background:'+t.a+'"></i><i style="background:'+t.bg+'"></i></span><b>'+t.n+(CFG.tema===k?ico('i-check',16,2.2):'')+'</b><span class="note" style="margin-top:-6px">'+t.d+'</span></button>';}).join('');
    var lg=GRUPOS_LOGO.map(function(g){return '<div class="fsec" style="margin:6px 0 0">'+g[1]+(g[0]==='ini'?' · '+esc(letra()):'')+'</div><div class="logos">'+LOGOS.filter(function(l){return l[2]===g[0];}).map(function(l){return '<button class="logoop" data-logo="'+l[0]+'" aria-pressed="'+(CFG.logo===l[0])+'">'+logoHtml(l[0])+l[1]+'</button>';}).join('')+
      (g[0]==='otros'?'<button class="logoop" data-logo="imagen" aria-pressed="'+(CFG.logo==='imagen')+'"'+(CFG.logoImg?'':' disabled style="opacity:.5"')+'>'+(CFG.logoImg?logoHtml('imagen'):'<span class="logo claro">'+ico('i-upload',20,1.7)+'</span>')+'Tu imagen</button>':'')+'</div>';}).join('');
    var il=ILUS.map(function(i){return '<button class="ilusop" data-ilus="'+i[0]+'" aria-pressed="'+(CFG.ilus===i[0])+'">'+(i[2]?'<img src="'+i[2]+'" alt="">':'<span class="sinilus">Sin ilustración</span>')+'<b>'+i[1]+'</b></button>';}).join('');
    body='<section class="card"><h2>Vista previa</h2><div class="preview"><div class="brand">'+logoHtml()+'<span>'+marcaHtml()+'</span></div><button class="btn-primary" tabindex="-1">'+ico('i-plus',17,2)+'Nuevo turno</button><span class="tag t-confirmado">confirmado</span><span class="tag t-programado">programado</span></div></section>'+
    '<section class="card"><div><h2>Colores</h2><div class="note" style="margin-top:4px">Se aplica a toda la app al instante.</div></div><div class="paletas">'+pal+'</div></section>'+
    '<section class="card"><div><h2>Logo</h2><div class="note" style="margin-top:4px">Las opciones de letra usan la inicial del nombre profesional. Podés escribir otra letra o tus iniciales.</div></div>'+
    '<div class="fgrid"><label class="f">Nombre que se muestra<input data-cfgset="marca" value="'+esc(CFG.marca)+'" placeholder="Agenda Psicológica"><span class="hint">La segunda palabra va en cursiva y color.</span></label><label class="f">Letra del monograma<input data-cfgset="letra" maxlength="2" value="'+esc(CFG.letra)+'" placeholder="'+esc(letra())+' (automática)"><span class="hint">Ej.: V para Virginia, o VM.</span></label></div>'+
    lg+'<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><span class="btn-ghost filebtn">'+ico('i-upload',16,1.8)+'Subir mi logo<input type="file" accept="image/*" id="logoFile" aria-label="Subir mi logo"></span>'+(CFG.logoImg?'<button class="link" data-quitarlogo style="font-size:14px">Quitar imagen</button>':'')+'<span class="note">PNG o JPG cuadrado, se recorta en círculo.</span></div></section>';
  }
  return '<header class="head"><div><h1>Configuración</h1><div class="sub">Los cambios se aplican al instante.</div></div></header><div class="cfg">'+nav+'<div style="display:flex;flex-direction:column;gap:24px;min-width:0">'+body+'</div></div>';
}

/* ================= INGRESO / REGISTRO ================= */
function authV(modo){
  var preview=delDia(HOY).slice(0,3).map(function(t){return filaTurno(t);}).join('');
  var ilu=null; // sin ilustración en el inicio de sesión
  if(ilu&&ilu[2]){
    var panelI='<div class="auth-p ilus"><div class="ilus-img"><img src="'+ilu[2]+'" alt="Ilustración de bienvenida"></div><div style="display:flex;flex-direction:column;gap:20px"><h2>Tu consultorio, en calma.</h2><ul><li><span class="ck">'+ico('i-check',16,2)+'</span>Agenda de turnos presenciales y virtuales</li><li><span class="ck">'+ico('i-check',16,2)+'</span>Fichas de pacientes con notas privadas</li><li><span class="ck">'+ico('i-check',16,2)+'</span>Pagos y recordatorios en un solo lugar</li></ul></div></div>';
  }
  var panel=panelI||'<div class="auth-p"><span class="circ" style="width:420px;height:420px;right:-140px;top:-120px"></span><span class="circ" style="width:260px;height:260px;left:-80px;bottom:-60px"></span><div class="brand" style="color:#fff;position:relative">'+logoHtml(null,'claro')+'<span>'+marcaHtml().replace('<i>','<i style="color:#fff;opacity:.85">')+'</span></div><div style="position:relative;display:flex;flex-direction:column;gap:28px"><h2>Tu consultorio, en calma.</h2><ul><li><span class="ck">'+ico('i-check',16,2)+'</span>Agenda de turnos presenciales y virtuales</li><li><span class="ck">'+ico('i-check',16,2)+'</span>Fichas de pacientes con notas privadas</li><li><span class="ck">'+ico('i-check',16,2)+'</span>Pagos y recordatorios en un solo lugar</li></ul></div></div>';
  var nuevo=!USER;
  var f='<div style="display:flex;flex-direction:column;gap:18px;max-width:420px;width:100%"><div><h1 style="font-size:36px">'+(nuevo?'Bienvenida':'Hola'+(nombreCorto()?', '+esc(nombreCorto()):''))+'</h1><div class="sub">'+(nuevo?'Entrá con tu cuenta de Google. La primera vez se crea tu agenda y una planilla en tu propio Google Drive, con tus datos y tus colores.':'Entrá con tu cuenta de Google.')+'</div></div>'+
    '<button type="button" class="gbtn" data-glogin><svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>Continuar con Google</button>'+
    '<div class="note" id="gErr" role="alert" style="color:var(--red-d);min-height:18px"></div>'+
    '<div class="note">Tus datos quedan en tu cuenta de Google: nadie más puede verlos.</div>'+
    (GCLIENT?'':'<div class="note" style="color:var(--red-d)">Falta configurar el ID de Google en config.js.</div>')+'</div>';
  return '<div class="auth-f">'+(ilu&&ilu[2]?'<img class="ilus-top" src="'+ilu[2]+'" alt="">':'')+'<div class="brand">'+logoHtml()+'<span>'+marcaHtml()+'</span></div>'+f+'</div>'+panel;
}

/* ================= OTRAS ================= */
function mas(){return '<header class="head"><h1>Más</h1></header><div class="card" style="gap:4px">'+[['recordatorios','Recordatorios','i-bell'],['configuracion','Configuración','i-set']].map(function(n){return '<button class="nav-a" data-go="'+n[0]+'">'+ico(n[2])+n[1]+'</button>';}).join('')+'<button class="nav-a" data-actualizar>'+ico('i-refresh')+'Actualizar app</button><button class="nav-a" data-salir>'+ico('i-logout')+'Cerrar sesión</button></div>';}

/* ================= SUSCRIPCIÓN (portero) =================
   Si config.js tiene AP_PORTERO_URL, la app le pregunta al portero si esta cuenta puede cargar datos.
   Al portero solo se le manda una credencial de identidad de Google (qué Gmail es), nunca acceso al Drive. */
var PORTERO=window.AP_PORTERO_URL||'',PRECIO_TXT='$10.000';
var SUS=null,SUS_VERIF=false,SUS_ERR='',_idCb=null,_idInit=false,_idTok=null;
function susCargar(){SUS=USER?store(claveU('sus')):null;}
function soloLectura(){return !!(PORTERO&&S.logged&&!(SUS&&SUS.acceso));}
function idToken(){
  if(_idTok&&_idTok.exp>Date.now()+120000)return Promise.resolve(_idTok.t);
  return cargarGSI().then(function(){return new Promise(function(ok,mal){
    if(!_idInit){
      google.accounts.id.initialize({client_id:GCLIENT,auto_select:true,use_fedcm_for_prompt:true,cancel_on_tap_outside:false,login_hint:USER?USER.email:'',
        callback:function(r){var t=r&&r.credential;if(!t)return;var exp=Date.now()+55*60000;try{exp=JSON.parse(atob(t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).exp*1000;}catch(e){}
          _idTok={t:t,exp:exp};var c=_idCb;_idCb=null;if(c)c.ok(t);else susConToken(t);}});
      _idInit=true;
    }
    var yo={ok:ok,mal:mal};_idCb=yo;
    try{google.accounts.id.prompt();}catch(e){}
    setTimeout(function(){if(_idCb===yo){_idCb=null;mal({error:'onetap'});}},12000);
  });});
}
function porteroGet(par){
  var q=Object.keys(par).map(function(k){return k+'='+encodeURIComponent(par[k]);}).join('&');
  return fetch(PORTERO+'?'+q).then(function(r){return r.json();});
}
function verificarSus(forzar){
  if(!PORTERO||!S.logged||SUS_VERIF)return;
  if(!forzar&&SUS&&SUS.acceso&&Date.now()-SUS.chk<6*3600000)return;
  if(!forzar&&SUS&&!SUS.acceso&&Date.now()-SUS.chk<5*60000)return;
  SUS_VERIF=true;SUS_ERR='';susUI();
  idToken().then(susConToken,function(){SUS_VERIF=false;SUS_ERR='identidad';susUI();});
}
function susConToken(t){
  SUS_VERIF=true;
  porteroGet({a:'estado',t:t}).then(function(r){
    SUS_VERIF=false;if(!r||!r.ok)throw r;
    var antes=soloLectura();
    SUS={estado:r.estado,acceso:!!r.acceso,vence:r.vence||'',chk:Date.now()};store(claveU('sus'),SUS);SUS_ERR='';
    if(r.precio)PRECIO_TXT='$'+(+r.precio).toLocaleString('es-AR');
    susUI();if(antes&&!soloLectura()){toast('Suscripción activa. ¡Gracias!');if(PENDIENTE||ULTIMO)guardarPronto();}
  }).catch(function(){SUS_VERIF=false;SUS_ERR='portero';susUI();});
}
function susUI(){
  document.body.classList.toggle('sololectura',soloLectura());
  var b=$('#susbar');if(!b)return;
  if(!soloLectura()){b.hidden=true;return;}
  var txt,btn='';
  if(SUS_VERIF&&!SUS){txt='Verificando tu suscripción…';}
  else if(SUS_ERR&&!SUS){txt='No pudimos verificar tu suscripción. Mientras tanto podés ver tus datos, pero no cargar nuevos.';btn='<div id="susG"></div><button type="button" class="btn-ghost" data-sus="verificar">Reintentar</button>';}
  else{txt=SUS&&/pendiente/i.test(SUS.estado)?'Tu pago está en proceso. Cuando Mercado Pago lo apruebe se habilita la carga de datos.':'Tu suscripción no está activa: podés ver tus datos, pero no cargar nuevos ni enviar mensajes.';
    btn=(SUS&&/pendiente/i.test(SUS.estado)?'<button type="button" class="btn-ghost" data-sus="verificar">Ya pagué</button>':'')+'<button type="button" class="btn-primary" data-sus="abrir">Suscribirme</button>';}
  b.innerHTML='<span>'+txt+'</span><div class="susbtns">'+btn+'</div>';b.hidden=false;
  var g=$('#susG');if(g&&window.google&&google.accounts&&google.accounts.id&&_idInit){try{google.accounts.id.renderButton(g,{type:'standard',theme:'outline',size:'medium',shape:'pill',text:'continue_with',locale:'es'});}catch(e){}}
}
function susAbrir(){
  $('#susPrecio').textContent=PRECIO_TXT;
  var f=$('#fSus');f.mp.value=(SUS&&SUS.mp)||(USER?USER.email:'');$('#susErr').textContent='';
  openOv('#ovSus');
}
function susPagar(f){
  var mp=f.mp.value.trim(),btn=f.querySelector('button[type=submit]'),err=$('#susErr');
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mp)){err.textContent='Revisá el mail.';return;}
  btn.disabled=true;err.textContent='Preparando el pago…';
  idToken().then(function(t){return porteroGet({a:'suscribir',t:t,mp:mp});}).then(function(r){
    if(r&&r.url){location.href=r.url;return;}
    btn.disabled=false;
    if(r&&(r.gratis||r.yaActiva)){closeOv();verificarSus(true);return;}
    err.textContent='No se pudo preparar el pago'+(r&&r.error?' ('+esc(r.error)+')':'')+'. Probá de nuevo.';
  }).catch(function(){btn.disabled=false;err.textContent='No se pudo conectar. Revisá internet y probá de nuevo.';});
}
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&S.logged)verificarSus(false);});

// Lo que no se puede hacer en modo "solo ver"
var BLOQ_SOLO='[data-npac],[data-epac],[data-nuevo],[data-slot],[data-pagar],[data-wturno],[data-rec],[data-accion],[data-lugar],[data-tema],[data-logo],[data-ilus],[data-quitarlogo],[data-xatema],[data-xlpal],[data-var],[data-dia-at],[data-copiaya],[data-ea],[data-eah]';
function avisoSolo(){toast('Para cargar datos o enviar mensajes, activá tu suscripción.');susUI();}
document.addEventListener('click',function(e){
  var s=e.target.closest('[data-sus]');
  if(s){e.preventDefault();var a=s.getAttribute('data-sus');if(a==='abrir')susAbrir();else verificarSus(true);return;}
  if(soloLectura()&&e.target.closest(BLOQ_SOLO)){e.preventDefault();e.stopImmediatePropagation();avisoSolo();}
},true);
document.addEventListener('submit',function(e){
  if(e.target.id==='fSus'){e.preventDefault();e.stopImmediatePropagation();susPagar(e.target);return;}
  if(soloLectura()){e.preventDefault();e.stopImmediatePropagation();closeOv();avisoSolo();}
},true);

/* ================= PIN DE BLOQUEO =================
   El PIN es de cada dispositivo: se guarda (como huella, no el número) en este navegador. */
var PINUI=null,BLOQ=false,OCULTO=0,ULT_ACT=Date.now();
function pinDatos(){return USER?store(claveU('pin')):null;}
function pinSal(){var a=new Uint8Array(12);try{crypto.getRandomValues(a);}catch(e){for(var i=0;i<12;i++)a[i]=Math.random()*256|0;}return Array.prototype.map.call(a,function(x){return ('0'+x.toString(16)).slice(-2);}).join('');}
function pinHash(pin,salt){
  var txt=salt+':'+pin;
  if(window.crypto&&crypto.subtle&&window.TextEncoder)return crypto.subtle.digest('SHA-256',new TextEncoder().encode(txt)).then(function(b){return Array.prototype.map.call(new Uint8Array(b),function(x){return ('0'+x.toString(16)).slice(-2);}).join('');});
  var h=5381;for(var i=0;i<txt.length;i++)h=((h*33)^txt.charCodeAt(i))>>>0;return Promise.resolve('d'+h.toString(16));
}
function pinAbrir(o){PINUI=o;o.v='';var L=$('#lock');L.hidden=false;document.body.classList.add('locked');pinDibujar();}
function pinCerrar(){PINUI=null;var L=$('#lock');L.hidden=true;L.innerHTML='';document.body.classList.remove('locked');}
function pinDibujar(err){
  var o=PINUI;if(!o)return;
  var dots='';for(var i=0;i<4;i++)dots+='<i'+(i<o.v.length?' class="on"':'')+'></i>';
  var k='';for(var n=1;n<=9;n++)k+='<button type="button" data-pk="'+n+'">'+n+'</button>';
  var izq=o.cancelar?'<button type="button" class="lk-txt" data-pkc>Cancelar</button>':(o.olvido?'<button type="button" class="lk-txt" data-pko>Olvidé mi PIN</button>':'<span></span>');
  $('#lock').innerHTML='<div class="lock-in"><div class="brand">'+logoHtml()+'<span>'+marcaHtml()+'</span></div>'+
    '<h2>'+esc(o.t)+'</h2><p class="lk-s">'+(o.s||'&nbsp;')+'</p><div class="lk-dots'+(err?' mal':'')+'">'+dots+'</div><p class="lk-e" role="alert">'+(err||'')+'</p>'+
    '<div class="lk-pad">'+k+izq+'<button type="button" data-pk="0">0</button><button type="button" class="lk-txt" data-pkb>Borrar</button></div></div>';
}
function pinTecla(n){
  var o=PINUI;if(!o||o.ocupado||o.v.length>=4)return;
  o.v+=n;pinDibujar();
  if(o.v.length===4){var v=o.v;o.ocupado=true;setTimeout(function(){if(PINUI!==o)return;o.ocupado=false;o.v='';o.cb(v);},150);}
}
function pinBorrar(){var o=PINUI;if(!o||o.ocupado)return;o.v=o.v.slice(0,-1);pinDibujar();}
function bloquear(){
  var d=pinDatos();if(!d||!S.logged||BLOQ)return;
  BLOQ=true;closeOv();
  pinAbrir({t:'Ingresá tu PIN',s:esc(USER.email),olvido:true,cb:function(v){
    var d2=pinDatos();if(!d2){desbloquear();return;}
    pinHash(v,d2.salt).then(function(h){
      if(h===d2.hash){d2.mal=0;store(claveU('pin'),d2);desbloquear();return;}
      d2.mal=(d2.mal||0)+1;store(claveU('pin'),d2);pinFallos(d2);
    });
  }});
  pinFallos(d,true);
}
function pinFallos(d,silencio){
  if((d.mal||0)>=5){PINUI.ocupado=true;pinDibujar('Demasiados intentos. Tocá “Olvidé mi PIN” para entrar con tu cuenta de Google.');}
  else if(!silencio)pinDibujar('PIN incorrecto'+(d.mal>=3?' · te quedan '+(5-d.mal)+' intentos':''));
}
function desbloquear(){BLOQ=false;ULT_ACT=Date.now();pinCerrar();}
function pinOlvido(){
  var mail=USER&&USER.email;if(!PINUI)return;
  PINUI.ocupado=true;pinDibujar('Abriendo Google…');
  cargarGSI().then(function(){return pedirToken('select_account');}).then(function(){
    return gfetch('https://www.googleapis.com/oauth2/v3/userinfo');
  }).then(function(u){
    if(String(u.email||'').toLowerCase()!==mail){TOK=null;store('ap_tok',null);pinDibujar('Esa no es la cuenta de esta agenda. Elegí '+esc(mail)+'.');return;}
    store(claveU('pin'),null);desbloquear();mostrarReconectar(false);
    toast('Se borró el PIN. Podés crear uno nuevo en Configuración › Seguridad');
    if(PENDIENTE)enviar();else cargar();
  }).catch(function(){pinDibujar('No se pudo verificar con Google. Probá de nuevo.');});
}
function pinCrear(err){
  pinAbrir({t:'Elegí un PIN de 4 números',s:'Lo vas a pedir para abrir la agenda en este dispositivo.',cancelar:true,cb:function(v1){
    pinAbrir({t:'Repetí el PIN',s:'Para confirmar.',cancelar:true,cb:function(v2){
      if(v1!==v2){pinCrear('Los PIN no coinciden. Probá de nuevo.');return;}
      var salt=pinSal();
      pinHash(v1,salt).then(function(h){var ant=pinDatos();store(claveU('pin'),{salt:salt,hash:h,min:ant&&ant.min!=null?ant.min:5,mal:0});pinCerrar();render();toast('PIN activado');});
    }});
  }});
  if(err)pinDibujar(err);
}
function pinVerificar(t,ok){
  var d=pinDatos();if(!d)return;
  pinAbrir({t:t,s:'&nbsp;',cancelar:true,cb:function(v){pinHash(v,d.salt).then(function(h){if(h===d.hash)ok();else pinDibujar('PIN incorrecto');});}});
}
function pinAccion(a){
  if(a==='crear')pinCrear();
  else if(a==='cambiar')pinVerificar('Ingresá tu PIN actual',function(){pinCrear();});
  else if(a==='quitar')pinVerificar('Ingresá tu PIN para quitarlo',function(){store(claveU('pin'),null);pinCerrar();render();toast('PIN desactivado');});
  else if(a==='bloquear')bloquear();
}
document.addEventListener('click',function(e){
  if(!PINUI)return;var el=e.target.closest('[data-pk],[data-pkb],[data-pkc],[data-pko]');if(!el)return;
  if(el.hasAttribute('data-pk'))pinTecla(el.getAttribute('data-pk'));
  else if(el.hasAttribute('data-pkb'))pinBorrar();
  else if(el.hasAttribute('data-pkc'))pinCerrar();
  else pinOlvido();
});
document.addEventListener('keydown',function(e){
  if(!PINUI)return;
  if(/^[0-9]$/.test(e.key)){pinTecla(e.key);e.preventDefault();}
  else if(e.key==='Backspace'){pinBorrar();e.preventDefault();}
  else if(e.key==='Escape'&&PINUI.cancelar){pinCerrar();e.preventDefault();}
  e.stopPropagation();
},true);
document.addEventListener('change',function(e){
  if(!e.target.matches||!e.target.matches('[data-pinmin]'))return;
  var d=pinDatos();if(!d)return;d.min=+e.target.value;store(claveU('pin'),d);toast('Listo');
});
document.addEventListener('visibilitychange',function(){
  var d=pinDatos();if(!d||!S.logged)return;
  if(document.visibilityState==='hidden'){OCULTO=Date.now();if(d.min===0)bloquear();}
  else if(OCULTO&&Date.now()-OCULTO>=d.min*60000)bloquear();
});
['pointerdown','keydown','touchstart'].forEach(function(ev){document.addEventListener(ev,function(){ULT_ACT=Date.now();},true);});
setInterval(function(){var d=pinDatos();if(d&&S.logged&&!BLOQ&&Date.now()-ULT_ACT>=(d.min||5)*60000)bloquear();},15000);

function actualizarApp(){
  toast('Actualizando la app…');
  if(PENDIENTE&&!soloLectura())try{enviar();}catch(e){}
  var p=[];
  try{if(navigator.serviceWorker&&navigator.serviceWorker.getRegistrations)p.push(navigator.serviceWorker.getRegistrations().then(function(rs){return Promise.all(rs.map(function(r){return r.unregister();}));}));}catch(e){}
  try{if(window.caches)p.push(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){return caches.delete(k);}));}));}catch(e){}
  Promise.all(p).catch(function(){}).then(function(){setTimeout(function(){location.replace(location.pathname+'?v='+Date.now()+location.hash);},PENDIENTE?1500:300);});
}
/* ---------- Render ---------- */
var RUTAS={inicio:dashboard,calendario:calendario,pacientes:pacientes,pagos:pagos,recordatorios:recordatoriosV,configuracion:configuracion,mas:mas};
function cur(){var h=(location.hash||'').slice(1);if(h==='ingresar')return h;if(/^paciente-\d+$/.test(h))return h;return RUTAS[h]?h:'inicio';}
function render(){
  var k=cur();
  if(!S.logged){
    document.body.classList.add('auth');
    if(k!=='ingresar'){S.destino=k;}
    $('#auth').innerHTML=authV('ingresar');aplicarTema();return;
  }
  if(k==='ingresar'){location.hash='inicio';return;}
  document.body.classList.remove('auth');
  renderNav(k);
  $('#view').innerHTML='<div class="wrap" style="padding:0">'+(k.indexOf('paciente-')===0?ficha(k.split('-')[1]):RUTAS[k]())+'</div>';
  aplicarTema();
  bindInputs();
  guardarPronto();
  if(k==='calendario'&&S.vista==='semana'){var sc=$('.cal-scroll'),t=$('.dcol.hoy');if(sc&&t)sc.scrollLeft=Math.max(0,t.offsetLeft-200);}
}
function bindInputs(){
  var q=$('#q');if(q)q.addEventListener('input',function(){S.q=q.value;var cols=$('.cols');var tmp=document.createElement('div');tmp.innerHTML=agenda();cols.replaceChild(tmp.firstElementChild,cols.firstElementChild);});
  var pq=$('#pq');if(pq)pq.addEventListener('input',function(){S.pq=pq.value;var tmp=document.createElement('div');tmp.innerHTML=pacientes();$('#ptb').innerHTML=tmp.querySelector('#ptb').innerHTML;});
  var pg=$('#pagq');if(pg)pg.addEventListener('input',function(){S.pagq=pg.value;var pos=pg.selectionStart;render();var n=$('#pagq');n.focus();n.setSelectionRange(pos,pos);});
  $$('[data-plant]').forEach(function(ed){ed.addEventListener('input',function(){plantGuardar(ed);});ed.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();document.execCommand('insertLineBreak');}});ed.addEventListener('paste',function(e){e.preventDefault();var t=(e.clipboardData||window.clipboardData).getData('text');document.execCommand('insertText',false,t);});ed.addEventListener('keyup',plantRango);ed.addEventListener('mouseup',plantRango);ed.addEventListener('blur',plantRango);});
  $$('#view [data-cfgset]').forEach(function(el){
    var ev=(el.tagName==='SELECT'||el.type==='checkbox')?'change':'input';
    el.addEventListener(ev,function(){
      var k=el.getAttribute('data-cfgset'),v=el.type==='checkbox'?el.checked:el.value;
      if(k==='desde'||k==='hasta'||k==='antic')v=+v;
      if(k==='honor')v=num(v);
      if(k==='desde'&&v>=CFG.hasta){toast('El horario de inicio tiene que ser anterior al de fin');el.value=CFG.desde;return;}
      if(k==='hasta'&&v<=CFG.desde){toast('El horario de fin tiene que ser posterior al de inicio');el.value=CFG.hasta;return;}
      CFG[k]=v;
      if(k==='marca'||k==='letra'||k==='prof'){guardarApariencia();aplicarTema();var pv=$('.preview .brand');if(pv)pv.innerHTML=logoHtml()+'<span>'+marcaHtml()+'</span>';$$('.logoop').forEach(function(b){var t=b.getAttribute('data-logo');if(t.indexOf('mono')===0)b.querySelector('.logo').outerHTML=logoHtml(t);});var fs=$$('.fsec').filter(function(x){return x.textContent.indexOf('Con tu inicial')===0;})[0];if(fs)fs.textContent='Con tu inicial · '+letra();}
      if(ev==='change'){if(k==='autoRec'||k==='antic'||k==='avisoSemana'||k==='avisoDia'||k==='horaRec'){render();toast('Recordatorios actualizados');}else toast('Guardado');}
      else{clearTimeout(el._t);el._t=setTimeout(function(){toast('Guardado');},900);}
    });
  });
  var lf=$('#logoFile');if(lf)lf.addEventListener('change',function(){
    var f=lf.files&&lf.files[0];if(!f)return;if(f.size>3*1024*1024){toast('La imagen es muy pesada (máx. 3 MB)');return;}
    var rd=new FileReader();rd.onload=function(){
      var img=new Image();img.onload=function(){var c=document.createElement('canvas'),s=128;c.width=c.height=s;var x=c.getContext('2d'),m=Math.min(img.width,img.height);x.fillStyle='#fff';x.fillRect(0,0,s,s);x.drawImage(img,(img.width-m)/2,(img.height-m)/2,m,m,0,0,s,s);CFG.logoImg=c.toDataURL('image/jpeg',0.85);CFG.logo='imagen';guardarApariencia();render();toast('Logo actualizado');};img.src=rd.result;
    };rd.readAsDataURL(f);
  });
}
function go(k){if(location.hash==='#'+k)render();else location.hash=k;window.scrollTo(0,0);}
window.addEventListener('hashchange',function(){S.verTodo=false;render();});

/* ---------- Ventanas ---------- */
var lastFocus=null;
function openOv(id){lastFocus=document.activeElement;$(id).classList.add('open');var f=$(id).querySelector('input:not([type=hidden]):not([disabled]),select,textarea,button');if(f)setTimeout(function(){f.focus();},30);}
function closeOv(){$$('.overlay.open').forEach(function(o){o.classList.remove('open');});if(lastFocus&&lastFocus.focus)try{lastFocus.focus();}catch(e){}}
function abrirTurnoForm(t,fecha,hora,nombre){
  var f=$('#fNuevo');f.reset();
  $('#lpac').innerHTML=PAC.filter(function(p){return p.estado!=='alta';}).map(function(p){return '<option value="'+esc(p.nombre)+'">';}).join('');
  $('#tNuevo').textContent=t?'Editar turno':'Nuevo turno';$('#bGuardar').textContent=t?'Guardar cambios':'Guardar turno';
  var p=pacPorNombre(nombre||(t&&t.nombre)||'');
  f.tid.value=t?t.id:'';f.nombre.value=t?t.nombre:(nombre||'');
  f.fecha.value=t?t.fecha:(fecha||(cur()==='calendario'?S.fecha:(cur()==='inicio'?S.dash:HOY)));
  f.hora.value=t?t.hora:(hora||'16:00');f.dur.value=t?t.dur:CFG.dur;
  f.monto.value=(t?t.monto:(p?p.honor:CFG.honor)).toLocaleString('es-AR');f.nota.value=t?t.nota:'';
  f.querySelector('input[name=mod][value='+(t?t.mod:(p?p.mod:(CFG.presencial?'p':'v')))+']').checked=true;
  avisoDisp();
  openOv('#ovNuevo');
}
function choqueLugar(fecha,hora){if(!fecha||!hora)return null;var w=D(fecha).getDay();return CFG.lugares.filter(function(l){return !l.consultorio&&l.nombre&&l.dias.indexOf(w)>=0&&hora>=l.desde&&hora<l.hasta;})[0]||null;}
function avisoDisp(){var f=$('#fNuevo'),p=pacPorNombre(f.nombre.value.trim()),b=$('#dispAviso');if(!b)return;var L=choqueLugar(f.fecha.value,f.hora.value);if(L){b.className='disp-aviso fuera';b.innerHTML=ico('i-clock',15,1.8)+'<span>En ese horario figurás en '+esc(L.nombre)+' ('+L.desde+' a '+L.hasta+' h).</span>';return;}if(!p||!dispTxt(p)){b.innerHTML='';b.className='disp-aviso';return;}var fuera=fueraDisp(p,f.fecha.value,f.hora.value);b.className='disp-aviso'+(fuera?' fuera':'');b.innerHTML=ico('i-clock',15,1.8)+'<span>'+(fuera?esc(fuera):'Puede asistir: '+esc(dispTxt(p)))+'</span>';}
['nombre','fecha','hora'].forEach(function(k){$('#fNuevo')[k].addEventListener(k==='nombre'?'input':'change',avisoDisp);});
$('#fNuevo').nombre.addEventListener('change',function(){var f=$('#fNuevo'),p=pacPorNombre(f.nombre.value.trim());if(p&&!f.tid.value){f.monto.value=p.honor.toLocaleString('es-AR');f.querySelector('input[name=mod][value='+p.mod+']').checked=true;}});
$('#fNuevo').addEventListener('submit',function(e){
  e.preventDefault();var f=e.target,nombre=f.nombre.value.trim();if(!nombre)return;
  var dat={nombre:nombre,fecha:f.fecha.value,hora:f.hora.value,dur:f.dur.value,monto:num(f.monto.value),mod:f.mod.value,nota:f.nota.value};
  var choque=TURNOS.filter(function(t){return t.fecha===dat.fecha&&t.estado!=='cancelada'&&String(t.id)!==f.tid.value&&mins(t.hora)<mins(dat.hora)+(parseInt(dat.dur,10)||50)&&mins(dat.hora)<mins(t.hora)+durMin(t);})[0];
  var nuevoPac=!pacPorNombre(nombre);
  if(nuevoPac)P({nombre:nombre,dni:'',nac:'',tel:'',email:'',obra:'Particular',mod:dat.mod,honor:dat.monto||CFG.honor,estado:'activo',alta:HOY,motivo:'',contacto:''});
  if(f.tid.value){var t=byId(f.tid.value);for(var c in dat)t[c]=dat[c];toast('Turno actualizado');}
  else{var nt=T(dat.fecha,dat.hora,dat.nombre,dat.mod,'pendiente',false,{dur:dat.dur,monto:dat.monto,nota:dat.nota});var pn=pacPorNombre(nombre);if(pn&&pn.tel)setTimeout(function(){abrirTurno(nt.id);},350);toast('Turno agendado: '+nombre+' · '+corto(dat.fecha)+' '+dat.hora+(nuevoPac?' · paciente nuevo creado':''));}
  if(choque)setTimeout(function(){toast('Ojo: se superpone con '+choque.nombre+' ('+choque.hora+')');},2700);
  S.fecha=dat.fecha;if(dat.fecha>=lunes(HOY)&&dat.fecha<=add(lunes(HOY),5))S.dash=dat.fecha;S.q='';closeOv();render();
});
function abrirTurno(id){
  var t=byId(id),p=pacPorNombre(t.nombre);
  $('#tDet').textContent=t.nombre;
  $('#detBody').innerHTML='<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><span class="av '+color(t.nombre)+'">'+ini(t.nombre)+'</span><span class="tag t-'+t.estado+'">'+t.estado+'</span>'+(p?'<button class="link" data-pac="'+p.id+'" style="margin-left:auto;font-size:14px">Ver ficha'+ico('i-arrow',15,1.8)+'</button>':'')+'</div>'+
  '<div class="r"><span>Día</span><span>'+largo(t.fecha)+'</span></div><div class="r"><span>Hora</span><span>'+t.hora+' a '+hhmm(mins(t.hora)+durMin(t))+'</span></div><div class="r"><span>Modalidad</span><span>'+(t.mod==='v'?'Virtual':'Presencial')+'</span></div>'+
  '<div class="r"><span>Pago</span><span>'+(t.pagado===null?'Sin cargo':t.pagado===true?'Pagado · '+plata(t.monto)+' · '+esc(t.medio||''):plata(t.monto)+(t.fecha<=HOY?' · a cobrar':''))+'</span></div>'+(t.nota?'<div class="r"><span>Nota</span><span>'+esc(t.nota)+'</span></div>':'')+(t.confPac?'<div class="r"><span>Respuesta</span><span>'+(t.confPac==='si'?'El paciente confirmó desde el link':'El paciente avisó que no puede ir')+'</span></div>':'');
  var a='';
  if(t.estado==='pendiente')a+='<button class="btn-ghost" data-accion="confirmar" data-k="'+t.id+'">'+ico('i-check',16,2)+'Confirmar</button>';
  if(t.pagado===false&&t.estado!=='cancelada')a+='<button class="btn-ghost" data-pagar="'+t.id+'">Registrar pago</button>';
  if(t.estado==='pendiente'||t.estado==='confirmado')a+='<button class="btn-ghost" data-accion="cancelar" data-k="'+t.id+'" style="color:var(--red-d)">Cancelar turno</button>';
  if(t.estado!=='cancelada'&&t.estado!=='realizada')a+='<button class="btn-ghost" data-wturno="'+t.id+'">'+ico('i-chat',16,1.8)+'Mandar por WhatsApp</button>';
  a+='<button class="btn-ghost" data-accion="editar" data-k="'+t.id+'">'+ico('i-edit',16,1.8)+'Editar</button><button class="btn-primary" data-close>Listo</button>';
  $('#detAct').innerHTML=a;openOv('#ovDet');
}
function abrirPago(id){
  var t=byId(id),f=$('#fPago');closeOv();f.reset();f.tid.value=t.id;f.monto.value=t.monto.toLocaleString('es-AR');f.fecha.value=HOY;
  $('#pagoInfo').innerHTML='<div class="r" style="border-top:none;padding-top:0"><span>Paciente</span><span>'+esc(t.nombre)+'</span></div><div class="r"><span>Sesión</span><span>'+largo(t.fecha)+', '+t.hora+'</span></div>';
  openOv('#ovPago');
}
$('#fPago').addEventListener('submit',function(e){e.preventDefault();var f=e.target,t=byId(f.tid.value);t.pagado=true;t.monto=num(f.monto.value)||t.monto;t.medio=f.medio.value;t.fpago=f.fecha.value||HOY;closeOv();render();toast('Pago registrado: '+t.nombre+' · '+plata(t.monto)+' · '+t.medio);});
function abrirPac(p){
  var f=$('#fPac');f.reset();
  $('#tPac').textContent=p?'Editar paciente':'Nuevo paciente';$$('.segplan').forEach(function(a){if(SSID){a.href='https://docs.google.com/spreadsheets/d/'+SSID+'/edit';a.hidden=false;}else a.hidden=true;});$('#bPac').textContent=p?'Guardar cambios':'Guardar paciente';
  f.pid.value=p?p.id:'';
  ['nombre','dni','nac','tel','email','contacto','obra','estado','motivo'].forEach(function(k){if(p&&p[k]!=null)f[k].value=p[k];});
  f.coseguro.value=p&&p.coseguro?p.coseguro.toLocaleString('es-AR'):'';
  f.trabajo.value=p&&p.trabajo||'';f.horTrabajo.value=p&&p.horTrabajo||'';f.dispDesde.value=p&&p.dispDesde||'';f.dispHasta.value=p&&p.dispHasta||'';
  $('#pDias').innerHTML=daypickHtml('dispDias',p?p.dispDias:[]);
  f.honor.value=(p?p.honor:CFG.honor).toLocaleString('es-AR');
  f.querySelector('input[name=mod][value='+(p?p.mod:'p')+']').checked=true;
  openOv('#ovPac');
}
$('#fPac').addEventListener('submit',function(e){
  e.preventDefault();var f=e.target,n=f.nombre.value.trim();if(!n)return;
  var otro=pacPorNombre(n);if(otro&&String(otro.id)!==f.pid.value){toast('Ya existe un paciente con ese nombre');return;}
  var dat={nombre:n,dni:f.dni.value,nac:f.nac.value,tel:f.tel.value,email:f.email.value,contacto:f.contacto.value,obra:f.obra.value,coseguro:num(f.coseguro.value),trabajo:f.trabajo.value.trim(),horTrabajo:f.horTrabajo.value.trim(),dispDias:$$('#pDias input:checked').map(function(i){return +i.value;}),dispDesde:f.dispDesde.value,dispHasta:f.dispHasta.value,honor:num(f.honor.value)||CFG.honor,mod:f.mod.value,estado:f.estado.value,motivo:f.motivo.value};
  var p;
  if(f.pid.value){p=pac(f.pid.value);var viejo=p.nombre;for(var k in dat)p[k]=dat[k];if(viejo!==n)TURNOS.forEach(function(t){if(t.nombre===viejo)t.nombre=n;});toast('Paciente actualizado');}
  else{dat.alta=HOY;p=P(dat);toast('Paciente creado: '+n);}
  closeOv();go('paciente-'+p.id);
});

/* ---------- Clics ---------- */
document.addEventListener('click',function(e){
  var el,g=function(s){return (el=e.target.closest(s));};
  if(g('[data-close]')){closeOv();return;}
  if(e.target.classList.contains('overlay')){closeOv();return;}
  if(g('[data-pagar]')){abrirPago(el.getAttribute('data-pagar'));return;}
  if(g('[data-tid]')){abrirTurno(el.getAttribute('data-tid'));return;}
  if(g('[data-pac]')){var id=el.getAttribute('data-pac');if(id){closeOv();go('paciente-'+id);}return;}
  if(g('[data-go]')){go(el.getAttribute('data-go'));return;}
  if(g('[data-nuevo]')){abrirTurnoForm(null,null,null,el.getAttribute('data-paciente'));return;}
  if(g('[data-npac]')){abrirPac(null);return;}
  if(g('[data-datos]')){abrirDatos(pac(el.getAttribute('data-datos')));return;}
  if(g('[data-epac]')){closeOv();abrirPac(pac(el.getAttribute('data-epac')));return;}
  if(g('[data-dash]')){S.dash=el.getAttribute('data-dash');var cols=$('.cols'),tmp=document.createElement('div');tmp.innerHTML=agenda();cols.replaceChild(tmp.firstElementChild,cols.firstElementChild);return;}
  if(g('[data-cal]')){S.vista=el.getAttribute('data-cal');S.fecha=el.getAttribute('data-f')||S.fecha;if(cur()!=='calendario')go('calendario');else render();window.scrollTo(0,0);return;}
  if(g('[data-vista]')){S.vista=el.getAttribute('data-vista');render();return;}
  if(g('[data-mover]')){mover(+el.getAttribute('data-mover'));return;}
  if(g('[data-hoy]')){S.fecha=HOY;render();return;}
  if(g('[data-slot]')){var r=el.getBoundingClientRect(),m=CFG.desde*60+Math.floor((e.clientY-r.top)/HH*2)*30;m=Math.min(Math.max(m,CFG.desde*60),(CFG.hasta-1)*60+30);abrirTurnoForm(null,el.getAttribute('data-slot'),hhmm(m));return;}
  if(g('[data-pf]')){S.pf=el.getAttribute('data-pf');render();return;}
  if(g('[data-vertodo]')){S.verTodo=!S.verTodo;render();return;}
  if(g('[data-pagf]')){S.pagf=el.getAttribute('data-pagf');render();return;}
  if(g('[data-pmes]')){var d=D(S.pmes);d.setMonth(d.getMonth()+ +el.getAttribute('data-pmes'));S.pmes=K(d).slice(0,7);render();return;}
  if(g('[data-recf]')){S.recf=el.getAttribute('data-recf');render();return;}
  if(g('[data-rec]')){var a=el.getAttribute('data-rec'),rid=el.getAttribute('data-id');if(a==='enviar'){var R=recordatorios().filter(function(r){return r.id===rid;})[0],pp=R&&pacPorNombre(R.t.nombre);if(!pp||!pp.tel){toast('Cargá el teléfono del paciente para enviarle el mensaje');return;}window.open('https://api.whatsapp.com/send?phone='+telWa(pp.tel)+'&text='+encodeURIComponent(textoRec(R.tipo,R.t)),'_blank');RECX[rid]='enviado';toast('Se abrió WhatsApp con el mensaje listo para enviar');}else if(a==='pausar'){RECX[rid]='pausado';toast('Recordatorio pausado');}else{delete RECX[rid];toast('Recordatorio reactivado');}render();return;}
  if(g('[data-var]')){plantInsertar(el.getAttribute('data-k'),el.getAttribute('data-var'));return;}
  if(g('[data-pinact]')){pinAccion(el.getAttribute('data-pinact'));return;}
  if(g('[data-cfg]')){S.cfgTab=el.getAttribute('data-cfg');if(cur()!=='configuracion')go('configuracion');else render();return;}
  if(g('[data-tema]')){CFG.tema=el.getAttribute('data-tema');guardarApariencia();render();toast('Colores: '+PALETAS[CFG.tema].n);return;}
  if(g('[data-ilus]')){CFG.ilus=el.getAttribute('data-ilus');guardarApariencia();render();toast('Ilustración actualizada');return;}
  if(g('[data-logo]')){if(el.disabled)return;CFG.logo=el.getAttribute('data-logo');guardarApariencia();render();return;}
  if(g('[data-quitarlogo]')){CFG.logoImg=null;if(CFG.logo==='imagen')CFG.logo='hoja';guardarApariencia();render();return;}
  if(g('[data-anual]')){S.anual=el.getAttribute('data-anual')==='1';render();return;}
  if(g('[data-plan]')){toast('Elegiste '+el.getAttribute('data-plan')+'. El pago de la suscripción se activa en una próxima etapa.');return;}
  if(g('[data-auth]')){go(el.getAttribute('data-auth'));return;}
  if(g('[data-glogin]')){ingresarGoogle(el);return;}
  if(g('[data-reconectar]')){reconectar();return;}
  if(g('[data-excel]')){abrirExcel(el.getAttribute('data-excel'));return;}
  if(g('[data-xlpal]')){$$('[data-xlpal]').forEach(function(b){b.setAttribute('aria-pressed',b===el);});return;}
  if(g('#bExcel')){descargarExcel();return;}
  if(g('[data-wturno]')){var tw=byId(el.getAttribute('data-wturno')),pw=pacPorNombre(tw.nombre);if(!pw||!pw.tel){toast('Cargá el teléfono del paciente para mandarle el turno');return;}window.open('https://api.whatsapp.com/send?phone='+telWa(pw.tel)+'&text='+encodeURIComponent(textoRec('turno',tw)),'_blank');toast('Se abrió WhatsApp con el turno y el link al calendario');return;}
  if(g('[data-xatema]')){CFG.copiaDrive.tema=el.getAttribute('data-xatema');render();toast('Colores de las copias: '+PALETAS[CFG.copiaDrive.tema].n);return;}
  if(g('[data-copiaya]')){guardarCopiaAhora(el);return;}
  if(g('[data-actualizar]')){actualizarApp();return;}
  if(g('[data-salir]')){salir();toast('Sesión cerrada');return;}
  if(g('[data-dia-at]')){return;}
  if(g('[data-lugar]')){var a=el.getAttribute('data-lugar');if(a==='nuevo'){CFG.lugares.push({nombre:'',dias:[],desde:'09:00',hasta:'13:00'});render();var ins=$$('[data-k=nombre]');if(ins.length)ins[ins.length-1].focus();}else{CFG.lugares.splice(+el.getAttribute('data-i'),1);render();toast('Lugar quitado');}return;}
  if(g('[data-accion]')){
    var t=byId(el.getAttribute('data-k')),ac=el.getAttribute('data-accion');
    if(ac==='editar'){closeOv();abrirTurnoForm(t);return;}
    if(ac==='confirmar'){t.estado='confirmado';toast('Turno confirmado');}
    if(ac==='cancelar'){t.estado='cancelada';if(t.pagado===false)t.pagado=null;toast('Turno cancelado');}
    closeOv();render();return;
  }
});
document.addEventListener('change',function(e){
  var el=e.target;
  if(el.matches('[data-ea]')){var k=el.getAttribute('data-ea');CFG.copiaDrive[k]=el.type==='checkbox'?el.checked:el.value.trim();toast(k==='activo'?(el.checked?'Copias automáticas activadas':'Copias automáticas desactivadas'):'Guardado');render();if(k==='activo'&&el.checked)revisarCopia();return;}
  if(el.matches('[data-eah]')){CFG.copiaDrive.hojas[el.getAttribute('data-eah')]=el.checked;toast('Guardado');return;}
  if(el.matches('[data-lgdia]')){var L=CFG.lugares[+el.getAttribute('data-lgdia')],n=+el.value;if(el.checked){if(L.dias.indexOf(n)<0)L.dias.push(n);}else L.dias=L.dias.filter(function(x){return x!==n;});toast('Guardado');return;}
  if(el.matches('[data-lg]')){CFG.lugares[+el.getAttribute('data-lg')][el.getAttribute('data-k')]=el.value;toast('Guardado');return;}
  if(el.matches('[data-dia-at]')){var n=+el.getAttribute('data-dia-at');if(el.checked){if(CFG.dias.indexOf(n)<0)CFG.dias.push(n);}else{if(CFG.dias.length===1){el.checked=true;toast('Tiene que quedar al menos un día');return;}CFG.dias=CFG.dias.filter(function(x){return x!==n;});}toast('Días de atención actualizados');}
});
document.addEventListener('submit',function(e){
  var f=e.target;
  if(f.id==='fNota'){e.preventDefault();var p=pac(f.getAttribute('data-p')),tx=$('#nTxt').value.trim();if(!tx)return;p.notas.push({f:HOY,t:tx});render();toast('Nota guardada');}

});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape')closeOv();
  if(e.key==='Enter'&&e.target.matches('tr[data-pac]'))go('paciente-'+e.target.getAttribute('data-pac'));
});
aplicarTema();
(function(){
  if(USER){
    var c=store(claveU('cache'));if(c&&c.datos)aplicarDatos(c.datos,c.version,true);
    var pend=store(claveU('pend'));if(pend&&pend.datos){aplicarDatos(pend.datos,pend.base,true);PENDIENTE=true;}
  }
  susCargar();
  render();susUI();
  if(location.search){try{history.replaceState(null,'',location.pathname+location.hash);}catch(e){}}
  if(USER&&S.logged){verificarSus(true);}
  if(USER&&S.logged&&pinDatos())bloquear();
  if(USER){if(tokenOk())iniciarPlanilla();else mostrarReconectar(true);}
})();
})();

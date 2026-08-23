/* Le rapport embarqué du marque-page : un panneau flottant posé sur
   n'importe quelle page, alimenté par le même moteur que le banc. */

export const OVERLAY = String.raw`
var R = auditer(document, window);
var O = ['i1','i2','i3','i4','i5','i6','i7','i8','i9'];
var N = {i1:'Concentricité', i2:'Chaîne des rayons', i3:"Dégagement d'angle", i4:'Saturation',
         i5:'Chaîne des paddings', i6:'Gap intérieur', i7:'Frontière',
         i8:'Un étage, un rôle', i9:'Géométrie en rem'};
var vieux = document.getElementById('sibyl-audit'); if (vieux) vieux.remove();
var ok = O.filter(function(k){ return R.inv[k] && !R.inv[k].fautes.length; }).length;
var grave = R.garde.filter(function(g){ return g.n === 'grave'; });
var autre = R.garde.filter(function(g){ return g.n !== 'grave'; });
var d = document.createElement('div');
d.id = 'sibyl-audit';
d.setAttribute('style', 'position:fixed;z-index:2147483647;top:12px;right:12px;width:352px;'
  + 'max-height:88vh;overflow:auto;background:#fff;color:#170F49;border-radius:16px;'
  + 'box-shadow:0 18px 44px -12px rgba(23,15,73,.45);padding:14px;'
  + 'font:13px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,sans-serif');
var h = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">'
  + '<span style="width:44px;height:44px;flex:none;border-radius:99px;display:grid;place-items:center;'
  + 'color:#fff;font-weight:700;background:'
  + (grave.length ? '#B45309' : ok === 9 ? '#0E9F6E' : ok >= 7 ? '#B45309' : '#E11D48') + '">'
  + (grave.length ? '!' : ok + '/9') + '</span>'
  + '<b style="flex:1;min-width:0">Sibyl — conformité</b>'
  + '<button id="sibyl-x" style="border:0;background:#EFEFF6;border-radius:8px;width:28px;height:28px;'
  + 'cursor:pointer;font:16px/1 sans-serif;color:#6F6C90">&times;</button></div>';
grave.concat(autre).forEach(function(g){
  h += '<div style="background:' + (g.n === 'grave' ? '#FDE8EE' : '#FEF3C7')
    + ';color:' + (g.n === 'grave' ? '#E11D48' : '#B45309')
    + ';border-radius:10px;padding:8px 10px;margin-bottom:8px;font-size:12px">' + g.t + '</div>';
});
h += '<div style="font-size:12px;color:#6F6C90;margin-bottom:8px">' + R.surfaces + ' surfaces · '
  + R.etages + ' étages · ' + R.controles + ' contrôles'
  + (R.inv.i5.q ? ' · diviseur ÷' + String(R.inv.i5.q).replace('.', ',') : '') + '</div>';
O.forEach(function(k){
  var v = R.inv[k], n = v ? v.fautes.length : -1;
  h += '<div data-k="' + k + '" style="display:flex;gap:8px;align-items:center;padding:6px 8px;'
    + 'border-radius:8px;cursor:pointer;margin-bottom:2px;background:' + (n > 0 ? '#FDE8EE' : '#F5F5F9') + '">'
    + '<code style="color:#A0A3BD;font-size:11px;width:16px;flex:none">' + k + '</code>'
    + '<span style="flex:1;min-width:0">' + N[k] + '</span>'
    + '<b style="color:' + (n > 0 ? '#E11D48' : '#0E9F6E') + '">' + (n === 0 ? '✓' : n) + '</b></div>';
});
h += '<div id="sibyl-det" style="margin-top:10px;font-size:12px;color:#6F6C90">'
  + 'Clique un invariant pour voir le détail et surligner les éléments.</div>';
d.innerHTML = h;
document.body.appendChild(d);
document.getElementById('sibyl-x').onclick = function(){ d.remove(); };
d.addEventListener('click', function(e){
  var t = e.target, row = null;
  while (t && t !== d){ if (t.getAttribute && t.getAttribute('data-k')){ row = t; break; } t = t.parentNode; }
  if (!row) return;
  var v = R.inv[row.getAttribute('data-k')];
  [].slice.call(document.querySelectorAll('[data-sib]')).forEach(function(x){
    x.style.outline = ''; x.style.outlineOffset = ''; });
  var txt = '', prem = null;
  (v.fautes || []).slice(0, 30).forEach(function(f){
    txt += '<div style="padding:6px 0;border-top:1px solid #EFEFF6">'
      + '<code style="color:#5D51E8">' + f.el + '</code><br>' + f.dit
      + (f.sens ? '<i style="display:block;color:#E11D48;font-style:normal">' + f.sens + '</i>' : '')
      + '</div>';
    if (f.i){ var el = document.querySelector('[data-sib="' + f.i + '"]');
      if (el){ el.style.outline = '2px solid #E11D48'; el.style.outlineOffset = '2px'; if (!prem) prem = el; } }
  });
  document.getElementById('sibyl-det').innerHTML = txt || '✓ Rien à signaler sur cet invariant.';
  if (prem) prem.scrollIntoView({ block:'center', behavior:'smooth' });
});
`;

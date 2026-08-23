/* Le moteur d'audit — fonction pure, injectée telle quelle dans le navigateur.
   Neuf invariants : quatre lois de géométrie, quatre conventions du système, une d'hygiène.
   Exporté en texte pour être embarqué dans sibyl-conformite.html. */

export const MOTEUR = String.raw`
function auditer(doc, win){
  var px = function(s){ return parseFloat(s) || 0; };
  var cs = function(e){ return win.getComputedStyle(e); };
  var rc = function(e){ return e.getBoundingClientRect(); };
  var r4 = function(e){ var s = cs(e); return [px(s.borderTopLeftRadius), px(s.borderTopRightRadius),
                                               px(s.borderBottomLeftRadius), px(s.borderBottomRightRadius)]; };
  var rad = function(e){ var m = 0, r = r4(e); for (var i=0;i<4;i++) if (r[i] > m) m = r[i]; return m; };
  var HORS = { SCRIPT:1, STYLE:1, LINK:1, META:1, HEAD:1, BR:1, HR:1, IFRAME:1, IMG:1, CANVAS:1 };

  function peint(e){
    var s = cs(e), b = s.backgroundColor;
    return (b && b !== 'rgba(0, 0, 0, 0)' && b !== 'transparent') || s.backgroundImage !== 'none';
  }
  function fondPage(){
    var b = cs(doc.body).backgroundColor;
    if (b && b !== 'rgba(0, 0, 0, 0)') return b;
    return cs(doc.documentElement).backgroundColor;
  }
  var FOND = fondPage();
  var VW = Math.max(doc.documentElement.clientWidth, 320);

  /* ── recensement des surfaces ─────────────────────────────────────
     surface : élément peint d'au moins 8×8, hors racine, hors SVG.
     canevas : surface de premier étage dont le fond est celui de la page,
               ou qui couvre au moins 90 % de la largeur — c'est le papier,
               pas une surface : elle ne compte pas dans la chaîne.       */
  var tous = [].slice.call(doc.querySelectorAll('*'));
  var brut = tous.filter(function(e){
    if (e === doc.body || e === doc.documentElement) return false;
    if (HORS[e.tagName]) return false;
    if (e.closest && e.closest('svg')) return false;
    var r = rc(e); if (r.width < 8 || r.height < 8) return false;
    if (cs(e).visibility === 'hidden' || cs(e).opacity === '0') return false;
    return peint(e);
  });
  var setB = new Set(brut);
  function parB(e){ var p = e.parentElement;
    while (p && p !== doc.body && p !== doc.documentElement){ if (setB.has(p)) return p; p = p.parentElement; }
    return null; }

  var canevas = brut.filter(function(e){
    if (parB(e)) return false;                        /* uniquement au premier étage */
    var r = rc(e);
    return cs(e).backgroundColor === FOND || r.width >= VW * 0.9;
  });
  var setCan = new Set(canevas);
  var surfaces = brut.filter(function(e){ return !setCan.has(e); });
  var setS = new Set(surfaces);

  /* Hors chaîne — trois familles qui ont un rayon intrinsèque, pas dérivé :
     · les contrôles (balises de formulaire)
     · les pilules (rayon saturé)
     · les marques : peintes, sans surface à l'intérieur, et basses — badges,
       jauges, cellules, puces. Une marque décore, elle ne contient pas.      */
  function controle(e){
    if ({BUTTON:1, INPUT:1, SELECT:1, TEXTAREA:1, LABEL:1, SUMMARY:1}[e.tagName]) return true;
    var r = rc(e);
    if (rad(e) >= Math.min(r.width, r.height) / 2 - 0.6) return true;
    if (r.height <= 32 && !e.querySelector('*') ) return true;
    if (r.height <= 32 || e.tagName === 'A'){   /* un lien peint et creux est une puce cliquable */
      var d = [].slice.call(e.querySelectorAll('*'));
      var creuse = true;
      for (var i = 0; i < d.length; i++) if (setB.has(d[i])) { creuse = false; break; }
      if (creuse) return true;
    }
    return false;
  }
  var pures = surfaces.filter(function(e){ return !controle(e); });
  var setP = new Set(pures);

  function parent(e){ var p = e.parentElement;
    while (p && p !== doc.body && p !== doc.documentElement){ if (setP.has(p)) return p; p = p.parentElement; }
    return null; }
  function etage(e){ var n = 1, p = parent(e); while (p){ n++; p = parent(p); } return n; }

  var seq = 0;
  function nom(e){ var c = e.getAttribute && e.getAttribute('class');
    return e.tagName.toLowerCase() + (c ? '.' + String(c).trim().split(/\s+/)[0] : ''); }
  function marque(e){ var v = e.getAttribute('data-sib');   /* un élément = un repère, même s'il est pris en défaut plusieurs fois */
    if (v) return +v;
    seq++; e.setAttribute('data-sib', seq); return seq; }
  function faute(e, dit, sens){ return { el: nom(e), i: marque(e), dit: dit, sens: sens || '' }; }
  function note(txt, dit){ return { el: txt, i: 0, dit: dit, sens: '' }; }
  function r1(v){ return Math.round(v * 10) / 10; }

  var I = {};
  var duos = [];   /* couples parent → enfant, réutilisés par plusieurs invariants */
  pures.forEach(function(e){ var p = parent(e); if (p) duos.push([p, e]); });

  /* ═══ i1 · concentricité — LOI : r ∈ [R − écart, R] ═══════════════ */
  var COINS = [['TopLeft',1,1],['TopRight',-1,1],['BottomLeft',1,-1],['BottomRight',-1,-1]];
  var f1 = [], n1 = 0;
  duos.forEach(function(d){
    var p = d[0], el = d[1], a = rc(p), c = rc(el);
    COINS.forEach(function(K){
      var k = K[0], sx = K[1], sy = K[2];
      var dx = sx > 0 ? c.x - a.x : (a.x + a.width) - (c.x + c.width);
      var dy = sy > 0 ? c.y - a.y : (a.y + a.height) - (c.y + c.height);
      if (dx < -0.5 || dy < -0.5 || dx > 40 || dy > 40) return;   /* hors régime d'angle */
      if (Math.abs(dx - dy) > 1.5) return;                         /* pas logé dans l'angle */
      var Rp = px(cs(p)['border' + k + 'Radius']);
      if (Rp <= 0.5) return;                                       /* parent non arrondi : enfant libre */
      var ac = px(cs(el)['border' + k + 'Radius']), g = (dx + dy) / 2;
      n1++;
      var lo = Math.max(0, Rp - g);
      if (ac < lo - 1.5 || ac > Rp + 1.5)
        f1.push(faute(el, 'R ' + Math.round(Rp) + ' · écart ' + Math.round(g) +
          ' → bande admise [' + Math.round(lo) + ' – ' + Math.round(Rp) + '], posé ' + Math.round(ac),
          ac < lo ? 'trop carré, l\'angle bâille' : 'plus rond que son parent'));
    });
  });
  I.i1 = { total: n1, fautes: f1 };

  /* ═══ i3 · dégagement d'angle — LOI : padding ≥ 0,293 × R ═════════ */
  var f3 = [], n3 = 0;
  pures.forEach(function(el){
    var s = cs(el), r = rad(el); if (r <= 0.5) return;
    var pt = px(s.paddingTop), pl = px(s.paddingLeft);
    if (pt <= 0.5 && pl <= 0.5) return;             /* plein cadre : autre régime */
    var p = Math.min(pt || pl, pl || pt);
    n3++;
    var mini = 0.2929 * r;
    if (p < mini - 0.6)
      f3.push(faute(el, 'R ' + Math.round(r) + ' → padding minimum ' + r1(mini) + ', posé ' + Math.round(p),
        'le contenu entre dans l\'arc'));
  });
  I.i3 = { total: n3, fautes: f3 };

  /* ═══ i4 · saturation — LOI : r ≤ moitié du petit côté ════════════ */
  var f4 = [], n4 = 0;
  pures.forEach(function(el){
    var r = rad(el); if (r <= 0.5) return;
    var b = rc(el); n4++;
    var max = Math.min(b.width, b.height) / 2;
    if (r > max + 0.6)
      f4.push(faute(el, 'rayon ' + Math.round(r) + ' > moitié du petit côté (' + Math.round(max) + ')',
        'la surface devient une pilule sans l\'avoir demandé'));
  });
  I.i4 = { total: n4, fautes: f4 };

  /* ═══ i2 · chaîne des rayons — CONVENTION : r(n) = r(n−1) / 2 ═════ */
  var f2 = [], n2 = 0;
  duos.forEach(function(d){
    var rp = rad(d[0]), re = rad(d[1]);
    if (rp <= 0.5) return;
    n2++;
    var att = rp / 2;
    if (Math.abs(re - att) > Math.max(1.2, att * 0.18))
      f2.push(faute(d[1], 'parent ' + Math.round(rp) + ' → attendu ' + r1(att) + ', posé ' + Math.round(re),
        re > att ? 'chaîne rompue vers le haut' : 'chaîne rompue vers le bas'));
  });
  I.i2 = { total: n2, fautes: f2 };

  /* ═══ i5 · chaîne des paddings — CONVENTION : un seul diviseur ════
     Le diviseur n'est pas imposé : il est INFÉRÉ de la page (2, √2, φ…).
     Un système est conforme s'il n'en a qu'un.                        */
  var rap = [], paires = [];
  duos.forEach(function(d){
    var pp = px(cs(d[0]).paddingTop), pe = px(cs(d[1]).paddingTop);
    if (pp <= 1 || pe <= 1) return;
    paires.push([d[0], d[1], pp, pe]); rap.push(pp / pe);
  });
  function modeArr(a, prec){
    if (!a.length) return null;
    var m = {}, best = null;
    a.forEach(function(v){ var k = (Math.round(v * prec) / prec).toFixed(2);
      m[k] = (m[k] || 0) + 1; if (best === null || m[k] > m[best]) best = k; });
    return { val: +best, n: m[best], tot: a.length };
  }
  var Q = modeArr(rap, 20);
  var f5 = [];
  if (Q) paires.forEach(function(t){
    var att = t[2] / Q.val;
    if (Math.abs(t[3] - att) > Math.max(1.2, att * 0.16))
      f5.push(faute(t[1], 'parent ' + Math.round(t[2]) + ' ÷ ' + Q.val + ' → attendu ' + r1(att) +
        ', posé ' + Math.round(t[3])));
  });
  I.i5 = { total: paires.length, fautes: f5, q: Q ? Q.val : null,
           accord: Q ? Q.n + ' / ' + Q.tot : null };

  /* ═══ i6 · gap intérieur — CONVENTION : gap = padding / 2 ═════════ */
  var f6 = [], n6 = 0;
  pures.forEach(function(el){
    var s = cs(el), p = px(s.paddingTop);
    var g = Math.max(px(s.rowGap), px(s.columnGap));
    if (p <= 1 || g <= 0.5) return;
    if (s.display.indexOf('flex') < 0 && s.display.indexOf('grid') < 0) return;
    n6++;
    var att = p / 2;
    if (Math.abs(g - att) > Math.max(1.2, att * 0.2))
      f6.push(faute(el, 'padding ' + Math.round(p) + ' → gap attendu ' + r1(att) + ', posé ' + Math.round(g)));
  });
  I.i6 = { total: n6, fautes: f6 };

  /* ═══ i7 · frontière — CONVENTION : une frontière par étage et par axe ═
     La valeur n'est pas imposée (elle dépend de la densité) ; ce qui est
     imposé, c'est qu'à un étage donné toutes les frontières se vaillent.
     C'est exactement la faute qui avait échappé : des cartes de même rang
     séparées tantôt de 12, tantôt de 24.                                  */
  var fro = {}, n7 = 0;
  tous.forEach(function(par){
    /* on ne compare que des sœurs VOISINES : si un titre ou un paragraphe
       s'intercale, l'espace mesuré n'est pas une frontière entre surfaces. */
    var ch = [].slice.call(par.children).filter(function(e){
      var s = cs(e); if (s.display === 'none' || s.position === 'absolute' || s.position === 'fixed') return false;
      var r = rc(e); return r.width > 2 && r.height > 2;
    });
    if (ch.length < 2) return;
    for (var i = 1; i < ch.length; i++){
      if (!setP.has(ch[i-1]) || !setP.has(ch[i])) continue;
      var a = rc(ch[i-1]), b = rc(ch[i]), g = null, axe = null;
      if (b.y >= a.y + a.height - 1.5){ g = b.y - (a.y + a.height); axe = 'vertical'; }
      else if (b.x >= a.x + a.width - 1.5){ g = b.x - (a.x + a.width); axe = 'horizontal'; }
      if (g === null || g < 0 || g > 90) continue;
      var k = etage(ch[i]) + '|' + axe;
      (fro[k] = fro[k] || { vals: {}, ex: {} });
      var v = Math.round(g);
      fro[k].vals[v] = (fro[k].vals[v] || 0) + 1;
      if (!fro[k].ex[v]) fro[k].ex[v] = ch[i];
      n7++;
    }
  });
  var f7 = [], tabFro = [];
  Object.keys(fro).sort().forEach(function(k){
    var vs = Object.keys(fro[k].vals).map(Number).sort(function(a,b){ return fro[k].vals[b] - fro[k].vals[a]; });
    var p = k.split('|');
    tabFro.push({ etage: +p[0], axe: p[1],
      detail: vs.map(function(v){ return v + ' px ×' + fro[k].vals[v]; }).join(' · ') });
    if (vs.length < 2) return;
    var dom = vs[0];
    vs.slice(1).forEach(function(v){
      if (Math.abs(v - dom) <= 1.5) return;
      f7.push(faute(fro[k].ex[v], 'étage ' + p[0] + ', axe ' + p[1] + ' : dominante ' + dom +
        ' px, mais ' + fro[k].vals[v] + ' frontière(s) à ' + v + ' px',
        'deux frontières de même rang ne se valent pas'));
    });
  });
  I.i7 = { total: n7, fautes: f7, table: tabFro };

  /* ═══ i8 · un niveau, un rôle — CONVENTION : une famille par étage ═ */
  var etages = {};
  pures.forEach(function(el){
    var n = etage(el), b = cs(el).backgroundColor;
    (etages[n] = etages[n] || {})[b] = (etages[n][b] || 0) + 1;
  });
  var f8 = [];
  Object.keys(etages).forEach(function(n){
    var t = Object.keys(etages[n]).sort(function(a,b){ return etages[n][b] - etages[n][a]; });
    var lourdes = t.filter(function(c){ return etages[n][c] >= 2; });
    if (lourdes.length > 2)
      f8.push(note('étage ' + n, lourdes.length + ' teintes de fond employées plusieurs fois — ' +
        lourdes.slice(0, 5).map(function(c){ return c + ' ×' + etages[n][c]; }).join(', ')));
  });
  I.i8 = { total: Object.keys(etages).length, fautes: f8, etages: etages };


  /* ═══ i9 · la géométrie en rem — HYGIÈNE ═════════════════════════
     On ne condamne pas le pixel : on condamne le pixel là où il porte
     la MESURE. Un filet, une ombre, une transformation sont du rendu —
     ils restent en px sans dommage. Un padding, un rayon, une taille de
     texte sont de la géométrie : en px, ils cessent de suivre le réglage
     de l'utilisateur et la page casse au premier zoom système.          */
  var GEO = /^(--|padding|margin|gap|row-gap|column-gap|border-radius|border-(top|bottom)-(left|right)-radius|font$|font-size|line-height|width|height|min-width|min-height|max-width|max-height|top$|right$|bottom$|left$|inset|flex$|flex-basis|text-indent|scroll-margin|scroll-padding|translate$|column-width)/;
  var f9 = [], tolere = 0, tot9 = 0, mq = [];
  var PXV = /(-?\d*\.?\d+)px/g;

  function repere(sel){
    if (!sel) return 0;
    var net = sel.split(',')[0].replace(/::?[a-z-]+(\([^)]*\))?/g, '').trim();
    if (!net) return 0;
    try { var e = doc.querySelector(net); if (e && e !== doc.body && e !== doc.documentElement) return marque(e); }
    catch(x){}
    return 0;
  }
  function lireDecl(style, sel, ou){
    for (var i = 0; i < style.length; i++){
      var prop = style[i], val = style.getPropertyValue(prop);
      if (!val || val.indexOf('px') < 0) continue;
      var vs = [], m; PXV.lastIndex = 0;
      while ((m = PXV.exec(val))) vs.push(Math.abs(parseFloat(m[1])));
      if (!vs.length) continue;
      tot9++;
      var durs = vs.filter(function(v){ return v !== 0 && v !== 1; });
      if (!durs.length) continue;                       /* 0 et 1 px : filets, tolérés */
      if (!GEO.test(prop)){ tolere++; continue; }       /* rendu, pas mesure */
      f9.push({ el: sel || 'style=""', i: repere(sel),
                dit: prop + ' : ' + (val.length > 60 ? val.slice(0,60) + '…' : val),
                sens: ou || '' });
    }
  }
  function lireRegles(regles, ou){
    for (var i = 0; i < regles.length; i++){
      var r = regles[i];
      if (r.media && r.cssRules){
        var c = r.conditionText || r.media.mediaText || '';
        if (/\d+px/.test(c)) mq.push(c);
        lireRegles(r.cssRules, '@media ' + c);
      } else if (r.cssRules){ lireRegles(r.cssRules, ou); }
      else if (r.style){ lireDecl(r.style, r.selectorText, ou); }
    }
  }
  for (var si = 0; si < doc.styleSheets.length; si++){
    try { lireRegles(doc.styleSheets[si].cssRules, ''); } catch(x){}   /* feuille distante : inaccessible */
  }
  [].slice.call(doc.querySelectorAll('[style]')).forEach(function(e){
    if (e.closest && e.closest('svg')) return;
    var sel = nom(e);
    for (var i = 0; i < e.style.length; i++){
      var prop = e.style[i], val = e.style.getPropertyValue(prop);
      if (!val || val.indexOf('px') < 0) continue;
      var vs = [], m; PXV.lastIndex = 0;
      while ((m = PXV.exec(val))) vs.push(Math.abs(parseFloat(m[1])));
      if (!vs.length) continue;
      tot9++;
      var durs = vs.filter(function(v){ return v !== 0 && v !== 1; });
      if (!durs.length) continue;
      if (!GEO.test(prop)){ tolere++; continue; }
      f9.push({ el: sel, i: marque(e), dit: prop + ' : ' + val, sens: 'attribut style' });
    }
  });
  mq = mq.filter(function(v, i, a){ return a.indexOf(v) === i; });
  mq.forEach(function(c){
    f9.push({ el: '@media', i: 0, dit: c, sens: 'un point de rupture se déclare en em, pas en px' });
  });
  I.i9 = { total: tot9, fautes: f9, tolere: tolere, mq: mq.length };


  /* ═══ garde-fou — la mesure vaut ce que vaut le rendu ══════════════
     Une page dont le CSS n'a pas été chargé se mesure « conforme » alors
     qu'elle n'a aucune géométrie. On refuse de conclure plutôt que de
     rendre un verdict vert sur du vide.                                */
  var G = [], nFeuilles = doc.styleSheets.length, nRegles = 0, nLisibles = 0;
  for (var gi = 0; gi < nFeuilles; gi++){
    try { nRegles += doc.styleSheets[gi].cssRules.length; nLisibles++; } catch(x){}
  }
  var liens = [].slice.call(doc.querySelectorAll('link[rel~="stylesheet"]'));
  var casses = liens.filter(function(l){ return !l.sheet; });
  if (nRegles === 0 && !liens.length)
    G.push({ n:'grave', t:'Aucune feuille de style n\'est appliquée — la page est nue, la mesure n\'a pas de sens.' });
  var relatifs = liens.filter(function(l){
    var h = l.getAttribute('href') || '';
    return h && !/^(https?:)?\/\//i.test(h) && !/^data:/i.test(h);
  });
  if (relatifs.length && nRegles === 0)
    G.push({ n:'grave', t:relatifs.length + ' feuille(s) de style en chemin relatif (' +
      (relatifs[0].getAttribute('href') || '') + ') — hors de leur site, elles ne se résolvent pas. ' +
      'Colle la page avec son CSS en ligne, ou lance l\'audit depuis le site lui-même.' });
  if (casses.length)
    G.push({ n:'grave', t:casses.length + ' feuille(s) externe(s) n\'ont pas pu être chargées' +
      (casses[0].getAttribute('href') ? ' (' + casses[0].getAttribute('href') + '…)' : '') +
      ' — les chemins relatifs ne se résolvent pas hors de leur site.' });
  if (nRegles > 0 && nLisibles < nFeuilles - casses.length)
    G.push({ n:'avert', t:(nFeuilles - casses.length - nLisibles) + ' feuille(s) d\'une autre origine sont appliquées mais illisibles — i9 ne les voit pas.' });
  if (pures.length < 2)
    G.push({ n:'grave', t:'Presque aucune surface peinte n\'a été trouvée : soit la page n\'a pas de style, soit elle n\'a pas de géométrie à vérifier.' });

  return { garde: G, inv: I, surfaces: pures.length, peintes: brut.length,
           canevas: canevas.length, controles: surfaces.length - pures.length,
           etages: Object.keys(etages).length,
           css: { feuilles: nFeuilles, regles: nRegles, lisibles: nLisibles, casses: casses.length } };
}
`;

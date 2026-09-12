/* LES FIXTURES PIÉGÉES ET LEURS MUTATIONS — kit/tests/fixtures/voisins/mutations.mjs
   Chaque cas a sa fixture piégée (elle passe, mais de justesse, et sur le contenu — jamais sur
   la boîte) et au moins une mutation : une feuille injectée après le rendu qui doit faire rougir
   EXACTEMENT le cas visé. verify.mjs rejoue cette liste avant de juger quoi que ce soit ; une
   mutation qui ne rougit pas, ou qui rougit un autre cas, vaut refus de statuer. */
export const MUTATIONS = [
  /* a · la rangée se ferme */
  { file: 'OK-a-la-rangee-se-ferme.html', name: 'telle quelle (demi-ligne d\'écart, sur le contenu)', css: null, expect: [] },
  { file: 'OK-a-la-rangee-se-ferme.html', name: 'l\'image ne remplit plus (height: auto) — son bas remonte de plusieurs lignes', css: '.media img { height: auto !important; }', expect: ['close'] },
  { file: 'OK-a-la-rangee-se-ferme.html', name: 'le texte s\'arrête trois lignes plus haut (un paragraphe masqué)', css: '.text p:last-of-type { display: none !important; }', expect: ['close'] },
  /* b · la rangée se solde */
  { file: 'OK-b-la-rangee-se-solde.html', name: 'telle quelle (6 · 6 · 8 lignes, rapport 1,35)', css: null, expect: [] },
  { file: 'OK-b-la-rangee-se-solde.html', name: 'la longue double son interligne — rapport 2,8', css: '.c3 p { line-height: 3 !important; }', expect: ['balance'] },
  { file: 'OK-b-la-rangee-se-solde.html', name: 'la courte perd deux lignes (largeur de colonne) — rapport > 1,5', css: '.c1 p { font-size: 11px !important; }', expect: ['balance'] },
  /* c · le contrôle n'est pas étiré */
  { file: 'OK-c-le-controle-n-est-pas-etire.html', name: 'tel quel (plancher 44 px : une cible, pas un étirement)', css: null, expect: [] },
  { file: 'OK-c-le-controle-n-est-pas-etire.html', name: 'le conteneur étire ses enfants — le bouton prend la hauteur du bloc', css: '.row { align-items: stretch !important; }', expect: ['control'] },
  /* d · le filet */
  { file: 'OK-d-le-filet-a-la-meme-place.html', name: 'tel quel (24 au-dessus, 40 au-dessous : moins d\'une ligne d\'écart)', css: null, expect: [] },
  { file: 'OK-d-le-filet-a-la-meme-place.html', name: 'le filet s\'éloigne du paragraphe du dessous (96 px)', css: 'hr { margin-bottom: 96px !important; }', expect: ['separator'] },
  { file: 'OK-d-le-filet-a-la-meme-place.html', name: 'le filet colle au paragraphe du dessus (0) et garde 40 dessous', css: 'hr { margin-top: 0 !important; }', expect: ['separator'] },
]

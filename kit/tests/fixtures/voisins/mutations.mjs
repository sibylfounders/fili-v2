/* LES FIXTURES PIÉGÉES ET LEURS MUTATIONS — kit/tests/fixtures/voisins/mutations.mjs
   Chaque cas a sa fixture piégée (elle passe, mais de justesse, et sur le contenu — jamais sur
   la boîte) et au moins une mutation : une feuille injectée après le rendu qui doit faire rougir
   EXACTEMENT le cas visé. verify.mjs rejoue cette liste avant de juger quoi que ce soit ; une
   mutation qui ne rougit pas, ou qui rougit un autre cas, vaut refus de statuer.

   LA RÈGLE DE CETTE LISTE (12 septembre 2026) : une mutation doit franchir le seuil par au
   moins trois lignes, et par une quantité qu'elle pose elle-même — jamais par une quantité
   que le rendu du texte décide. Une mutation qui ne tient qu'à quelques pixels ne prouve
   rien : elle dit la police de la machine, pas la loi, et elle se retourne au vert ailleurs.
   verify.mjs mesure cette marge et la dit ; sous trois lignes, il refuse de statuer. */
export const MUTATIONS = [
  /* a · la rangée se ferme */
  { file: 'OK-a-la-rangee-se-ferme.html', name: 'telle quelle (demi-ligne d\'écart, sur le contenu)', css: null, expect: [] },
  { file: 'OK-a-la-rangee-se-ferme.html', name: 'l\'image ne remplit plus (height: auto) — son bas remonte de plusieurs lignes', css: '.media img { height: auto !important; }', expect: ['close'] },
  /* l'autre sens : l'élastique ne s'arrête pas court, il court trop loin. La marge est posée
     ici (96 px = quatre lignes), elle ne dépend d'aucun rendu de texte. Elle remplace le
     paragraphe masqué du 11 septembre : celui-là ne rougissait que de 2,5 px — l'image étant
     élastique, elle suivait le texte et la rangée se refermait ; ce qui rougissait n'était pas
     la faute visée mais le demi-pas de la fixture. */
  { file: 'OK-a-la-rangee-se-ferme.html', name: 'l\'image court quatre lignes sous le texte (une marge posée sous le dernier paragraphe)', css: '.text p:last-of-type { margin-bottom: 96px !important; }', expect: ['close'] },
  /* b · la rangée se solde */
  { file: 'OK-b-la-rangee-se-solde.html', name: 'telle quelle (6 · 6 · 8 lignes, rapport 1,35)', css: null, expect: [] },
  { file: 'OK-b-la-rangee-se-solde.html', name: 'la longue double son interligne — rapport 2,8', css: '.c3 p { line-height: 3 !important; }', expect: ['balance'] },
  /* la courte tombe à une seule ligne : ce qui reste ne dépend plus du nombre de lignes que la
     police décide, mais d'une ligne, et d'une seule. Le 11 septembre, « font-size: 11px » ne
     prenait que 2,8 lignes sur le seuil chez l'Auteur (3,9 ailleurs) : la même mutation disait
     rouge ici et vert là (12 septembre 2026). */
  { file: 'OK-b-la-rangee-se-solde.html', name: 'la courte ne fait plus qu\'une ligne (elle ne revient pas à la ligne)', css: '.c1 p { white-space: nowrap !important; overflow: hidden !important; }', expect: ['balance'] },
  /* c · le contrôle n'est pas étiré */
  { file: 'OK-c-le-controle-n-est-pas-etire.html', name: 'tel quel (plancher 44 px : une cible, pas un étirement)', css: null, expect: [] },
  { file: 'OK-c-le-controle-n-est-pas-etire.html', name: 'le conteneur étire ses enfants — le bouton prend la hauteur du bloc', css: '.row { align-items: stretch !important; }', expect: ['control'] },
  /* d · le filet */
  { file: 'OK-d-le-filet-a-la-meme-place.html', name: 'tel quel (24 au-dessus, 40 au-dessous : moins d\'une ligne d\'écart)', css: null, expect: [] },
  /* les deux sens du même déport, chacun posé à 160 px — six lignes et demie d'écart : aucune
     police ne rattrape ça. Le 11 septembre, 96 px puis « margin-top: 0 » ne prenaient que 1,9
     et 0,6 ligne sur le seuil : ces deux-là ne rougissaient que par les quelques pixels que la
     boîte d'un paragraphe met autour de son texte (12 septembre 2026). */
  { file: 'OK-d-le-filet-a-la-meme-place.html', name: 'le filet s\'éloigne du paragraphe du dessous (160 px) — il appartient à ce qui le précède', css: 'hr { margin-bottom: 160px !important; }', expect: ['separator'] },
  { file: 'OK-d-le-filet-a-la-meme-place.html', name: 'le filet s\'éloigne du paragraphe du dessus (160 px) — il appartient à ce qui le suit', css: 'hr { margin-top: 160px !important; }', expect: ['separator'] },
]

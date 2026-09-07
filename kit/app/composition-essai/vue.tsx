"use client";
import { useState } from "react";
import { RailDoc, useDocSections, type Sommaire } from "../rail";
import { Bandes, Bande, ListeRegles } from "../etages";
import type { LigneListe } from "../etages";

/* ═══════════════════════════════════════════════════════════════════════
   PAGE D'ESSAI — LA COMPOSITION (3 septembre 2026)

   Le bas de /composition manquait de matière : une seule table de quinze
   lois là où les autres pages ont un étage en bandes. On le met au point
   ici avant de le verser, comme on l'a fait pour le moteur.

   L'OBJET (verdict d'Auteur, 3 septembre) : une fausse page DU KIT, à
   l'image de Rythme. La composition ne se juge qu'à l'échelle d'une page
   entière — une carte isolée ne montre rien. Et la page qu'on a tous
   sous les yeux est le meilleur objet possible : on la casse, on se
   reconnaît.

   LES BANDES ne rejouent AUCUNE des cinq fautes de la preuve 01 (deux
   dominants, tout cloisonné, écarts égaux, quatre axes, rupture partout).
   Elles prennent les lois que la page ne montrait nulle part — dont la
   grille, jusqu'ici marquée « à venir » dans le fonds.
   ═══════════════════════════════════════════════════════════════════════ */

const SOMMAIRE: Sommaire = [
  ["page", "01", "La page"],
  ["bandes", "02", "Ce qui se voit"],
  ["liste", "03", "Ce qu'aucune image ne prouve"],
];

/* ── L'objet : une page du kit en réduction ───────────────────────────
   Elle n'imite pas /rythme au pixel : elle en garde les organes, ceux
   que toute page de doc possède — un rail, un titre, un chapô, des
   sections qui portent chacune une scène, sa cote et sa profondeur.
   La faute arrive par une classe sur la racine : elle est commise pour
   de vrai sur ces organes, jamais dessinée par-dessus. ── */
function Bloc({ n, titre, dit, cote, etat, faute }: {
  n: string; titre: string; dit: string; cote: string; etat: string; faute: string;
}) {
  const sosies = faute === "f-sosies";
  const pied = (
    <>
      <span className="ce-leg">{cote}</span>
      <span className="ce-etat">{etat}</span>
    </>
  );
  return (
    <div className="ce-sec">
      <p className="ce-kick">{n}</p>
      <p className="ce-h2">{titre}</p>
      <p className="ce-sourd">{dit}</p>
      <div className="ce-scene"><i /><i /><i /></div>
      {/* La commande vit seule, à l'écart de la file des cotes. Sous la
          faute « sosies », elle va se ranger au milieu d'elles. */}
      <div className="ce-pied">{sosies ? <>{pied}<span className="ce-cmd">Casser</span></> : pied}</div>
      {!sosies && <span className="ce-cmd">Casser</span>}
      <span className="ce-prov">Règles &amp; sources</span>
    </div>
  );
}

function PageKit({ faute = "" }: { faute?: string }) {
  return (
    <div className={`ce-page ${faute}`} aria-hidden="true">
      <div className="ce-rail">
        <b>Le rythme</b>
        <span className="ce-r-li on">01 · La chaîne</span>
        <span className="ce-r-li">02 · La densité</span>
        <span className="ce-r-li">03 · La profondeur</span>
      </div>
      <div className="ce-corps">
        <p className="ce-kick">Le rythme (espacement)</p>
        <p className="ce-h1">Rien ici n&apos;a été espacé à l&apos;œil</p>
        <p className="ce-chapo">Posez deux cards côte à côte. Si le texte de l&apos;une se retrouve
          plus près du bord de l&apos;autre que du sien, votre œil le rattache à la mauvaise card.</p>
        <Bloc n="01 · La chaîne" titre="Chaque distance vient d'une seule échelle"
          dit="Du container à la card puis à la row, chaque espace descend du même nombre."
          cote="pad 24 · gap 17 · r 16" etat="Ça tient" faute={faute} />
        <Bloc n="02 · La densité" titre="Trois densités, aucune valeur nouvelle"
          dit="Aéré, confortable, compact : la base bouge d'un cran, la chaîne suit."
          cote="base 24 → 16" etat="Ça tient" faute={faute} />
      </div>
    </div>
  );
}

/* ── Les cinq lois que la page ne montrait nulle part ─────────────────
   Chacune casse un organe différent de la fausse page : le costume, la
   place, le filet, l'emballage, la colonne. ── */
const LISTE: LigneListe[] = [
  { nom: "Proximité", ton: "code",
    dit: "ce qui est proche est perçu comme lié — l'écart fait le groupe avant toute surface",
    ou: <>Le rythme — c&apos;est l&apos;échelle des espaces qui la tient</> },
  { nom: "Dedans plus serré que dehors", ton: "code",
    dit: "l'écart interne d'un groupe ne dépasse jamais celui qui le sépare du groupe voisin",
    ou: <>Le rythme — deux crans de la même chaîne</> },
  { nom: "Hiérarchie par combinaison", ton: "code",
    dit: "corps, graisse, couleur, position : un rang se dit par plusieurs signes, jamais par la taille seule",
    ou: <>La typographie — l&apos;échelle et ses graisses</> },
  { nom: "Mesure de lecture", ton: "rendu",
    dit: "sept à dix mots par ligne : au-delà, l'œil perd le début de la ligne suivante",
    ou: <>La typographie — mesurée sur le rendu, pas déclarée</> },
  { nom: "Rôles d'espace nommés", ton: "code",
    dit: "retrait, empilement, alignement, gouttière : quatre rôles, quatre crans, jamais un écart passe-partout",
    ou: <>Le code — un rôle sans nom se règle à l&apos;œil</> },
];

export default function Vue() {
  const actifId = useDocSections("page");
  const [costume, setCostume] = useState(false);
  const [sosies, setSosies] = useState(false);
  const [trait, setTrait] = useState(false);
  const [embal, setEmbal] = useState(false);
  const [grille, setGrille] = useState(false);

  return (
    <div className="gdoc-fond">
      <div className="gdoc">
        <RailDoc page="composition-essai" titre="Essai · Composition" sommaire={SOMMAIRE}
          actifId={actifId} pied="Banc d'essai — rien d'ici n'est encore versé" />

        <main className="gdoc-contenu" id="contenu">

          <section className="gdoc-heros">
            <p className="kicker">Essai · La composition</p>
            <h1>On casse la page que vous êtes en train de lire<span className="point" aria-hidden="true" /></h1>
            <p className="chapo">Une carte isolée ne dit rien de la composition : il faut une page
            entière, avec son rail, son titre, ses sections et leurs cotes. Alors autant prendre
            celle qu&apos;on a sous les yeux.</p>
          </section>

          <section className="gdoc-sec pose" id="page">
            <div className="gdoc-sec-tete">
              <p className="kicker">01 · La page</p>
              <h2>Une page du kit, en réduction</h2>
            </div>
            <div className="gdoc-corps">
              <div className="ce-banc"><PageKit /></div>
              <span className="gd-legende">un dominant · trois groupes faits par le blanc · un seul axe de départ</span>
            </div>
          </section>

          <section className="gdoc-sec pose" id="bandes">
            <div className="gdoc-sec-tete">
              <p className="kicker">02 · Ce qui se voit</p>
              <h2>Voyez ce qui se passe quand la loi saute</h2>
              <p className="sourd">Le bouton « Casser » ne dessine pas la faute, il la commet pour
              de vrai sur la page — puis la répare.</p>
            </div>
            <div className="gdoc-corps">
              <Bandes>
                <Bande nom="Un costume, un rôle" cote="deux rôles, un seul costume"
                  dit="La cote d'une scène constate, le bouton agit. Donnez-leur le même costume et le lecteur clique sur la cote — puis cesse de croire aux boutons de la page. Un costume visuel n'est pas une décoration : c'est une promesse d'usage."
                  casse={costume} surCasse={setCostume} nue>
                  <PageKit faute={costume ? "f-costume" : ""} />
                </Bande>
                <Bande nom="Noyé parmi ses sosies" cote="rangée avec ce qui lui ressemble"
                  dit="La commande gardait son costume : on l'a seulement rangée au milieu des cotes, à leur hauteur et à leur taille. Elle cesse d'être vue pour ce qu'elle est. La proximité ne fait pas que lier — posée contre ses sosies, une chose perd son rang."
                  casse={sosies} surCasse={setSosies} nue>
                  <PageKit faute={sosies ? "f-sosies" : ""} />
                </Bande>
                <Bande nom="Le trait bat l'écart" cote="un filet contre douze pixels"
                  dit="La cote appartenait à sa scène par le seul espace. Un filet posé entre les deux, et elle bascule : l'œil suit le trait, jamais l'écart. C'est pour ça qu'un séparateur ne se pose pas pour faire joli — il déplace un groupe."
                  casse={trait} surCasse={setTrait} nue>
                  <PageKit faute={trait ? "f-trait" : ""} />
                </Bande>
                <Bande nom="L'emballage prend le pas" cote="on lit la boîte, plus le contenu"
                  dit="Double filet, ombre portée, coin coupé : rien n'a changé dans la scène, tout a changé dans ce qu'on en voit. L'œil garde la forme la plus simple qu'on lui donne — s'il doit d'abord démêler un emballage, il ne regarde plus ce qu'il y a dedans."
                  casse={embal} surCasse={setEmbal} nue>
                  <PageKit faute={embal ? "f-embal" : ""} />
                </Bande>
                <Bande nom="La colonne qui n'en est plus une" cote="trois bords droits différents"
                  dit="Le chapô, la scène et la cote sortaient sur la même verticale à droite comme à gauche. Élargissez chacun d'un peu, personne ne remarque une faute — et la page n'a plus de bord. Une grille ne se voit jamais : elle ne se remarque qu'absente."
                  casse={grille} surCasse={setGrille} nue>
                  <PageKit faute={grille ? "f-grille" : ""} />
                </Bande>
              </Bandes>
            </div>
          </section>

          <section className="gdoc-sec pose" id="liste">
            <div className="gdoc-sec-tete">
              <p className="kicker">03 · Ce qu&apos;aucune image ne prouve</p>
              <h2>Elles se vérifient ailleurs — et on vous dit où</h2>
              <p className="sourd">La composition n&apos;a pas de matière à elle : elle dépense
              celle des autres familles. Ces lois-là vivent donc chez elles.</p>
            </div>
            <div className="gdoc-corps">
              <ListeRegles lignes={LISTE} />
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

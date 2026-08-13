'use strict';
/**
 * tools/plugin/zip.js — archive zip en Node pur (zlib de la stdlib, aucune dépendance).
 *
 * Le binaire `zip` n'est pas garanti sur toutes les machines qui lancent le build (il manque
 * notamment dans le bac à sable Linux de Cowork) : la fabrication du paquet ne peut pas en
 * dépendre. Format : zip classique, entrées deflate, sans Zip64 (le paquet pèse ~150 Ko).
 *
 * ecritZip(destination, [{ nom, donnees }]) → écrit l'archive.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const TABLE_CRC = (() => {
  const t = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) c = TABLE_CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return ~c >>> 0;
}

/** Date MS-DOS fixe (1980-01-01) : le paquet est reproductible, deux builds identiques donnent le même octet. */
const DATE_DOS = 0x0021;
const HEURE_DOS = 0x0000;

function ecritZip(destination, entrees) {
  const locaux = [];
  const centraux = [];
  let offset = 0;

  for (const { nom, donnees } of entrees) {
    const nomBuf = Buffer.from(nom, 'utf8');
    const compresse = zlib.deflateRawSync(donnees, { level: 9 });
    const crc = crc32(donnees);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);            // version nécessaire
    local.writeUInt16LE(0x0800, 6);        // drapeau : noms en UTF-8
    local.writeUInt16LE(8, 8);             // méthode : deflate
    local.writeUInt16LE(HEURE_DOS, 10);
    local.writeUInt16LE(DATE_DOS, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compresse.length, 18);
    local.writeUInt32LE(donnees.length, 22);
    local.writeUInt16LE(nomBuf.length, 26);
    local.writeUInt16LE(0, 28);
    locaux.push(local, nomBuf, compresse);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);          // version d'origine
    central.writeUInt16LE(20, 6);          // version nécessaire
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(HEURE_DOS, 12);
    central.writeUInt16LE(DATE_DOS, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(compresse.length, 20);
    central.writeUInt32LE(donnees.length, 24);
    central.writeUInt16LE(nomBuf.length, 28);
    central.writeUInt32LE(0, 38);          // attributs externes
    central.writeUInt32LE(offset, 42);
    centraux.push(central, nomBuf);

    offset += local.length + nomBuf.length + compresse.length;
  }

  const repertoire = Buffer.concat(centraux);
  const fin = Buffer.alloc(22);
  fin.writeUInt32LE(0x06054b50, 0);
  fin.writeUInt16LE(entrees.length, 8);
  fin.writeUInt16LE(entrees.length, 10);
  fin.writeUInt32LE(repertoire.length, 12);
  fin.writeUInt32LE(offset, 16);

  fs.writeFileSync(destination, Buffer.concat([...locaux, repertoire, fin]));
}

/** Liste récursivement un dossier en entrées zip (chemins relatifs, séparateur `/`). */
function entreesDuDossier(racine, ignore = /\.DS_Store$/) {
  const sortie = [];
  (function parcours(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const complet = path.join(dir, e.name);
      if (ignore.test(e.name)) continue;
      if (e.isDirectory()) parcours(complet);
      else sortie.push({ nom: path.relative(racine, complet).split(path.sep).join('/'), donnees: fs.readFileSync(complet) });
    }
  })(racine);
  return sortie;
}

module.exports = { ecritZip, entreesDuDossier };

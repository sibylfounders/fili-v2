# Protocole d'audit v1.0.0

Ce document doit être copié ou référencé par empreinte dans le manifeste **avant** l'ouverture du corpus à observer.

## 1. Séparation des phases

1. **Pré-enregistrement** : question, périmètre, critères de sélection, statuts et échelle de confiance.
2. **Collecte** : captures et transcription sans charger les règles détaillées.
3. **Gel des observations** : empreinte des preuves et du fichier `observations.json`.
4. **Audit témoin** : revue sans Design System MD, réalisée ou explicitement marquée `not_run`.
5. **Confrontation** : chargement de l'instantané des règles, puis création des findings.
6. **Comparaison** : apports incrémentaux, confirmations, questions et faux positifs.

Une étude sans phases 1 à 4 peut explorer le format, mais ne peut pas prouver la plus-value du référentiel.

## 2. Unités de preuve

### Fait observé

Description directement visible ou lisible dans une pièce identifiée. Un fait référence au moins un `evidence_id`.

### Inférence

Interprétation plausible mais non directement visible. Elle est séparée des faits et porte une confiance.

### Non observable

Élément impossible à vérifier avec le média disponible : serveur, lecteur d'écran, clavier, persistance, variante absente, etc.

L'absence dans une pellicule n'est jamais la preuve de l'absence dans le produit.

## 3. Statuts d'un finding

- `observed_conforming` : les faits visibles satisfont la portion testée de la règle.
- `partial` : certains aspects sont conformes, d'autres en tension ou inconnus.
- `contradicted` : un fait observable contredit une règle établie.
- `tension` : écart à discuter, règle émergente ou contexte métier déterminant.
- `not_applicable` : la règle n'est pas déclenchée par le cas.
- `not_observable` : le corpus ne permet pas de conclure.

## 4. Confiance

- `high` : preuve directe lisible, règle établie, correspondance non ambiguë.
- `medium` : transcription fiable ou correspondance nécessitant un contexte limité.
- `low` : preuve absente, inférence, règle émergente ou contexte déterminant.

La confiance finale ne peut jamais dépasser la plus faible des confiances de preuve, de règle et de correspondance.

## 5. Plus-value

La plus-value n'est pas un nombre auto-déclaré. Elle est établie par comparaison avec un audit témoin gelé avant chargement des règles.

Pour chaque finding :

- `baseline_found` : déjà détecté sans le référentiel ;
- `reference_added` : ajouté ou substantiellement précisé par le référentiel ;
- `reference_question` : question de vérification nouvelle mais non résolue ;
- `reference_false_positive` : conclusion produite à tort ou avec une confiance excessive.

Sans audit témoin, l'étude peut décrire des **apports plausibles**, mais ne peut pas annoncer « N constats propres au référentiel ».

## 6. Conditions d'arrêt humain

Arrêter ou demander un arbitrage si :

- la preuve manque ;
- le contexte métier change la décision ;
- une règle est émergente ou divergente ;
- un constat exige une vérification juridique, sécurité ou accessibilité vécue ;
- une recommandation transformerait une hypothèse en prescription produit.

## 7. Publication

Les captures de services tiers restent privées par défaut. Le site public peut publier leur identifiant, une transcription et des représentations dérivées autorisées, mais jamais la pièce originale sans autorisation.

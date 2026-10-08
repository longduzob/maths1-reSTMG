# Maths · Première STMG

Site pédagogique en français, en HTML/CSS/JavaScript statiques.

**[Ouvrir le site de maths](https://parzival733.github.io/maths1-reSTMG/)**  
**[Consulter les leçons](https://parzival733.github.io/maths1-reSTMG/lecons.html)**  
**[Faire les exercices interactifs](https://parzival733.github.io/maths1-reSTMG/exercices.html)**

Dépôt GitHub : [parzival733/maths1-reSTMG](https://github.com/parzival733/maths1-reSTMG).

## Programme de référence

Programme de première technologique applicable en **2026–2027**, pour STMG : arrêté du 26 février 2026, BO n° 14 du 2 avril 2026, NOR MENE2602918A.

Source principale : https://www.education.gouv.fr/bo/2026/Hebdo14/MENE2602918A

`programme.html` relie les contenus officiels aux cours et documente les choix de périmètre. Les leçons sont des rédactions pédagogiques originales ; il ne s'agit pas de cours certifiés par le ministère. Les activités géométriques propres à STD2A sont exclues du parcours STMG.

## Contenu

**11 chapitres développés** : fonctions et droites ; second degré ; suites ; suites arithmétiques ; suites géométriques ; nombre dérivé et tangente ; dérivées et optimisation ; statistiques à deux variables ; probabilités conditionnelles et indépendance ; répétitions de Bernoulli ; variables aléatoires et simulation.

**5 repères transversaux** : calcul et proportions ; évolutions en pourcentage ; ensembles et logique ; statistiques descriptives ; Python et tableur. Ils accompagnent les chapitres, sans constituer une séquence obligatoire de révision.

Chaque leçon contient objectifs, explications, méthodes, exemples chiffrés, application corrigée et bilan. Les formules sont en HTML, sans chargement d'une bibliothèque distante.

### Parcours pédagogique accessible

Les 16 leçons disposent d'une présentation à codes visuels **toujours accompagnés de mots** : objectifs en bleu, formules en violet, exemples guidés en vert, erreurs fréquentes en ambre. Elles proposent un chemin en trois temps, un **coup de pouce facultatif en trois étapes**, deux **mini-tests de rappel actif** par leçon (32 au total) et une routine de révision différée. Les réponses des mini-tests sont vérifiables sans note ; en cas d'erreur, l'élève reçoit un indice et peut réessayer.

Une barre facultative permet d'agrandir le texte et de masquer le sommaire en **lecture concentrée**. Les fonctions interactives ne sont jamais nécessaires pour consulter le texte principal : sans JavaScript, les coups de pouce et les corrigés des mini-tests restent ouverts par des éléments HTML `details`. Aucun suivi nominatif ni score de lecture n'est stocké.

`pedagogie.html` explique les choix retenus, leurs limites et les sources académiques (synthèses couvrant notamment 317 expériences d'apprentissage espacé, 435 études sur le feedback, 225 sur l'apprentissage actif et 181 sur la conception multimédia). Il ne s'agit pas d'une certification de l'efficacité du site pour chaque élève ; une évaluation de terrain reste nécessaire.

Les recherches par mot et domaine, le sommaire des leçons, les liens précédent/suivant et le simulateur de Bernoulli sont des améliorations JavaScript. Les cours, le catalogue, les liens principaux et les corrections natives `details` restent consultables sans JavaScript. L'impression via le bouton ouvre les corrections et restaure ensuite leur état.

**Exercices interactifs : 129 exercices en 16 parcours**, couvrant les 11 chapitres et les 5 repères. Chaque série propose des réponses saisies et des choix, un score, des indices et des corrections détaillées qui remplissent les cases en vert (réponse initiale juste) ou en rouge (réponse fausse ou manquante). Le corrigé ne rapporte pas de point et le bouton Effacer permet de recommencer. La progression se réinitialise au rechargement.

### Générateur de variantes procédurales

**Les 129 exercices disposent chacun d'un modèle paramétrable.** Après chaque clic sur Vérifier (même lorsque la réponse est fausse), une nouvelle variante est calculée à partir de nouveaux paramètres numériques. L'élève conserve l'écran de correction et le feedback jusqu'à ce qu'il clique sur **Nouvelle variante ↻**, pour ne pas perdre le temps de comprendre ses erreurs. Ouvrir une correction prépare également une nouvelle variante si elle n'est pas déjà prête. Il est toujours possible de corriger l'essai actuel.

Le moteur recalcule **ensemble** les données de l'énoncé, les réponses numériques, les options correctes et les corrections détaillées : aucun simple remplacement arbitraire de nombres dans un texte fixe. Le score correspond aux exercices actuellement validés ; renouveler une question remet sa validation à zéro afin d'éviter de créditer une réponse antérieure. La correction révélée continue d'indiquer en vert ce qui était juste et en rouge ce qui était faux avant la révélation.

Les variations sont déterministes par numéro d'essai (cycle de difficulté borné) et peuvent être répétées indéfiniment ; elles ne sont pas garanties inédites sur toute la vie du site. Elles changent d'une validation à la suivante. La génération est locale au navigateur, sans transmission ni stockage des réponses.

## Données et confidentialité

`donnees/naissances-france-2018-2023.csv` contient six totaux annuels issus de l'Insee Focus 339, figure 1 : https://www.insee.fr/fr/statistiques/8282356. Le champ, l'unité et la période sont décrits dans `donnees/README.md`.

Les autres situations numériques sont fictives. Aucune donnée personnelle, police distante, publicité ou traceur. La simulation s'exécute dans le navigateur, sans transmission ni stockage. Les programmes Python des cours sont des exemples à exécuter séparément ; le site n'embarque pas d'interpréteur Python.

## Structure

```text
index.html              Accueil et deux espaces
lecons.html             Catalogue des 16 leçons
programme.html          Sources, version et correspondance au programme
pedagogie.html           Méthodes d'apprentissage et sources
exercices.html          Catalogue des 16 séries d'exercices
exercices/              16 pages d'exercices (15 parcours déclaratifs)
assets/exercices.css    Styles des parcours interactifs
assets/exercices.js     Validation, score et corrections colorées
assets/exercices-renderer.js  Rendu et renouvellement des fiches
assets/exercices-variants.js  Moteur de génération et contrôle
assets/variants-*.js      6 modules de générateurs par notion
cours/                  16 pages de cours statiques
assets/styles.css       Thème partagé du site
assets/cours.css         Catalogue, lecture, tableaux et impression
assets/cours.js          Améliorations progressives et simulation
assets/apprentissage.css  Couleurs sémantiques et options de lecture
assets/apprentissage.js   Mini-tests et outils de lecture
donnees/                CSV réel et provenance
tests/                  Vérifications du site et des exemples
.github/workflows/      Vérifications automatisées
.nojekyll               Publication statique
```

## Utilisation locale

Aucun paquet n'est requis pour lire le site. Ouvrir `index.html` directement, ou servir la racine avec Python :

```sh
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000. Tous les chemins internes sont relatifs pour fonctionner aussi dans le sous-répertoire GitHub Pages du projet.

## Tests

Les contrôles structurels et numériques utilisent seulement Python standard et Node :

```sh
python3 tests/validate_site.py
node --check assets/cours.js
node --check assets/apprentissage.js
node --check assets/exercices.js
node --check assets/exercices-renderer.js
node --check assets/exercices-variants.js
node tests/test_variants.js
```

Les tests de navigateur utilisent Playwright uniquement comme dépendance de développement :

```sh
python3 -m pip install playwright==1.55.0
python3 -m playwright install chromium
python3 tests/browser_smoke.py
```

La vérification porte sur les liens et ancres statiques, la présence des 16 cours, des 32 mini-tests et de leurs corrections, des 129 exercices et de leurs 4 644 variantes de test, la syntaxe des exemples Python, des exemples numériques représentatifs, le rendu sans débordement global, la recherche, les sommaires, les corrections, le fonctionnement sans JavaScript et les cas limites du simulateur. Elle ne constitue pas une certification pédagogique exhaustive.

## Publication

GitHub Pages publie la branche **`gh-pages`**, à la racine. `main` contient les sources de référence. Une mise à jour de `main` n'est pas publiée tant que `gh-pages` n'a pas été avancée vers le commit validé. Ne pas forcer l'historique : vérifier que la mise à jour est une avance rapide, puis attendre le succès de `pages build and deployment`.

Le workflow de vérification ne déploie pas et ne reçoit que des permissions de lecture. Il s'exécute sur les changements de `main`, de la branche de préparation `cours-programme-2026` et sur les demandes de fusion.

## Continuer

Modifier les HTML de `cours/`, puis maintenir le catalogue, le tableau de couverture et `courseOrder` dans `assets/cours.js`. Exécuter les tests avant publication. Les couleurs des leçons sont dans `assets/apprentissage.css`, celles des exercices dans `assets/exercices.css`. Maintenir les indications textuelles lorsque l'on change un code couleur ; éviter tout effet qui reposerait exclusivement sur une teinte.

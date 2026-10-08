# Maths · Première STMG

Site pédagogique en français, en HTML/CSS/JavaScript statiques.

**Site : https://longduzob.github.io/maths1-reSTMG/**  
**Leçons : https://longduzob.github.io/maths1-reSTMG/lecons.html**  
**Exercices : https://longduzob.github.io/maths1-reSTMG/exercices.html**

## Programme de référence

Programme de première technologique applicable en **2026–2027**, pour STMG : arrêté du 26 février 2026, BO n° 14 du 2 avril 2026, NOR MENE2602918A.

Source principale : https://www.education.gouv.fr/bo/2026/Hebdo14/MENE2602918A

`programme.html` relie les contenus officiels aux cours et documente les choix de périmètre. Les leçons sont des rédactions pédagogiques originales ; il ne s'agit pas de cours certifiés par le ministère. Les activités géométriques propres à STD2A sont exclues du parcours STMG.

## Contenu

**11 chapitres développés** : fonctions et droites ; second degré ; suites ; suites arithmétiques ; suites géométriques ; nombre dérivé et tangente ; dérivées et optimisation ; statistiques à deux variables ; probabilités conditionnelles et indépendance ; répétitions de Bernoulli ; variables aléatoires et simulation.

**5 repères transversaux** : calcul et proportions ; évolutions en pourcentage ; ensembles et logique ; statistiques descriptives ; Python et tableur. Ils accompagnent les chapitres, sans constituer une séquence obligatoire de révision.

Chaque leçon contient objectifs, explications, méthodes, exemples chiffrés, application corrigée et bilan. Les formules sont en HTML, sans chargement d'une bibliothèque distante.

Les recherches par mot et domaine, le sommaire des leçons, les liens précédent/suivant et le simulateur de Bernoulli sont des améliorations JavaScript. Les cours, le catalogue, les liens principaux et les corrections natives `details` restent consultables sans JavaScript. L'impression via le bouton ouvre les corrections et restaure ensuite leur état.

**Exercices interactifs : 129 exercices en 16 parcours**, couvrant les 11 chapitres et les 5 repères. Chaque série propose des réponses saisies et des choix, un score, des indices et des corrections détaillées qui remplissent les cases en vert (réponse initiale juste) ou en rouge (réponse fausse ou manquante). Le corrigé ne rapporte pas de point et le bouton Effacer permet de recommencer. La progression se réinitialise au rechargement.

## Données et confidentialité

`donnees/naissances-france-2018-2023.csv` contient six totaux annuels issus de l'Insee Focus 339, figure 1 : https://www.insee.fr/fr/statistiques/8282356. Le champ, l'unité et la période sont décrits dans `donnees/README.md`.

Les autres situations numériques sont fictives. Aucune donnée personnelle, police distante, publicité ou traceur. La simulation s'exécute dans le navigateur, sans transmission ni stockage. Les programmes Python des cours sont des exemples à exécuter séparément ; le site n'embarque pas d'interpréteur Python.

## Structure

```text
index.html              Accueil et deux espaces
lecons.html             Catalogue des 16 leçons
programme.html          Sources, version et correspondance au programme
exercices.html          Catalogue des 16 séries d'exercices
exercices/              16 pages d'exercices (15 parcours déclaratifs)
assets/exercices.css    Styles des parcours interactifs
assets/exercices.js     Validation, score et corrections colorées
assets/exercices-renderer.js  Rendu des 15 parcours
cours/                  16 pages de cours statiques
assets/styles.css       Thème partagé du site
assets/cours.css         Catalogue, lecture, tableaux et impression
assets/cours.js          Améliorations progressives et simulation
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
node --check assets/exercices.js
node --check assets/exercices-renderer.js
```

Les tests de navigateur utilisent Playwright uniquement comme dépendance de développement :

```sh
python3 -m pip install playwright==1.55.0
python3 -m playwright install chromium
python3 tests/browser_smoke.py
```

La vérification porte sur les liens et ancres statiques, la présence des 16 cours et de leurs corrections, des 129 exercices, la syntaxe des exemples Python, des exemples numériques représentatifs, le rendu sans débordement global, la recherche, les sommaires, les corrections, le fonctionnement sans JavaScript et les cas limites du simulateur. Elle ne constitue pas une certification pédagogique exhaustive.

## Publication

GitHub Pages publie la branche **`gh-pages`**, à la racine. `main` contient les sources de référence. Une mise à jour de `main` n'est pas publiée tant que `gh-pages` n'a pas été avancée vers le commit validé. Ne pas forcer l'historique : vérifier que la mise à jour est une avance rapide, puis attendre le succès de `pages build and deployment`.

Le workflow de vérification ne déploie pas et ne reçoit que des permissions de lecture. Il s'exécute sur les changements de `main`, de la branche de préparation `cours-programme-2026` et sur les demandes de fusion.

## Continuer

Modifier les HTML de `cours/`, puis maintenir le catalogue, le tableau de couverture et `courseOrder` dans `assets/cours.js`. Exécuter les tests avant publication. Les couleurs se trouvent dans les variables CSS du thème partagé.

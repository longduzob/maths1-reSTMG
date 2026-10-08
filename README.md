# Maths · Première STMG

Première étape d’un site de mathématiques en français : une page d’accueil qui donne accès à un espace **Leçons** et à un espace **Exercices**.

**Site en ligne : [Ouvrir Maths · Première STMG](https://longduzob.github.io/maths1-reSTMG/)**

## Ce qui est disponible

- Une page d’accueil avec deux cartes de navigation et une illustration mathématique.
- Deux pages de destination avec un état « contenu à venir » explicite. Aucun cours, exercice ou corrigé complet n’est encore publié.
- Une navigation commune, des liens de retour et un affichage adapté aux mobiles.
- Une base accessible : langue française, titres structurés, lien d’évitement, focus clavier visible et prise en compte de la réduction des animations.

## Structure

```text
.
|-- index.html          # Accueil
|-- lecons.html         # Espace leçons
|-- exercices.html      # Espace exercices
|-- assets/
|   `-- styles.css      # Styles partagés et responsive
|-- .nojekyll           # Publication statique sans traitement Jekyll
`-- README.md
```

## Ouvrir le site

Le site est accessible directement dans un navigateur à l’adresse https://longduzob.github.io/maths1-reSTMG/. Aucune installation n’est nécessaire pour le consulter.

Pour une utilisation locale, ouvrir `index.html` directement dans un navigateur, puis utiliser les liens vers les deux espaces. Aucune installation de paquet, compilation ou clé API n’est nécessaire.

Pour servir le site localement avec Python 3, lancer cette commande à la racine du dépôt :

```sh
python3 -m http.server 8000
```

Ouvrir ensuite `http://localhost:8000`.

## Publication

L’hébergement GitHub Pages est activé. La source de publication est la branche `gh-pages`, à la racine (`/`). GitHub exécute son workflow « pages build and deployment » lorsque cette branche est mise à jour.

La branche `main` reste la branche de travail. Les changements sur `main` ne sont pas automatiquement copiés vers `gh-pages` : pour publier une nouvelle version, avancer `gh-pages` jusqu’au commit validé de `main`, sans réécrire l’historique. La première version a été déployée avec succès le 8 octobre 2026.

Tous les chemins sont relatifs, pour fonctionner dans le sous-répertoire du site de projet. Le fichier `.nojekyll` permet de servir les fichiers statiques sans traitement Jekyll.

## Continuer le projet

Ajouter les futurs chapitres dans l’espace leçons et les futurs énoncés dans l’espace exercices. Remplacer les blocs `empty-state` lorsque le contenu est prêt, puis relier les nouvelles pages avec des chemins relatifs.

Les styles communs sont dans `assets/styles.css` ; les couleurs principales sont définies dans `:root`. Le site utilise uniquement HTML et CSS : pas de framework, de police distante, de script tiers, de traceur ou de collecte de données.

## Vérifications manuelles

Ouvrir les trois pages sur ordinateur et mobile, vérifier les liens et parcourir la navigation avec la touche Tab. Le premier lien permet d’aller directement au contenu principal. La page active est identifiée dans le menu.

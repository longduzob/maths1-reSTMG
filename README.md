# Maths · Première STMG

Première étape d’un site de mathématiques en français : une page d’accueil qui donne accès à un espace **Leçons** et à un espace **Exercices**.

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

Aucune installation de paquet, compilation ou clé API n’est nécessaire. Ouvrir `index.html` directement dans un navigateur, puis utiliser les liens vers les deux espaces.

Pour servir le site localement avec Python 3, lancer cette commande à la racine du dépôt :

```sh
python3 -m http.server 8000
```

Ouvrir ensuite `http://localhost:8000`.

## Publication

Le site peut être hébergé tel quel par un serveur de fichiers statiques. Tous les chemins sont relatifs : il peut donc fonctionner dans un sous-répertoire, notamment pour un site de projet GitHub Pages.

La configuration et l’activation de l’hébergement ne font pas partie de cette première étape. Aucun déploiement automatique n’est configuré.

## Continuer le projet

Ajouter les futurs chapitres dans l’espace leçons et les futurs énoncés dans l’espace exercices. Remplacer les blocs `empty-state` lorsque le contenu est prêt, puis relier les nouvelles pages avec des chemins relatifs.

Les styles communs sont dans `assets/styles.css` ; les couleurs principales sont définies dans `:root`. Le site utilise uniquement HTML et CSS : pas de framework, de police distante, de script tiers, de traceur ou de collecte de données.

## Vérifications manuelles

Ouvrir les trois pages sur ordinateur et mobile, vérifier les liens et parcourir la navigation avec la touche Tab. Le premier lien permet d’aller directement au contenu principal. La page active est identifiée dans le menu.

/* Aides spécifiques aux huit modèles du chapitre Second degré. */
(() => {
  'use strict';
  window.ExerciseCoaching.register('second-degre', [
    [
      'Un polynôme du second degré se compare à ax² + bx + c.',
      'Sépare le terme en x², le terme en x et la constante, en conservant leurs signes.',
      'lis dans l’expression le coefficient de x², puis celui de x, puis le terme sans x. Le signe du coefficient de x² donne le sens d’ouverture de la parabole.',
      'un coefficient négatif reste négatif même si le terme est écrit avec le signe moins.',
      ['Dans 2x² − 3x + 1, quel est le coefficient de x ?', '-3', 'Le terme en x est −3x.']
    ],
    [
      'Une racine annule l’expression : un produit est nul quand au moins un facteur est nul.',
      'Écris séparément les équations qui rendent chaque facteur égal à zéro.',
      'résous chacune des deux équations de premier degré, range les racines et teste un x situé entre elles pour étudier le signe du produit.',
      'entre les deux racines d’un produit (x − r)(x − s), les deux facteurs sont de signes contraires.',
      ['Quelle est la petite racine de (x − 2)(x − 5) = 0 ?', '2', 'Le premier facteur s’annule pour x = 2.']
    ],
    [
      'Développer un produit de deux parenthèses demande de multiplier chaque terme de l’une par chaque terme de l’autre.',
      'Commence par les quatre produits puis regroupe les termes en x et les constantes.',
      'développe d’abord (x − r)(x + p) sous la forme x² + px − rx − rp, puis réduis. Pour vérifier la racine, remplace x dans la forme factorisée.',
      'attention au signe du produit (−r) × p : il est négatif si r et p sont positifs.',
      ['Dans (x − 2)(x + 3), quel est le coefficient de x après développement ?', '1', 'x² + 3x − 2x − 6 = x² + x − 6.']
    ],
    [
      'Une expression de la forme (x − h)² − d² est minimale lorsque le carré est nul.',
      'Trouve la valeur de x qui annule la parenthèse, puis compare le minimum à zéro.',
      'le sommet est au point où x − h = 0. Pour trouver les racines, écris (x − h)² = d² et envisage les deux signes possibles pour x − h.',
      'l’équation d’un carré égal à un nombre positif possède en général deux solutions.',
      ['Pour (x − 4)² − 9, quelle est l’abscisse du sommet ?', '4', 'Le carré est nul pour x = 4.']
    ],
    [
      'Avec une forme factorisée, tu peux calculer directement une image et repérer les racines.',
      'Remplace x par la valeur indiquée dans chacun des facteurs avant de multiplier.',
      'calcule les deux parenthèses séparément, puis applique le coefficient négatif placé devant. Entre les racines, vérifie les signes des deux facteurs avant celui du produit.',
      'un signe moins placé devant tout le produit inverse son signe.',
      ['Que vaut −(x − 1)(x − 3) lorsque x = 2 ?', '1', 'À x = 2, les facteurs valent 1 et −1 : leur produit vaut −1, puis on change de signe.']
    ],
    [
      'Une parabole écrite sous la forme −a(x − h)² + M, avec a positif, possède un maximum égal à M.',
      'Commence par repérer la valeur qui rend le carré nul.',
      'pour le maximum, annule le carré. Pour les racines, pose la fonction égale à zéro, isole le carré, puis prends la racine carrée positive et négative.',
      'ne confonds pas l’abscisse de la quantité optimale avec le bénéfice maximal.',
      ['Quel est le bénéfice maximal de −(x − 3)² + 8 ?', '8', 'Le carré est toujours positif ou nul, donc le sommet donne 8.']
    ],
    [
      'Une fonction sous forme factorisée s’annule lorsque l’un des facteurs s’annule.',
      'Lis les deux racines puis cherche leur milieu pour localiser le sommet.',
      'évalue la fonction en zéro, déduis la position du sommet en faisant la moyenne des deux racines et remplace ensuite x par cette abscisse pour calculer la valeur minimale.',
      'la valeur minimale est une ordonnée ; le milieu des racines donne seulement son abscisse.',
      ['Quelle est l’abscisse du sommet de (x − 2)(x − 6) ?', '4', 'Le sommet se situe à mi-distance entre les racines 2 et 6.']
    ],
    [
      'Pour une inéquation-produit, les racines séparent l’axe en intervalles de signes.',
      'Trouve les racines puis teste une valeur dans chacun des intervalles.',
      'calcule les images demandées en remplaçant x ; pour le signe négatif ou nul, garde la zone entre les racines. Une inégalité avec ≤ inclut les racines.',
      'attention aux crochets : ≤ permet l’égalité, alors que < exclut les racines.',
      ['Que vaut (x − 1)(x − 3) pour x = 2 ?', '-1', '(2 − 1)(2 − 3) = 1 × (−1) = −1.']
    ]
  ]);
})();

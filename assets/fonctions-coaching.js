/* Indices contextualisés du chapitre Fonctions.
   Les exercices tremplins sont des exemples distincts de la variante courante. */
(() => {
  'use strict';

  const originals = [
    {a: 3, b: -5, target: 10},
    {fix: 18, rate: 6, total: 60},
    {h: 2, lo: 1, hi: 3},
    {a: 3, b: 2, y1: 5, y2: 14},
    {fixed: 20, rateA: 9, rateB: 14, k: 4},
    {a: 1},
    {a: 2, b: 8, root: 4, max: 6},
    {D: 240},
    {n: 5, low: 2.23, high: 2.24}
  ];

  const fr = number => String(number).replace('.', ',');
  const sign = number => (number < 0 ? ' − ' : ' + ') + Math.abs(number);
  const affine = (name, a, b) => name + '(x) = ' + a + 'x' + sign(b);
  const bridge = (q, a, help) => ({q, a: String(a), help});
  const make = (hints, diagnose, exercise) => ({hints, diagnose, bridge: exercise});

  function build(index, c) {
    if (!c) return null;
    switch (index) {
      case 0: {
        const f = affine('f', c.a, c.b);
        return make([
          'Une image est la valeur obtenue en remplaçant x. Un antécédent est une valeur de x à retrouver.',
          'Avec ' + f + ', pour calculer f(4), remplace x par 4. Pour l’antécédent de ' + c.target + ', pose f(x) = ' + c.target + '.',
          'Commence par f(4) = ' + c.a + ' × 4' + sign(c.b) + '. Pour l’antécédent de ' + c.target + ', résous ' + c.a + 'x' + sign(c.b) + ' = ' + c.target + ' en isolant x.'
        ], 'Vérifie que tu n’as pas confondu image et antécédent. Pour l’image, tu remplaces x ; pour l’antécédent, tu cherches x.',
        bridge('Exemple indépendant : si u(x) = 2x + 1, combien vaut u(3) ?', 7, 'Remplace x par 3 : 2 × 3 + 1 = 7.'));
      }
      case 1:
        return make([
          'Le prix total comprend des frais fixes et un tarif par heure.',
          'Pour 4 h, multiplie ' + c.rate + ' € par 4 puis ajoute les ' + c.fix + ' € fixes.',
          'Écris C(4) = ' + c.fix + ' + ' + c.rate + ' × 4. Pour retrouver la durée correspondant à ' + c.total + ' €, résous ' + c.fix + ' + ' + c.rate + 't = ' + c.total + ' en retirant les frais fixes puis en divisant.'
        ], 'Vérifie que les frais fixes ne sont ajoutés qu’une fois. Pour retrouver la durée, ne divise pas le prix total directement par le tarif horaire.',
        bridge('Exemple indépendant : 5 € fixes puis 2 € par heure. Combien pour 3 h ?', 11, '5 + 2 × 3 = 11 €.'));
      case 2:
        return make([
          'Sur un graphique, x se lit sur l’axe horizontal et g(x) sur l’axe vertical.',
          'Pour une image, pars d’une abscisse. Pour un antécédent de 0, repère les points où la courbe coupe l’axe horizontal.',
          'Pour g(' + (c.h - 2) + '), remplace x par ' + (c.h - 2) + ' dans (' + (c.h - 2) + ' − ' + c.h + ')² − 1. Pour les antécédents de 0, pose (x − ' + c.h + ')² − 1 = 0. Le signe négatif correspond aux parties sous l’axe horizontal.'
        ], 'Vérifie que tu lis les antécédents sur l’axe horizontal, et que l’intervalle de signe strictement négatif n’inclut pas les zéros.',
        bridge('Exemple indépendant : si une courbe passe par (2 ; 5), quelle est l’image de 2 ?', 5, 'Le point a pour abscisse 2 et pour ordonnée 5.'));
      case 3:
        return make([
          'Pour une droite, cherche d’abord le coefficient directeur a, puis l’ordonnée à l’origine b.',
          'Entre A(1 ; ' + c.y1 + ') et B(4 ; ' + c.y2 + '), divise la variation des ordonnées par celle des abscisses.',
          'Écris a = (' + c.y2 + ' − ' + c.y1 + ')/(4 − 1), puis ' + c.y1 + ' = a × 1 + b. Utilise ensuite h(10) = a × 10 + b.'
        ], 'Pour calculer la pente, soustrais les coordonnées dans le même ordre au numérateur et au dénominateur.',
        bridge('Exemple indépendant : une droite passe par (0 ; 2) et (1 ; 5). Quel est son coefficient directeur ?', 3, '(5 − 2)/(1 − 0) = 3.'));
      case 4:
        return make([
          'Pour comparer deux offres, utilise la même durée t dans les deux formules.',
          'Pour l’égalité, pose A(t) = B(t). Pour déterminer quand A est au plus aussi chère, utilise A(t) ≤ B(t).',
          'À 2 h, calcule A(2) = ' + c.fixed + ' + ' + c.rateA + ' × 2 et B(2) = ' + c.rateB + ' × 2. Pour l’égalité et la comparaison, pars de ' + c.fixed + ' + ' + c.rateA + 't = ' + c.rateB + 't puis remplace = par ≤ pour la deuxième question.'
        ], 'Le seuil d’égalité n’est pas à lui seul l’intervalle de comparaison. Pense à vérifier le sens de l’inégalité après avoir regroupé les termes.',
        bridge('Exemple indépendant : A(t) = 10 + 2t et B(t) = 4t. Pour quelle durée sont-ils égaux ?', 5, '10 + 2t = 4t, donc 10 = 2t et t = 5.'));
      case 5:
        return make([
          'Un taux de variation est une différence d’images divisée par une différence d’abscisses.',
          'Pour q(x) = ' + c.a + 'x², commence par calculer q(2), q(5) et q(6).',
          'Écris le premier taux : [(' + c.a + ' × 5²) − (' + c.a + ' × 2²)]/(5 − 2). Pour le second, remplace 2 et 5 par 5 et 6. Compare les deux taux pour décider si q est affine.'
        ], 'Vérifie que tu divises bien par la différence des abscisses et que les deux taux ne sont pas automatiquement égaux.',
        bridge('Exemple indépendant : entre (1 ; 2) et (3 ; 8), quel est le taux de variation ?', 3, '(8 − 2)/(3 − 1) = 3.'));
      case 6:
        return make([
          'Pour une fonction affine, le signe du coefficient de x donne le sens de variation.',
          'Dans p(x) = −' + c.a + 'x + ' + c.b + ', le coefficient de x est négatif. Pour chercher le zéro, pose p(x) = 0.',
          'Résous −' + c.a + 'x + ' + c.b + ' = 0. Ensuite, pour p(x) ≥ 0 sur [0 ; ' + c.max + '], conserve les abscisses où la droite est sur ou au-dessus de l’axe horizontal.'
        ], 'Vérifie le signe du coefficient directeur. Attention : dans p(x) ≥ 0, la borne où p(x) = 0 est incluse.',
        bridge('Exemple indépendant : pour u(x) = −x + 5, quelle est la solution de u(x) = 0 ?', 5, '−x + 5 = 0 revient à x = 5.'));
      case 7:
        return make([
          'À distance fixée, durée = distance ÷ vitesse.',
          'Dans t(v) = ' + c.D + '/v, remplace v par 60, 80 puis 120. N’oublie pas les heures.',
          'Écris t(60) = ' + c.D + '/60, t(80) = ' + c.D + '/80 et t(120) = ' + c.D + '/120. Compare ensuite t(60) et t(120) pour comprendre ce qui se passe lorsque la vitesse double.'
        ], 'Vérifie que tu as divisé la distance par la vitesse, et non l’inverse. Ce modèle est inversement proportionnel, pas affine.',
        bridge('Exemple indépendant : combien de temps pour parcourir 100 km à 50 km/h ?', 2, 'Durée = distance ÷ vitesse = 100 ÷ 50 = 2 h.'));
      case 8:
        return make([
          'Pour encadrer une racine carrée positive, compare les carrés de deux nombres positifs voisins.',
          'Teste les deux bornes ' + fr(c.low) + ' et ' + fr(c.high) + ' en calculant leurs carrés, puis compare les résultats à ' + c.n + '.',
          'Écris ' + fr(c.low) + '² et ' + fr(c.high) + '², puis vérifie lequel est plus petit et lequel est plus grand que ' + c.n + '. Comme la fonction carré est croissante sur les nombres positifs, tu peux en déduire l’encadrement de √' + c.n + '.'
        ], 'Vérifie que tu compares les deux carrés à ' + c.n + ' avant d’écrire l’encadrement, et que les bornes sont des centièmes consécutifs.',
        bridge('Exemple indépendant : quelle est la racine carrée positive de 9 ?', 3, '3² = 9, donc √9 = 3.'));
      default:
        return null;
    }
  }

  window.FonctionsCoaching = {originals, build};
})();

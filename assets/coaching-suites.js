/* Aides rédigées exercice par exercice : suites et suites arithmétiques/géométriques. */
(()=>{
'use strict';
window.ExerciseCoaching.register("suites", [
  [
    "Une formule explicite donne directement le terme de rang n.",
    "Commence par remplacer n par les rangs demandés, sans oublier le rang zéro.",
    "remplace n successivement par 0, 2 et 5 dans la formule. Respecte les priorités : multiplication avant addition.",
    "le terme u₀ n'est pas le terme où tu remplaces n par 1.",
    [
      "Si uₙ = 4 + 3n, combien vaut u₂ ?",
      "10",
      "u₂ = 4 + 3 × 2 = 10."
    ]
  ],
  [
    "Une relation de récurrence permet de passer d'un terme au suivant.",
    "Repère la valeur initiale et la quantité constante ajoutée à chaque étape.",
    "pour obtenir u₃, effectue trois ajouts depuis u₀ ; pour u₆, six ajouts. Tu peux aussi écrire uₙ = u₀ + nr.",
    "ne confonds pas le nombre d'étapes avec le numéro du premier terme.",
    [
      "Si u₀ = 5 et uₙ₊₁ = uₙ + 2, combien vaut u₃ ?",
      "11",
      "Trois ajouts de 2 à partir de 5 donnent 11."
    ]
  ],
  [
    "Une suite géométrique multiplie chaque terme par un même nombre q.",
    "Repère le terme de départ et le facteur de multiplication.",
    "calcule v₀ avec l'exposant 0, puis v₁ avec q et v₂ avec q². Vérifie la nature en comparant les quotients de deux termes.",
    "une raison géométrique se multiplie ; elle ne s'ajoute pas à chaque rang.",
    [
      "Si vₙ = 10 × 0,5ⁿ, combien vaut v₂ ?",
      "2.5",
      "0,5² = 0,25, donc v₂ = 10 × 0,25 = 2,5."
    ]
  ],
  [
    "Une suite arithmétique peut avoir une raison négative.",
    "Calcule les trois termes en retirant la même quantité à chaque étape.",
    "pars du terme au rang zéro et retranche la raison positive une, deux puis trois fois ; la suite décroît si l'écart est négatif.",
    "écrire une soustraction récurrente équivaut à ajouter une raison négative.",
    [
      "Si w₀ = 12 et qu'on retranche 3 à chaque étape, combien vaut w₂ ?",
      "6",
      "12 − 3 − 3 = 6."
    ]
  ],
  [
    "Pour reconnaître une suite arithmétique, compare les différences consécutives.",
    "Calcule d'abord les images pour trois rangs consécutifs.",
    "évalue u₁, u₂ et u₃, puis calcule u₂ − u₁ et u₃ − u₂ ; compare ces écarts avant de conclure.",
    "les différences d'une formule quadratique ne sont généralement pas constantes.",
    [
      "Pour uₙ = n², combien vaut u₂ − u₁ ?",
      "3",
      "u₂ = 4 et u₁ = 1, donc la différence vaut 3."
    ]
  ],
  [
    "Un stock augmente chaque semaine d'une quantité constante.",
    "Identifie le stock initial et la quantité ajoutée par semaine.",
    "écris l'inégalité stock initial + raison × n ≥ seuil, isole n, puis prends le premier rang entier autorisé.",
    "un seuil atteint exactement compte lorsque l'inégalité contient ≥.",
    [
      "À partir de 20 objets, on ajoute 5 par semaine. Premier rang où il y en a au moins 35 ?",
      "3",
      "20 + 5n ≥ 35 donne n ≥ 3."
    ]
  ],
  [
    "Une suite est représentée par des points isolés correspondant aux rangs entiers.",
    "Remplace n par 0, 2 puis 4 pour trouver les ordonnées des points.",
    "forme chaque couple (n ; uₙ). N'ajoute pas les segments entre les points car n représente un rang entier.",
    "le rang n se place à l'horizontale, la valeur uₙ à la verticale.",
    [
      "Si uₙ = 3n + 1, quelle est l'ordonnée du point au rang 2 ?",
      "7",
      "u₂ = 3 × 2 + 1 = 7."
    ]
  ],
  [
    "Deux modèles peuvent évoluer différemment : ajout constant ou multiplication constante.",
    "Calcule séparément les deux suites au même rang.",
    "pour u₂ puis u₁₀, utilise la formule affine ; pour v₂ et v₁₀, utilise la puissance. Arrondis seulement la suite qui le demande.",
    "ne confonds pas 1,1ⁿ avec 1,1 × n : une suite géométrique utilise une puissance.",
    [
      "Si vₙ = 5 × 2ⁿ, combien vaut v₂ ?",
      "20",
      "v₂ = 5 × 4 = 20."
    ]
  ]
]);
window.ExerciseCoaching.register("suites-arithmetiques", [
  [
    "Une suite arithmétique conserve la même différence entre termes consécutifs.",
    "Soustrais deux termes voisins pour trouver la raison.",
    "vérifie que toutes les différences successives sont égales, puis ajoute cette raison au dernier terme affiché.",
    "la raison arithmétique est une différence, et non un quotient.",
    [
      "Dans la suite 3 ; 7 ; 11, quelle est la raison ?",
      "4",
      "7 − 3 = 4 et 11 − 7 = 4."
    ]
  ],
  [
    "Une suite arithmétique de raison négative perd la même quantité à chaque rang.",
    "Repère le terme initial et le montant de la diminution.",
    "utilise uₙ = u₀ − montant × n pour les rangs 1, 4 et 6 ; indique le sens de variation en observant la raison.",
    "une raison négative produit une suite décroissante, pas nécessairement des termes négatifs.",
    [
      "Si u₀ = 20 et la raison vaut −3, combien vaut u₂ ?",
      "14",
      "u₂ = 20 − 2 × 3 = 14."
    ]
  ],
  [
    "Connaître u₃ et la raison permet de remonter au terme u₀.",
    "Reviens de trois rangs en soustrayant trois fois la raison.",
    "calcule d'abord u₀ = u₃ − 3r, puis repars de u₀ avec u₁₀ = u₀ + 10r.",
    "si tu reviens en arrière, tu dois soustraire la raison et non l'ajouter.",
    [
      "Si u₃ = 14 et r = 3, combien vaut u₀ ?",
      "5",
      "u₀ = 14 − 3 × 3 = 5."
    ]
  ],
  [
    "Le premier rang qui atteint un seuil se détermine par une inégalité.",
    "Calcule le terme juste avant le seuil puis résous l'inégalité.",
    "isole n dans u₀ + rn ≥ seuil ; vérifie ensuite le rang précédent pour confirmer qu'il ne convient pas.",
    "la condition ≥ autorise l'égalité, contrairement à une condition strictement supérieure.",
    [
      "Si uₙ = 10 + 2n, quel est le premier rang où uₙ ≥ 18 ?",
      "4",
      "10 + 2n ≥ 18 entraîne n ≥ 4."
    ]
  ],
  [
    "Pour sommer une suite arithmétique, on peut associer premier et dernier termes.",
    "Identifie les cinq termes, surtout le dernier.",
    "applique somme = nombre de termes × (premier + dernier)/2, et vérifie que le nombre de termes est bien 5.",
    "le dernier terme ici est le cinquième et non un terme au rang cinq si on commence à zéro.",
    [
      "Quelle est la somme de 2 + 4 + 6 + 8 + 10 ?",
      "30",
      "Cinq termes de moyenne 6 : 5 × 6 = 30."
    ]
  ],
  [
    "Avec un premier terme au rang 1, il faut compter neuf écarts pour atteindre le rang 10.",
    "Repère u₁ et la raison avant de calculer u₁₀.",
    "calcule u₁₀ = u₁ + 9r puis la somme des dix termes avec 10 × (u₁ + u₁₀)/2.",
    "attention à ne pas écrire 10r au lieu de 9r quand le premier rang est 1.",
    [
      "Si u₁ = 3 et r = 2, combien vaut u₄ ?",
      "9",
      "Du rang 1 au rang 4 il y a trois pas : 3 + 3 × 2 = 9."
    ]
  ],
  [
    "Une suite arithmétique garde les écarts, une géométrique garde les rapports.",
    "Calcule des différences dans A et des quotients dans B.",
    "compare deux différences consécutives de A et deux quotients consécutifs de B, puis lis séparément chaque raison.",
    "ne choisis pas la nature à partir des seules valeurs : examine comment elles passent d'un rang au suivant.",
    [
      "Dans 2 ; 5 ; 8 ; 11, quelle est la raison arithmétique ?",
      "3",
      "On ajoute toujours 3."
    ]
  ],
  [
    "Une perte mensuelle constante se modélise par une suite arithmétique décroissante.",
    "Distingue la valeur au bout de 12 mois et le premier mois strictement sous le seuil.",
    "utilise u₁₂ = départ − 12r ; pour le seuil strict, trouve le rang où le niveau est égal puis avance d'un rang. Pour la somme, additionne les cinq premiers termes.",
    "une inégalité strictement inférieure n'accepte pas le mois où le seuil est exactement atteint.",
    [
      "On a 40 clients puis on en perd 2 par mois. Combien au bout de 5 mois ?",
      "30",
      "40 − 5 × 2 = 30."
    ]
  ]
]);
window.ExerciseCoaching.register("suites-geometriques", [
  [
    "La raison d'une suite géométrique est le quotient de deux termes voisins.",
    "Divise le deuxième terme par le premier, puis vérifie avec le troisième.",
    "déduis le facteur q, traduis-le en taux (q − 1) × 100 %, puis multiplie le dernier terme par q.",
    "un taux de 20 % correspond à un facteur 1,20, pas à 0,20.",
    [
      "Quelle est la raison de la suite 2 ; 6 ; 18 ?",
      "3",
      "6 ÷ 2 = 3, et 18 ÷ 6 = 3."
    ]
  ],
  [
    "Une récurrence géométrique multiplie chaque terme par le même coefficient q.",
    "Pars du terme de rang zéro et applique plusieurs fois le coefficient.",
    "écris u₁ = u₀ × q, u₂ = u₀ × q² et u₃ = u₀ × q³ ; convertis le facteur en pourcentage avec (q − 1) × 100.",
    "un coefficient inférieur à 1 représente une baisse, même si tous les termes restent positifs.",
    [
      "Si u₀ = 100 et q = 0,8, combien vaut u₁ ?",
      "80",
      "100 × 0,8 = 80."
    ]
  ],
  [
    "La formule uₙ = u₀ × qⁿ permet de calculer directement n'importe quel rang.",
    "Calcule d'abord le terme initial grâce à q⁰ = 1.",
    "pour v₁ et v₂, applique le facteur une fois puis deux fois ; pour le pourcentage, calcule (q − 1) × 100.",
    "élever le facteur à une puissance n'est pas le multiplier par n.",
    [
      "À quel pourcentage de hausse correspond q = 1,2 ?",
      "20",
      "(1,2 − 1) × 100 = 20 %."
    ]
  ],
  [
    "Une augmentation répétée se calcule avec un coefficient multiplicateur.",
    "Convertis le taux annuel en facteur 1 + taux/100.",
    "multiplie le capital initial par q, puis par q² et q³ pour les années suivantes, sans arrondir trop tôt.",
    "ne rajoute pas chaque année le même montant : l'augmentation porte sur le capital déjà augmenté.",
    [
      "Un capital de 100 € augmente de 10 %. Combien vaut-il après un an ?",
      "110",
      "100 × 1,10 = 110 €."
    ]
  ],
  [
    "Un seuil est atteint au premier rang où le terme géométrique le dépasse ou lui est égal.",
    "Calcule deux rangs voisins autour du seuil.",
    "teste le rang 3 puis le rang 4 dans uₙ = u₀ × qⁿ et compare chacun au seuil de l'énoncé.",
    "il faut justifier que le rang précédent est en dessous du seuil.",
    [
      "Si uₙ = 10 × 2ⁿ, premier rang où uₙ ≥ 70 ?",
      "3",
      "u₂ = 40 < 70 et u₃ = 80 ≥ 70."
    ]
  ],
  [
    "La somme d'une suite géométrique peut se calculer en additionnant les termes successifs.",
    "Trouve la raison puis écris le terme après les quatre premiers.",
    "additionne seulement les quatre termes demandés, puis multiplie le dernier par q pour trouver le cinquième.",
    "attention à ne pas additionner cinq termes quand la question porte sur quatre.",
    [
      "Combien vaut 16 + 8 + 4 + 2 ?",
      "30",
      "On additionne exactement les quatre valeurs."
    ]
  ],
  [
    "Une suite arithmétique utilise une multiplication par le rang ; une géométrique élève la raison à ce rang.",
    "Calcule les valeurs des deux modèles au rang 2 avant de passer au rang 10.",
    "évalue A₂, G₂, A₁₀ et G₁₀ séparément ; arrondis les valeurs géométriques au centième et compare les deux nombres au même rang.",
    "10 × 1,12¹⁰ n'est pas 10 × 1,12 × 10 : l'exposant change fortement le résultat.",
    [
      "Si Gₙ = 10 × 1,2ⁿ, combien vaut G₂ ?",
      "14.4",
      "G₂ = 10 × 1,44 = 14,4."
    ]
  ],
  [
    "Une dépréciation répétée se traduit par un coefficient multiplicateur inférieur à 1.",
    "Convertis d'abord le taux de perte en un facteur q.",
    "calcule valeur finale = valeur initiale × q³ ; le taux global vaut (q³ − 1) × 100 et non trois fois le taux annuel.",
    "une baisse de 10 % répétée ne signifie pas retirer chaque année 10 % du prix initial.",
    [
      "Un objet de 100 € perd 20 % par an. Combien vaut-il après deux ans ?",
      "64",
      "100 × 0,8² = 64 €."
    ]
  ]
]);
})();

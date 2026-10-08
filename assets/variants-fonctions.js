(() => {
  'use strict';
  const {register, E, N, S, F, FR, pad} = window.ExerciseVariants;
  const percent = q => F((q-1)*100,2);

  register('fonctions', [
    (c,o) => {
      const k=pad(c), a=k+1, b=-(k+4), fn=x=>a*x+b, target=fn(5);
      return E(o,`On considère <strong>f(x) = ${a}x − ${-b}</strong>. Calcule f(−2), f(0), f(4), puis les antécédents de ${target} et ${b}.`,
        [N('f(−2)',fn(-2)),N('f(0)',b),N('f(4)',fn(4)),N('Antécédent de '+target,5),N('Antécédent de '+b,0)],
        [`f(−2) = ${a} × (−2) − ${-b} = ${fn(-2)}, f(0) = ${b}, f(4) = ${fn(4)}.`,
         `Pour f(x) = ${target}, ${a}x − ${-b} = ${target}, d'où x = 5. Pour f(x) = ${b}, x = 0.`]);
    },
    (c,o) => {
      const k=pad(c), fix=12+2*k, rate=k+2, at4=fix+4*rate, total=fix+7*rate;
      return E(o,`Une location coûte <strong>${fix} € de frais fixes</strong> et <strong>${rate} € par heure</strong>. Son coût est C(t) = frais fixes + tarif horaire × t. Calcule C(4) et détermine la durée facturée ${total} €.`,
        [N('Frais fixes',fix),N('Prix par heure',rate),N('C(4), en €',at4),N('Durée pour '+total+' €, en h',7)],
        [`C(t) = ${fix} + ${rate}t ; C(4) = ${fix} + ${rate} × 4 = ${at4} €.`,
         `${fix} + ${rate}t = ${total} donne ${rate}t = ${total-fix}, donc t = 7 h.`]);
    },
    (c,o) => {
      const k=pad(c), h=k+2, lo=h-1, hi=h+1;
      const graph=`<svg class="variant-graph" viewBox="0 0 580 310" role="img" aria-label="Parabole de g dont les racines sont ${lo} et ${hi}, avec un minimum de moins 1 atteint en ${h}.">
        <rect width="580" height="310" rx="12" fill="#fbfdfc"/>
        <g stroke="#dde5e3" stroke-width="1"><path d="M90 70H510M90 120H510M90 170H510M90 270H510M195 35V287M300 35V287M405 35V287"/></g>
        <g stroke="#555b63" stroke-width="2"><path d="M65 220H535M90 290V30"/></g>
        <path d="M90 70 Q300 470 510 70" stroke="#246453" stroke-width="3.5" fill="none"/>
        <g fill="#246453"><circle cx="195" cy="220" r="5"/><circle cx="300" cy="270" r="5"/><circle cx="405" cy="220" r="5"/></g>
        <g font-size="15" font-family="Arial,sans-serif" fill="#343c45" text-anchor="middle">
          <text x="90" y="240">${h-2}</text><text x="195" y="240">${lo}</text>
          <text x="300" y="240">${h}</text><text x="405" y="240">${hi}</text>
          <text x="510" y="240">${h+2}</text><text x="63" y="275">−1</text>
          <text x="64" y="75">3</text><text x="540" y="225">x</text>
        </g></svg>`;
      return E(o,`Observe la parabole de <strong>g(x) = (x − ${h})² − 1</strong>, dessinée de x = ${h-2} à x = ${h+2}. Les graduations sont régulières.<br>${graph}`,
        [N('g('+(h-2)+')',3),N('g('+h+')',-1),{label:'Antécédents de 0',type:'text',answer:`${lo};${hi}`},N('Minimum de g',-1),N('Atteint pour x',h),
        S('Solutions de g(x) < 0',`]${lo};${hi}[`,[`[${lo};${hi}]`,`]${lo};${hi}[`,`[${h-2};${lo}] ∪ [${hi};${h+2}]`])],
        [`g(${h-2}) = (${h-2} − ${h})² − 1 = 3, tandis que g(${h}) = −1, valeur minimale.`,
         `Résoudre (x − ${h})² − 1 = 0 revient à chercher x = ${lo} ou x = ${hi}. La courbe est sous l’axe entre ces deux valeurs : ]${lo} ; ${hi}[.`]);
    },
    (c,o) => {
      const k=pad(c), a=k+1, b=k-2, y1=a+b, y2=4*a+b;
      return E(o,`Une droite passe par <strong>A(1 ; ${y1})</strong> et <strong>B(4 ; ${y2})</strong>. Trouve les coefficients de h(x) = ax + b, puis calcule h(10).`,
        [N('Coefficient a',a),N('Coefficient b',b),N('a dans h(x)',a),N('b dans h(x)',b),N('h(10)',a*10+b)],
        [`a = (${y2} − ${y1})/(4 − 1) = ${a} ; b = ${y1} − ${a} × 1 = ${b}.`,
         `L'équation est h(x) = ${a}x + ${b}, donc h(10) = ${a*10+b}.`]);
    },
    (c,o) => {
      const k=pad(c), diff=2+k%4, r=5+k, fixed=diff*k, B=r+diff, costA=fixed+2*r,costB=2*B;
      return E(o,`Deux offres de location : <strong>A(t) = ${fixed} + ${r}t</strong> et <strong>B(t) = ${B}t</strong>, t ≥ 0. Compare à t = 2, puis trouve le seuil de rentabilité.`,
        [N('A(2), en €',costA),N('B(2), en €',costB),N('Durée d’égalité',k),
        S('A(t) ≤ B(t) lorsque',`t>=${k}`,[`t<${k}`,`t<=${k}`,`t>=${k}`,`t>${k}`])],
        [`À t = 2 : A(2) = ${fixed} + 2 × ${r} = ${costA} €, B(2) = ${B} × 2 = ${costB} €.`,
         `${fixed} + ${r}t ≤ ${B}t ⇔ ${fixed} ≤ ${diff}t ⇔ t ≥ ${k}.`]);
    },
    (c,o) => {
      const k=pad(c), a=k-1;
      return E(o,`On considère <strong>q(x) = ${a}x²</strong>. Calcule les taux de variation entre 2 et 5, puis entre 5 et 6.`,
        [N('Entre 2 et 5',7*a),N('Entre 5 et 6',11*a),
        S('Conclusion','non-affine',['affine','non-affine','constante'])],
        [`Entre 2 et 5, le taux vaut [${a} × 25 − ${a} × 4]/3 = ${7*a}.`,
         `Entre 5 et 6, il vaut [${a} × 36 − ${a} × 25]/1 = ${11*a}. Les taux diffèrent : q n'est pas affine.`]);
    },
    (c,o) => {
      const k=pad(c), a=k+1, root=k+2, b=a*root, max=root+3;
      return E(o,`On considère <strong>p(x) = −${a}x + ${b}</strong> sur [0 ; ${max}]. Étudie ses variations et son signe.`,
        [S('Sens de variation','Décroissante',['Croissante','Décroissante','Constante']),N('Solution de p(x) = 0',root),
         S('Solutions de p(x) ≥ 0',`[0;${root}]`,[`[0;${root}]`,`[${root};${max}]`,`]0;${root}[`])],
        [`Le coefficient directeur −${a} est négatif : p est décroissante.`,
         `−${a}x + ${b} = 0 ⇔ x = ${root}. Sur [0 ; ${max}], p(x) ≥ 0 pour x ∈ [0 ; ${root}].`]);
    },
    (c,o) => {
      const k=pad(c), D=120*k;
      return E(o,`La durée (en heures) pour parcourir <strong>${D} km</strong> à vitesse constante v est <strong>t(v) = ${D}/v</strong>.`,
        [N('t(60 km/h)',D/60),N('t(80 km/h)',D/80),N('t(120 km/h)',D/120),
         S('De 60 à 120 km/h','divisee-par-deux',['double','divisee-par-deux','ne-change-pas']),
         S('Type de modèle','inverse',['affine','inverse','constant'])],
        [`t(60) = ${D}/60 = ${D/60} h, t(80) = ${D}/80 = ${FR(D/80)} h et t(120) = ${D}/120 = ${D/120} h.`,
         `Quand la vitesse double, la durée est divisée par deux. Ce modèle est inversement proportionnel.`]);
    },
    (c,o) => {
      const numbers=[2,3,5,6,7,8,10,11,13,14,15,17];
      const n=numbers[c%numbers.length], low=Math.floor(Math.sqrt(n)*100)/100, high=F(low+.01,2);
      return E(o,`Cherche un encadrement au centième de la solution positive de <strong>x² = ${n}</strong>. Calcule les carrés de deux centièmes consécutifs, puis encadre √${n}.`,
        [N(`${FR(low,2)}²`,F(low*low,4),0.00001),N(`${FR(high,2)}²`,F(high*high,4),0.00001),
         N('Borne inférieure',low),N('Borne supérieure',high)],
        [`${FR(low,2)}² = ${FR(low*low,4)} < ${n} et ${FR(high,2)}² = ${FR(high*high,4)} > ${n}.`,
         `La fonction carré est croissante pour x ≥ 0 ; donc ${FR(low,2)} < √${n} < ${FR(high,2)}.`]);
    }
  ]);

  register('second-degre', [
    (c,o)=>{const k=pad(c),a=1+k%3,b=-(k+2),d=k-3;return E(o,`On considère <strong>f(x) = ${a}x² − ${-b}x ${d<0?'−':'+'} ${Math.abs(d)}</strong>. Identifie a, b et c, puis le sens d'ouverture de la parabole.`,[N('Coefficient a',a),N('Coefficient b',b),N('Coefficient c',d),S('Ouverture','Vers le haut',['Vers le haut','Vers le bas'])],[`On compare à ax² + bx + c : a = ${a}, b = ${b}, c = ${d}.`,`Comme a = ${a} > 0, la parabole est tournée vers le haut.`]);},
    (c,o)=>{const k=pad(c),r=k,s=k+3;return E(o,`On donne <strong>g(x) = (x − ${r})(x − ${s})</strong>. Trouve ses deux racines et son signe entre les racines.`,[N('Petite racine',r),N('Grande racine',s),S('Signe entre les racines','Négatif',['Positif','Négatif','Nul'])],[`Le produit s'annule en x = ${r} ou x = ${s}.`,`Pour ${r} < x < ${s}, le premier facteur est positif et le second négatif : le produit est négatif.`]);},
    (c,o)=>{const k=pad(c),r=k,plus=2+k%3,b=plus-r,d=-r*plus;return E(o,`On considère <strong>h(x) = (x − ${r})(x + ${plus})</strong>. Développe h(x) = x² + bx + c et vérifie la racine positive.`,[N('Coefficient b',b),N('Coefficient c',d),N(`h(${r})`,0)],[`h(x) = x² + ${plus}x − ${r}x − ${r*plus} = x² + (${b})x + (${d}).`,`h(${r}) = (${r} − ${r})(${r} + ${plus}) = 0.`]);},
    (c,o)=>{const k=pad(c),h=k+1,d=1+k%3;return E(o,`Soit <strong>p(x) = (x − ${h})² − ${d*d}</strong>. Retrouve le sommet et les racines.`,[N('Axe : x =',h),N('Valeur minimale',-d*d),N('Petite racine',h-d),N('Grande racine',h+d)],[`Le carré est ≥ 0 : p(x) ≥ −${d*d}, minimum atteint pour x = ${h}.`,`p(x) = 0 ⇔ (x − ${h})² = ${d*d} ⇔ x = ${h-d} ou ${h+d}.`]);},
    (c,o)=>{const k=pad(c),d=2+k%4,r=2,s=2+2*d,x=2+d,m=1+k%3;return E(o,`La fonction est <strong>f(x) = −${m}(x − ${r})(x − ${s})</strong>. Calcule f(0) et f(${x}), puis le signe entre les racines.`,[N('f(0)',-m*r*s),N(`f(${x})`,m*d*d),S(`Signe sur ]${r};${s}[`,'Positif',['Positif','Négatif','Nul'])],[`f(0) = −${m} × (−${r}) × (−${s}) = ${-m*r*s}.`,`Entre les racines, le produit est négatif : multiplié par −${m}, le résultat est positif ; f(${x}) = ${m*d*d}.`]);},
    (c,o)=>{const k=pad(c),h=k+3,d=2+k%3,m=1+k%3,max=m*d*d;return E(o,`Un bénéfice est donné par <strong>B(x) = −${m}(x − ${h})² + ${max}</strong>, pour x ∈ [0 ; ${2*h}]. Calcule le maximum et les quantités où B(x) = 0.`,[N('Quantité optimale',h),N('Bénéfice maximal',max),N('Première racine',h-d),N('Deuxième racine',h+d)],[`Le carré (x − ${h})² est ≥ 0. Le bénéfice est au plus ${max}, atteint pour x = ${h}.`,`B(x) = 0 ⇔ (x − ${h})² = ${d*d}. Les deux racines sont ${h-d} et ${h+d}.`]);},
    (c,o)=>{const k=pad(c),r=2,d=1+k%4,s=r+2*d,v=r+d;return E(o,`On étudie <strong>q(x) = (x − ${r})(x − ${s})</strong>. Calcule q(0), les racines et le minimum.`,[N('q(0)',r*s),N('Première racine',r),N('Deuxième racine',s),N('Abscisse du sommet',v),N('Minimum',-d*d)],[`q(0) = (−${r})(−${s}) = ${r*s}; les racines sont ${r} et ${s}.`,`Le sommet est au milieu des racines : x = ${v}. Alors q(${v}) = (${d})(−${d}) = −${d*d}.`]);},
    (c,o)=>{const k=pad(c),r=k,s=k+4,mid=k+2,right=s+2;return E(o,`Résous <strong>(x − ${r})(x − ${s}) ≤ 0</strong> sur [0 ; ${right}]. Calcule aussi le produit pour x = 0, ${mid} et ${right}.`,[N('Pour x = 0',r*s),N(`Pour x = ${mid}`,-4),N(`Pour x = ${right}`,2*(right-r)),S('Solutions',`[${r};${s}]`,[`[${r};${s}]`,`]${r};${s}[`,`[0;${r}] ∪ [${s};${right}]`])],[`En 0, le produit vaut ${r*s}. En ${mid}, il vaut −4 ; en ${right}, il vaut ${2*(right-r)}.`,`Le produit est négatif entre les racines ${r} et ${s}. L’inégalité ≤ inclut les bornes : [${r} ; ${s}].`]);}
  ]);
})();
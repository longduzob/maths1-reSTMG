/* Vérification indépendante des générateurs, sans navigateur. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const files = [
  'assets/exercices-variants.js',
  'assets/variants-fonctions.js',
  'assets/fonctions-coaching.js',
  'assets/coaching-general.js',
  'assets/coaching-algebre.js',
  'assets/coaching-suites.js',
  'assets/coaching-analyse.js',
  'assets/coaching-probabilites.js',
  'assets/coaching-reperes.js',
  'assets/coaching-donnees.js',
  'assets/variants-suites.js',
  'assets/variants-analyse.js',
  'assets/variants-probabilites.js',
  'assets/variants-reperes.js',
  'assets/variants-donnees.js'
];
const sandbox = {window: {}};
vm.createContext(sandbox);
for (const filename of files) {
  vm.runInContext(fs.readFileSync(path.join(ROOT,filename), 'utf8'), sandbox, {filename});
}
const {generate, matchesAnswer} = sandbox.window.ExerciseVariants;
const slugs = [
  'fonctions','second-degre','suites','suites-arithmetiques',
  'suites-geometriques','derivees','variations',
  'statistiques-deux-variables','probabilites-conditionnelles',
  'bernoulli','variables-aleatoires','calcul','evolutions',
  'logique','statistiques-descriptives','python-tableur'
];
let count = 0;
for (const slug of slugs) {
  const original = fs.readFileSync(path.join(ROOT, 'exercices',slug+'.html'), 'utf8');
  const expected = slug === 'fonctions' ? 9 : 8;
  const embedded = original.match(/<script type="application\/json" id="exercise-data">([\s\S]*?)<\/script>/);
  const models = embedded ? JSON.parse(embedded[1]).exercises : [];
  for (let index = 0; index < expected; index++) {
    let previous = null;
    for (let cycle = 1; cycle <= 36; cycle++) {
      const variant = generate(slug,index,cycle,models[index] || {});
      assert.ok(variant.statement.includes('<'), slug+'/'+index+' must have a formatted statement');
      assert.ok(variant.fields.length >= 2, slug+'/'+index+' must be interactive');
      assert.ok(variant.correction.join(' ').length > 40, slug+'/'+index+' must explain its solution');
      assert.ok(variant.tasks.length >= 1, slug+'/'+index+' must have instructions');
      const key = variant.statement + JSON.stringify(variant.fields.map(f=>f.answer));
      if (previous !== null) assert.notEqual(key, previous, slug+'/'+index+' must refresh on EVERY cycle '+cycle);
      previous = key;
      for (const f of variant.fields) {
        if (f.options) {
          assert.ok(f.options.includes(f.answer), 'correct answer not listed');
        } else if (f.type !== 'text' && f.type !== 'unordered-list') {
          assert.ok(Number.isFinite(Number(f.answer)), 'non-finite '+slug+'/'+index);
          if (f.tolerance != null) assert.ok(Number(f.tolerance) >= 0);
        } else {
          assert.ok(f.answer.includes(';'),'text answers list the antecedents');
        }
      }
    }
    count++;
  }
}
assert.equal(count,129);

function fields(slug,index,cycle=1) {
  return generate(slug,index,cycle,{}).fields.map(f=>f.answer);
}
// Contrôles ciblés sur des opérations représentatives.
const second = fields('second-degre',3,2);
assert.equal(Number(second[2]) + Number(second[3]), 2*Number(second[0]));
const affine = fields('fonctions',0,3);
assert.equal(Number(affine[4]),0); // La valeur b possède l’antécédent 0.
const slopes = fields('derivees',0,4);
assert.equal((Number(slopes[1])-Number(slopes[0]))/2, Number(slopes[2]));
const quad = fields('variations',2,3);
assert.ok(Number(quad[1]) < 0);
const probability = fields('probabilites-conditionnelles',4,3);
assert.equal(probability[1], 'Oui');
const bernoulli = fields('bernoulli',2,2);
assert.ok(Math.abs(Number(bernoulli[1])+Number(bernoulli[2])-1)<1e-8);
const basic = fields('calcul',0,2);
assert.notEqual(basic[0],basic[1]);
const csv = fields('python-tableur',7,2);
assert.equal(Number(csv[1])/Number(csv[0]),Number(csv[2]));
// Régression du correcteur : accepter la forme exacte et refuser un arrondi voisin.
const positive = [
  ['0,833','0.8333','number','0.000051','3'],
  ['0,8333','0.8333','number','0.000051','3'],
  ['5/6','0.8333','number','0.000051','3'],
  ['1,41421356','1.41','number','0.0049'],
  ['5/12','0.417','number','0.00049'],
  ['1/2','0.5','number'],
  ['2/4','0.5','number'],
  ['5;3','3;5','unordered-list'],
  ['3,5','3;5','unordered-list'],
  ['x = 5 et x = 3','3;5','unordered-list'],
  ['t>=4','t>=4','text']
];
const negative = [
  ['0,834','0.8333','number','0.000051','3'],
  ['0,334','0.3333','number','0.000051','3'],
  ['1,42','1.41','number','0.0049'],
  ['0,418','0.417','number','0.00049'],
  ['2/0','0.5','number'],
  ['0x10','16','number'],
  ['Infinity','1','number'],
  ['3;3','3;5','unordered-list'],
  ['3;5;7','3;5','unordered-list'],
  ['t ≥ 4','t>=4','text']
];
for (const params of positive) assert.equal(matchesAnswer(...params),true,
  'Correct answer rejected: '+params.join(' / '));
for (const params of negative) assert.equal(matchesAnswer(...params),false,
  'Incorrect answer accepted: '+params.join(' / '));

let cases = 0;
for (const slug of slugs) {
  const length = slug === 'fonctions' ? 9 : 8;
  for (let index = 0; index < length; index++) {
    for (let cycle = 1; cycle <= 60; cycle++) {
      const exercise = generate(slug,index,cycle,{});
      for (const f of exercise.fields) {
        const type = f.options ? 'text' : (f.type || 'number');
        assert.equal(matchesAnswer(f.answer,f.answer,type,f.tolerance,f.rounding),true,
          slug+'/'+index+'/'+cycle+'/'+f.label+' solution rejected');
        if (type === 'number' && f.tolerance != null) {
          assert.ok(Number(f.tolerance) <= 0.0049,
            slug+'/'+index+'/'+cycle+' threshold too wide: '+f.label);
        }
      }
      cases++;
    }
  }
}

// Vérifications indépendantes d'identités et de valeurs de référence, par chapitre.
for (let cycle = 1; cycle <= 60; cycle++) {
  const roots = generate('fonctions',2,cycle,{}).fields[2];
  assert.equal(roots.type,'unordered-list');
  assert.equal(matchesAnswer(roots.answer.split(';').reverse().join(';'),
    roots.answer,roots.type),true);
  const quad = generate('second-degre',3,cycle,{}).fields;
  assert.equal(Number(quad[2].answer)+Number(quad[3].answer),2*Number(quad[0].answer));
  const cond = generate('probabilites-conditionnelles',3,cycle,{}).fields;
  assert.ok(Math.abs(+cond[0].answer + +cond[1].answer - +cond[2].answer) < 0.00015);
  const bern = generate('bernoulli',2,cycle,{}).fields;
  assert.ok(Math.abs(+bern[1].answer + +bern[2].answer-1) < 0.00015);
  const stat = generate('statistiques-descriptives',3,cycle,{}).fields;
  assert.equal(+stat[3].answer,+stat[2].answer-+stat[1].answer);
  assert.match(generate('variables-aleatoires',3,cycle,{}).statement,
    /On note X la variable qui vaut 1 en cas de succès/);
}
console.log('CONTROLE OK: 7 740 variantes, 21 réponses de régression et invariants indépendants.');

console.log('VARIANTS OK: '+count+' generators x 36 cycles = '+(count*36)+' consistent variants; 8 targeted invariants.');

// Prototype Fonctions : chaque indice doit correspondre aux valeurs de sa variante.
const coaching = sandbox.window.FonctionsCoaching;
assert.ok(coaching && typeof coaching.build === 'function');
assert.equal(coaching.originals.length, 9);
assert.match(coaching.build(0, coaching.originals[0]).hints[2], /3 × 4 − 5/);
const bridgeSolutions = ['7', '11', '5', '3', '5', '3', '5', '2', '3'];
let coachingModels = 0;
for (let index = 0; index < 9; index++) {
  const initial = coaching.build(index, coaching.originals[index]);
  assert.equal(initial.hints.length, 3);
  assert.equal(initial.bridge.a, bridgeSolutions[index]);
  let previous = null;
  for (let cycle = 1; cycle <= 60; cycle++) {
    const ex = generate('fonctions', index, cycle, {});
    const c = ex.coachingContext;
    assert.ok(c && typeof c === 'object', 'Missing coaching context for '+index+'/'+cycle);
    const help = coaching.build(index, c);
    assert.equal(help.hints.length, 3);
    assert.ok(help.hints.every(h => typeof h === 'string' && h.length >= 25));
    assert.ok(help.diagnose.length > 50);
    assert.equal(help.bridge.a, bridgeSolutions[index]);
    assert.equal(matchesAnswer(help.bridge.a, help.bridge.a, 'number'), true);
    // Indice 3 : la substitution de la variante doit différer du tirage précédent.
    if (previous) assert.notEqual(help.hints[2], previous, 'Stale hints '+index+'/'+cycle);
    previous = help.hints[2];
    const v = ex.fields.map(f => f.answer);
    const num = i => Number(v[i]);
    switch (index) {
      case 0:
        assert.equal(num(0), c.a * (-2) + c.b);
        assert.equal(num(1), c.b);
        assert.equal(num(2), c.a * 4 + c.b);
        assert.equal(c.target, c.a * 5 + c.b);
        assert.ok(help.hints[2].includes(c.a+' × 4'));
        assert.ok(help.hints[2].includes(' = '+c.target));
        break;
      case 1:
        assert.equal(num(0),c.fix);
        assert.equal(num(1),c.rate);
        assert.equal(num(2),c.fix+4*c.rate);
        assert.equal(num(3),(c.total-c.fix)/c.rate);
        assert.ok(help.hints[2].includes(String(c.total)));
        break;
      case 2:
        assert.equal(v[2],c.lo+';'+c.hi);
        assert.equal(num(4),c.h);
        assert.equal(c.lo,c.h-1);
        assert.equal(c.hi,c.h+1);
        break;
      case 3:
        assert.equal(num(0),c.a);
        assert.equal(num(1),c.b);
        assert.equal(c.y1,c.a+c.b);
        assert.equal(c.y2,4*c.a+c.b);
        assert.equal(num(4),10*c.a+c.b);
        break;
      case 4:
        assert.equal(num(0),c.fixed+2*c.rateA);
        assert.equal(num(1),2*c.rateB);
        assert.equal(num(2),c.k);
        assert.equal(c.fixed,(c.rateB-c.rateA)*c.k);
        break;
      case 5:
        assert.equal(num(0),7*c.a);
        assert.equal(num(1),11*c.a);
        break;
      case 6:
        assert.equal(num(1),c.root);
        assert.equal(c.b,c.a*c.root);
        assert.ok(c.max>c.root);
        break;
      case 7:
        assert.equal(num(0),c.D/60);
        assert.equal(num(1),c.D/80);
        assert.equal(num(2),c.D/120);
        break;
      case 8:
        assert.ok(c.low*c.low<c.n && c.high*c.high>c.n);
        assert.ok(Math.abs(c.high-c.low-0.01)<1e-9);
        assert.ok(Math.abs(num(0)-c.low*c.low)<1e-6);
        assert.ok(Math.abs(num(1)-c.high*c.high)<1e-6);
        assert.ok(help.hints[2].includes('√'+c.n));
        break;
    }
    coachingModels++;
  }
}
console.log('COACHING OK: '+coachingModels+' modeles contextualises, 9 parcours et tremplins verifies.');


// 120 autres exercices : trois aides conçues par modèle, variables et tremplins.
const allCoaching = sandbox.window.ExerciseCoaching;
assert.ok(allCoaching && typeof allCoaching.build === 'function');
const expectedBridges = {
  'second-degre': ['-3','2','1','4','1','8','4','-1'],
  'suites': ['10','11','2.5','6','3','3','7','20'],
  'suites-arithmetiques': ['4','14','5','4','30','9','3','30'],
  'suites-geometriques': ['3','80','20','110','3','30','14.4','64'],
  'derivees': ['4','6','4','4','5','100.8','5','10'],
  'variations': ['6','4','-5','3','2','5','1.4','20'],
  'statistiques-deux-variables': ['4','2','14','2','oui','11','oui','3'],
  'probabilites-conditionnelles': ['7','0.5','0.375','0.2','0.1','0.5','0.4','0.09'],
  'bernoulli': ['0.3','0.25','0.5','0.375','0.875','0.0625','0.0625','0.5'],
  'variables-aleatoires': ['0.5','1.3','1','3','0.4','0.3','0.2','0.1'],
  'calcul': ['23','0.75','32','5','90','7','4','4'],
  'evolutions': ['20','99','96','121','0.8','100','20','25'],
  'logique': ['2','3','6','oui','oui','3','5','3'],
  'statistiques-descriptives': ['0.3','5','10','8','2','12','4','4'],
  'python-tableur': ['20','accepté','11','7','9','5','110','2021']
};
assert.equal(Object.keys(expectedBridges).length, 15);
let otherCases = 0;
for (const [slug, solutions] of Object.entries(expectedBridges)) {
  const page = fs.readFileSync(path.join(ROOT, 'exercices', slug+'.html'), 'utf8');
  const embedded = page.match(/<script type="application\/json" id="exercise-data">([\s\S]*?)<\/script>/);
  assert.ok(embedded, 'Missing original exercises for '+slug);
  const initial = JSON.parse(embedded[1]).exercises;
  assert.equal(initial.length, 8);
  for (let index = 0; index < 8; index++) {
    let previous = null;
    for (let cycle = 0; cycle <= 60; cycle++) {
      const ex = cycle ? generate(slug,index,cycle,initial[index]) : initial[index];
      const help = allCoaching.build(slug,index,ex);
      assert.ok(help, 'Missing coaching for '+slug+'/'+index+'/'+cycle);
      assert.equal(help.hints.length,3);
      assert.ok(help.hints.every(h => h.length >= 35),
        'Hint too short '+slug+'/'+index+'/'+cycle);
      const facts = allCoaching.context(ex);
      assert.ok(facts.length > 0,'No contextual facts');
      assert.ok(help.hints[2].includes(facts),'Incorrect statement facts '+slug+'/'+index+'/'+cycle);
      if(previous && cycle > 1) assert.notEqual(help.hints[2], previous,
        'Frozen method hint '+slug+'/'+index+'/'+cycle);
      previous = help.hints[2];
      assert.equal(help.bridge.a, solutions[index], 'Incorrect bridge answer '+slug+'/'+index);
      assert.ok(help.bridge.q.startsWith('Exemple indépendant : '));
      assert.ok(help.bridge.help.length >= 8);
      assert.ok(help.diagnose.includes('Piste à vérifier'));
      assert.equal(matchesAnswer(help.bridge.a, solutions[index],
        /^[+-]?\d+(?:\.\d+)?$/.test(solutions[index]) ? 'number' : 'text'), true);
      otherCases++;
    }
  }
}
console.log('AIDES OK : '+otherCases+' situations testées, 120 modèles et 120 tremplins.');

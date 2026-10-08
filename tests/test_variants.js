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
const {generate} = sandbox.window.ExerciseVariants;
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
        } else if (f.type !== 'text') {
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
console.log('VARIANTS OK: '+count+' generators x 36 cycles = '+(count*36)+' consistent variants; 8 targeted invariants.');
/* Générateur procédural de variantes. Chaque fiche est construite à partir
   de paramètres : énoncé, réponses et correction partagent les mêmes valeurs.
   Aucun appel réseau ni stockage ; uniquement du JavaScript local. */
(() => {
  'use strict';
  const factories = new Map();
  const N = (label, value, tolerance) => ({
    label, answer: String(value),
    ...(tolerance === undefined ? {} : {tolerance: String(tolerance)})
  });
  const S = (label, answer, options) => ({label, answer, options});
  const F = (value, digits = 4) => Number(value.toFixed(digits));
  const FR = (value, digits = 4) => String(F(value, digits)).replace('.', ',');
  const pad = cycle => 2 + (cycle % 9);
  const E = (original, statement, fields, correction, options = {}) => ({
    title: options.title || original?.title || 'Nouvelle variante',
    level: original?.level || 'Entraînement',
    statement,
    tasks: options.tasks || ['Complète les réponses demandées, puis vérifie ta démarche.'],
    fields,
    correction: Array.isArray(correction) ? correction : [correction],
    hint: options.hint || 'Repère les données de l’énoncé et la méthode du cours. Effectue le calcul avant de consulter la correction.'
  });

  function register(slug, generators) {
    if (factories.has(slug) || !Array.isArray(generators) || !generators.every(g => typeof g === 'function')) {
      throw new Error('Générateurs invalides pour ' + slug);
    }
    factories.set(slug, generators);
  }

  function generate(slug, index, cycle, original = {}) {
    const generators = factories.get(slug);
    if (!generators || index < 0 || index >= generators.length || !Number.isInteger(cycle) || cycle < 1) {
      throw new Error('Variante introuvable : ' + slug + ', exercice ' + (index + 1));
    }
    const result = generators[index](cycle, original);
    if (!result || !result.statement || !Array.isArray(result.fields) || result.fields.length < 2) {
      throw new Error('Exercice incomplet : ' + slug + ', n° ' + (index + 1));
    }
    for (const field of result.fields) {
      if (!field.label || field.answer === undefined || field.answer === '') throw new Error('Réponse manquante : ' + slug);
      if (field.options && !field.options.some(option =>
        (typeof option === 'string' ? option : option.value) === field.answer)) {
        throw new Error('Choix correct absent : ' + slug + ', ' + field.label);
      }
      if (!field.options && !Number.isFinite(Number(field.answer))) {
        throw new Error('Réponse numérique non finie : ' + slug + ', ' + field.label);
      }
    }
    if (!result.correction?.length || !result.correction.every(Boolean)) {
      throw new Error('Correction manquante : ' + slug);
    }
    return result;
  }

  window.ExerciseVariants = {register, generate, N, S, F, FR, pad, E};
})();
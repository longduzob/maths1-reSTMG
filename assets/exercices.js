/* Vérification et répétition procédurale : les corrections restent consultables
   avant de passer à la variante suivante. */
(() => {
  'use strict';
  const root = document.querySelector('[data-interactive-exercises]');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('.exercise-block'));
  const steps = Array.from(root.querySelectorAll('[data-step]'));
  const prev = root.querySelector('[data-nav="previous"]');
  const next = root.querySelector('[data-nav="next"]');
  const progressFill = root.querySelector('#exercise-progress-fill');
  const progressLabel = root.querySelector('#exercise-progress-label');
  const scoreText = root.querySelector('#exercise-score');
  const slug = root.dataset.chapter || 'fonctions';
  const generator = window.ExerciseVariants;
  const renderer = window.ExerciseRenderer;
  const completed = new Set();
  const states = slides.map(slide => ({
    cycle: 0,
    offset: Math.floor(Math.random() * 24),
    pending: null,
    original: {
      title: slide.querySelector('.exercise-head h2')?.textContent || 'Exercice',
      level: slide.querySelector('.exercise-kicker')?.textContent || 'Entraînement'
    }
  }));
  let current = 0;

  const normalise = value => String(value)
    .trim()
    .toLowerCase()
    .replace(/,/g, '.')
    .replace(/\s+/g, '')
    .replace(/[−–—]/g, '-');

  function isCorrect(control) {
    const expected = (control.dataset.expect || '').split('|').map(normalise);
    const actual = normalise(control.value);
    if (!actual) return false;
    if (control.dataset.type === 'number') {
      const parsed = Number(actual);
      if (!Number.isFinite(parsed)) return false;
      const tolerance = Number(control.dataset.tolerance || '0.000001');
      return expected.some(item => {
        const target = Number(item);
        return Number.isFinite(target) && Math.abs(parsed - target) <= tolerance;
      });
    }
    return expected.includes(actual);
  }

  function revealAnswers(form) {
    form.querySelectorAll('.answer-row').forEach(row => {
      const controls = Array.from(row.querySelectorAll('[data-expect]'));
      let right = 0;
      let answered = 0;
      controls.forEach(control => {
        // Capturer la tentative de l'élève AVANT d'afficher la solution.
        const wasCorrect = isCorrect(control);
        if (wasCorrect) right++;
        if (control.value.trim()) answered++;

        const answer = (control.dataset.expect || '').split('|')[0].trim();
        if (control.tagName === 'SELECT') {
          const match = Array.from(control.options)
            .find(option => normalise(option.value) === normalise(answer));
          if (match) control.value = match.value;
          control.disabled = true;
        } else {
          control.value = control.dataset.type === 'number'
            ? answer.replace(/\./g, ',')
            : answer.replace(/;/g, ' ; ');
          control.readOnly = true;
        }
        control.classList.toggle('answer-was-correct', wasCorrect);
        control.classList.toggle('answer-was-wrong', !wasCorrect);
      });

      const allRight = controls.length > 0 && right === controls.length;
      row.classList.remove('is-correct', 'is-wrong');
      row.classList.add('is-revealed');
      row.classList.toggle('was-correct', allRight);
      row.classList.toggle('was-wrong', !allRight);
      const status = row.querySelector('.answer-status');
      if (status) {
        status.textContent = allRight
          ? '✓ Tu avais juste. Solution affichée.'
          : answered === 0
            ? '✗ Non répondu. Solution affichée.'
            : controls.length > 1
              ? '✗ ' + right + '/' + controls.length + ' juste(s) avant correction. Solutions affichées.'
              : '✗ Ta réponse était fausse. Solution affichée.';
      }
    });
  }

  function markRow(row) {
    const controls = Array.from(row.querySelectorAll('[data-expect]'));
    const hasEmpty = controls.some(control => !control.value.trim());
    const correct = controls.length > 0 && controls.every(isCorrect);
    row.classList.toggle('is-correct', correct);
    row.classList.toggle('is-wrong', !correct && !hasEmpty);
    const status = row.querySelector('.answer-status');
    if (status) status.textContent = correct ? 'Correct ✓'
      : hasEmpty ? 'Réponse à compléter.' : 'À revoir. Essaie encore.';
    return correct;
  }

  function updateProgress() {
    const total = slides.length, done = completed.size;
    if (progressFill) progressFill.style.width = (total ? 100 * done / total : 0) + '%';
    if (progressLabel) progressLabel.textContent = done + ' / ' + total + ' exercices validés';
    if (scoreText) scoreText.textContent = done + '/' + total;
    steps.forEach((button, index) => {
      button.classList.toggle('is-complete', completed.has(index));
      button.setAttribute('aria-label', 'Exercice ' + (index + 1) + (completed.has(index) ? ', validé' : ''));
    });
  }

  function showSlide(index, focus = false) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.hidden = !active;
      slide.classList.toggle('is-active', active);
    });
    steps.forEach((button, i) => {
      const active = i === current;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-current', active ? 'step' : 'false');
    });
    if (prev) prev.disabled = current === 0;
    if (next) {
      next.disabled = current === slides.length - 1;
      next.textContent = current === slides.length - 1 ? 'Fin de la série' : 'Exercice suivant →';
    }
    const slide = slides[current];
    history.replaceState(null, '', '#' + slide.id);
    if (focus) {
      const heading = slide.querySelector('h2');
      if (heading) {
        heading.tabIndex = -1;
        heading.focus();
      }
    }
  }

  function queueVariant(index, form, button, force = false) {
    if (!generator || !renderer) return false;
    const state = states[index];
    // Ne pas consommer une autre variante lors de la simple ouverture du corrigé :
    // l'élève doit voir "variante 2" après la première soumission, même s'il
    // consulte ensuite l'explication détaillée.
    if (force || !state.pending) {
      state.cycle++;
      // Chaque visite démarre à un paramétrage différent ; les cycles suivants
      // progressent d'un pas, sans répéter la même variante juste après.
      state.pending = generator.generate(slug, index, state.cycle + state.offset, state.original);
    }
    button.hidden = false;
    button.textContent = 'Nouvelle variante ↻';
    return true;
  }

  function activateVariant(index) {
    const state = states[index];
    if (!state.pending || !renderer) return;

    // Remplacer seulement l'exercice : la navigation et les scores restent intacts.
    const template = document.createElement('template');
    template.innerHTML = renderer.makeExercise(state.pending, index).trim();
    const slide = template.content.firstElementChild;
    if (!slide || slide.id !== 'exercice-' + (index + 1)) {
      throw new Error('Impossible de construire la variante ' + (index + 1));
    }
    const kicker = slide.querySelector('.exercise-kicker');
    if (kicker) kicker.textContent += ' · variante ' + (state.cycle + 1);
    slides[index].replaceWith(slide);
    slides[index] = slide;
    state.pending = null;
    completed.delete(index);
    updateProgress();
    wireSlide(slide, index);
    showSlide(index, true);
  }

  function wireSlide(slide, index) {
    const form = slide.querySelector('.exercise-form');
    if (!form) return;
    const reset = form.querySelector('[data-action="reset"]');
    const correction = form.querySelector('details.check');
    const actions = form.querySelector('.exercise-actions');
    let variant = form.querySelector('[data-action="new-variant"]');
    if (!variant && actions) {
      variant = document.createElement('button');
      variant.type = 'button';
      variant.className = 'button variant-refresh';
      variant.dataset.action = 'new-variant';
      variant.textContent = 'Nouvelle variante ↻';
      variant.hidden = true;
      actions.append(variant);
    }
    if (variant) variant.addEventListener('click', () => activateVariant(index));

    if (correction) {
      correction.addEventListener('toggle', () => {
        if (!correction.open || form.dataset.revealed === 'true') return;
        form.dataset.revealed = 'true';
        revealAnswers(form);
        const ready = variant && queueVariant(index, form, variant);
        const summary = form.querySelector('.exercise-feedback');
        if (summary) summary.textContent = 'Les solutions sont affichées en vert ou rouge selon ta réponse. '
          + (ready ? 'Tu peux passer à une nouvelle variante sans gagner de point.' : 'Efface pour recommencer.');
      });
    }

    form.addEventListener('submit', event => {
      event.preventDefault();
      const summary = form.querySelector('.exercise-feedback');
      if (form.dataset.revealed === 'true') {
        if (summary) summary.textContent = 'Le corrigé est affiché : efface les réponses ou essaie une nouvelle variante.';
        return;
      }
      const rows = Array.from(form.querySelectorAll('.answer-row'));
      const results = rows.map(markRow);
      const correctCount = results.filter(Boolean).length;
      const allCorrect = results.length > 0 && correctCount === rows.length;
      if (allCorrect) completed.add(index);
      else completed.delete(index);
      updateProgress();

      // Chaque clic sur Vérifier prépare un nouveau tirage, même si un
      // précédent était en attente ; ouvrir le corrigé ne consomme rien.
      const ready = variant && queueVariant(index, form, variant, true);
      if (summary) summary.textContent = (allCorrect
        ? 'Exercice validé. Bravo ! '
        : correctCount + ' réponse(s) correcte(s) sur ' + rows.length + '. Tu peux corriger ton essai. ')
        + (ready ? 'Une nouvelle variante avec de nouvelles valeurs est prête.' : '');
    });

    const onChange = event => {
      const row = event.target.closest('.answer-row');
      if (!row) return;
      row.classList.remove('is-correct', 'is-wrong', 'is-revealed');
      const status = row.querySelector('.answer-status');
      if (status) status.textContent = '';
    };
    form.addEventListener('input', onChange);
    form.addEventListener('change', onChange);

    if (reset) {
      reset.addEventListener('click', () => {
        form.reset();
        delete form.dataset.revealed;
        if (correction) correction.open = false;
        completed.delete(index);
        states[index].pending = null;
        if (variant) variant.hidden = true;
        form.querySelectorAll('[data-expect]').forEach(control => {
          control.readOnly = false;
          control.disabled = false;
          control.classList.remove('answer-was-correct', 'answer-was-wrong');
        });
        form.querySelectorAll('.answer-row').forEach(row => row.classList.remove(
          'is-correct', 'is-wrong', 'is-revealed', 'was-correct', 'was-wrong'));
        form.querySelectorAll('.answer-status').forEach(status => { status.textContent = ''; });
        const summary = form.querySelector('.exercise-feedback');
        if (summary) summary.textContent = '';
        updateProgress();
      });
    }
  }

  slides.forEach((slide, index) => wireSlide(slide, index));
  steps.forEach((button, index) => button.addEventListener('click', () => showSlide(index, true)));
  if (prev) prev.addEventListener('click', () => showSlide(current - 1, true));
  if (next) next.addEventListener('click', () => showSlide(current + 1, true));
  const hash = location.hash.match(/^#exercice-(\d+)$/);
  updateProgress();
  showSlide(hash ? Number(hash[1]) - 1 : 0);
})();
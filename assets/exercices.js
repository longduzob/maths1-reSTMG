(() => {
  const root = document.querySelector('[data-interactive-exercises]');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('.exercise-block'));
  const stepButtons = Array.from(root.querySelectorAll('[data-step]'));
  const previousButton = root.querySelector('[data-nav="previous"]');
  const nextButton = root.querySelector('[data-nav="next"]');
  const progressFill = root.querySelector('#exercise-progress-fill');
  const progressLabel = root.querySelector('#exercise-progress-label');
  const scoreText = root.querySelector('#exercise-score');
  const completed = new Set();
  let current = 0;

  const normalise = value => value
    .trim()
    .toLowerCase()
    .replace(/,/g, '.')
    .replace(/\s+/g, '')
    .replace(/[−–—]/g, '-');

  function isControlCorrect(control) {
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
    form.querySelectorAll('[data-expect]').forEach(control => {
      const answer = (control.dataset.expect || '').split('|')[0].trim();
      if (!answer) return;

      if (control.tagName === 'SELECT') {
        const match = Array.from(control.options)
          .find(option => normalise(option.value) === normalise(answer));
        if (match) control.value = match.value;
      } else if (control.dataset.type === 'number') {
        control.value = answer.replace(/\./g, ',');
      } else {
        control.value = answer.replace(/;/g, ' ; ');
      }
    });

    form.querySelectorAll('.answer-row').forEach(row => {
      row.classList.remove('is-correct', 'is-wrong', 'is-revealed');
      row.classList.add('is-revealed');
      const status = row.querySelector('.answer-status');
      if (status) status.textContent = 'Réponse du corrigé';
    });
  }

  function updateRow(row) {
    const controls = Array.from(row.querySelectorAll('[data-expect]'));
    const hasEmpty = controls.some(control => !control.value.trim());
    const correct = controls.length > 0 && controls.every(isControlCorrect);
    const status = row.querySelector('.answer-status');

    row.classList.toggle('is-correct', correct);
    row.classList.toggle('is-wrong', !correct && !hasEmpty);

    if (status) {
      if (correct) {
        status.textContent = 'Correct ✓';
      } else if (hasEmpty) {
        status.textContent = 'Réponse à compléter.';
      } else {
        status.textContent = 'À revoir. Essaie encore.';
      }
    }
    return correct;
  }

  function updateProgress() {
    const done = completed.size;
    const total = slides.length;
    const percent = total ? (done / total) * 100 : 0;
    if (progressFill) progressFill.style.width = percent + '%';
    if (progressLabel) progressLabel.textContent = done + ' / ' + total + ' exercices validés';
    if (scoreText) scoreText.textContent = done + '/' + total;
    stepButtons.forEach((button, index) => {
      button.classList.toggle('is-complete', completed.has(index));
      button.setAttribute('aria-label', 'Exercice ' + (index + 1) + (completed.has(index) ? ', validé' : ''));
    });
  }

  function showSlide(index, moveFocus = false) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.hidden = !active;
      slide.classList.toggle('is-active', active);
    });
    stepButtons.forEach((button, buttonIndex) => {
      const active = buttonIndex === current;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-current', active ? 'step' : 'false');
    });
    if (previousButton) previousButton.disabled = current === 0;
    if (nextButton) {
      nextButton.disabled = current === slides.length - 1;
      nextButton.textContent = current === slides.length - 1 ? 'Fin de la série' : 'Exercice suivant →';
    }
    const slide = slides[current];
    history.replaceState(null, '', '#' + slide.id);
    if (moveFocus) {
      const heading = slide.querySelector('h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
      }
    }
  }

  slides.forEach((slide, index) => {
    const form = slide.querySelector('.exercise-form');
    const reset = slide.querySelector('[data-action="reset"]');
    const correction = slide.querySelector('details.check');
    if (!form) return;

    if (correction) {
      correction.addEventListener('toggle', () => {
        if (!correction.open) return;
        form.dataset.revealed = 'true';
        revealAnswers(form);
        const summary = form.querySelector('.exercise-feedback');
        if (summary) summary.textContent = 'Les bonnes réponses sont affichées dans les cases. Clique sur Effacer pour recommencer sans aide.';
      });
    }

    form.addEventListener('submit', event => {
      event.preventDefault();
      const rows = Array.from(form.querySelectorAll('.answer-row'));
      const results = rows.map(updateRow);
      const allCorrect = results.length > 0 && results.every(Boolean);
      const summary = form.querySelector('.exercise-feedback');

      if (allCorrect) {
        if (form.dataset.revealed === 'true' && !completed.has(index)) {
          if (summary) summary.textContent = 'Réponses correctes, mais le corrigé a été consulté : cet essai ne compte pas pour le score. Clique sur Effacer pour recommencer sans aide.';
        } else {
          completed.add(index);
          if (summary) summary.textContent = 'Exercice validé. Tu peux passer au suivant.';
        }
      } else {
        completed.delete(index);
        const correctCount = results.filter(Boolean).length;
        if (summary) summary.textContent = correctCount + ' réponse(s) correcte(s) sur ' + results.length + '.';
      }
      updateProgress();
    });

    form.addEventListener('input', event => {
      const row = event.target.closest('.answer-row');
      if (!row) return;
      row.classList.remove('is-correct', 'is-wrong', 'is-revealed');
      const status = row.querySelector('.answer-status');
      if (status) status.textContent = '';
    });

    form.addEventListener('change', event => {
      const row = event.target.closest('.answer-row');
      if (!row) return;
      row.classList.remove('is-correct', 'is-wrong', 'is-revealed');
      const status = row.querySelector('.answer-status');
      if (status) status.textContent = '';
    });

    if (reset) {
      reset.addEventListener('click', () => {
        form.reset();
        delete form.dataset.revealed;
        if (correction) correction.open = false;
        completed.delete(index);
        form.querySelectorAll('.answer-row').forEach(row => row.classList.remove('is-correct', 'is-wrong', 'is-revealed'));
        form.querySelectorAll('.answer-status').forEach(status => status.textContent = '');
        const summary = form.querySelector('.exercise-feedback');
        if (summary) summary.textContent = '';
        updateProgress();
      });
    }
  });

  stepButtons.forEach((button, index) => {
    button.addEventListener('click', () => showSlide(index, true));
  });
  if (previousButton) previousButton.addEventListener('click', () => showSlide(current - 1, true));
  if (nextButton) nextButton.addEventListener('click', () => showSlide(current + 1, true));

  const hashMatch = window.location.hash.match(/^#exercice-(\d+)$/);
  const initial = hashMatch ? Number(hashMatch[1]) - 1 : 0;
  updateProgress();
  showSlide(Number.isInteger(initial) ? initial : 0, false);
})();
/* Ameliorations facultatives des lecons : la lecture et les corriges
   restent accessibles en HTML statique sans JavaScript. */
'use strict';

(() => {
  const body = document.body;
  if (!body.classList.contains('lesson-immersive')) return;

  const controls = document.querySelector('.lesson-reading-controls');
  const largeButton = document.getElementById('reading-large-toggle');
  const focusButton = document.getElementById('reading-focus-toggle');

  if (controls && largeButton && focusButton) {
    controls.hidden = false;
    const toggles = [
      [largeButton, 'reading-large'],
      [focusButton, 'reading-focus']
    ];
    for (const [button, className] of toggles) {
      button.addEventListener('click', () => {
        const enabled = body.classList.toggle(className);
        button.setAttribute('aria-pressed', String(enabled));
      });
    }
  }

  document.querySelectorAll('.study-quiz').forEach((quiz, index) => {
    const form = quiz.querySelector('form');
    const feedback = quiz.querySelector('.study-feedback');
    if (!form || !feedback) return;

    // Sans JavaScript : l'enonce et le raisonnement (details) restent disponibles.
    form.hidden = false;
    form.addEventListener('submit', event => {
      event.preventDefault();
      const selection = form.querySelector('input[type="radio"]:checked');
      if (!selection) {
        feedback.dataset.result = 'retry';
        feedback.textContent = 'Choisis une réponse avant de vérifier. Tu peux utiliser le coup de pouce ou relire le passage du cours.';
        return;
      }
      const correct = selection.value === quiz.dataset.correct;
      feedback.dataset.result = correct ? 'correct' : 'retry';
      if (correct) {
        feedback.textContent = '✓ Bien joué ! ' + (quiz.dataset.explanation || 'Tu as retrouvé la bonne méthode.');
      } else {
        feedback.textContent = '↻ Pas encore. ' + (quiz.dataset.hint || 'Relis la méthode et fais un nouvel essai.');
      }
    });
  });

  // Un repere de lecture pour le sommaire, sans convertir le defilement en note.
  const navLinks = Array.from(document.querySelectorAll('.lesson-toc nav a'));
  if ('IntersectionObserver' in window && navLinks.length) {
    const byId = new Map(navLinks.map(link => [decodeURIComponent(link.hash.slice(1)), link]));
    const headings = Array.from(document.querySelectorAll('.lesson-content h2[id]'));
    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (!visible.length) return;
      const link = byId.get(visible[0].target.id);
      if (!link) return;
      navLinks.forEach(item => item.removeAttribute('aria-current'));
      link.setAttribute('aria-current', 'location');
    }, {rootMargin: '-9% 0px -72% 0px', threshold: 0});
    headings.forEach(heading => observer.observe(heading));
  }
})();
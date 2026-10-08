"""End-to-end checks against the actual static site at a project subdirectory URL.
Development dependencies: playwright==1.55.0 and its Chromium browser.
Run python3 tests/browser_smoke.py from any directory.
"""
from __future__ import annotations
import functools
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import quote
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def main():
    handler = functools.partial(QuietHandler, directory=str(ROOT.parent))
    server = ThreadingHTTPServer(('127.0.0.1', 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base = f'http://127.0.0.1:{server.server_port}/{quote(ROOT.name)}/'
    errors, failed_responses = [], []
    paths = (sorted(ROOT.glob('*.html')) + sorted((ROOT / 'cours').glob('*.html'))
             + sorted((ROOT / 'exercices').glob('*.html')))
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            context = browser.new_context()
            page = context.new_page()
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('response', lambda response: failed_responses.append(response.url) if response.status >= 400 else None)
            checks = 0
            for width in [320, 390, 768, 1440]:
                page.set_viewport_size({'width': width, 'height': 900})
                for path in paths:
                    name = path.relative_to(ROOT).as_posix()
                    response = page.goto(base + name, wait_until='networkidle')
                    assert response.status == 200, name
                    expect(page.locator('h1')).to_be_visible()
                    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1'), (name, width, 'horizontal overflow')
                    if name.startswith('exercices/'):
                        expected = 9 if name == 'exercices/fonctions.html' else 8
                        expect(page.locator('.exercise-block')).to_have_count(expected)
                        expect(page.locator('.exercise-stepper button')).to_have_count(expected)
                        expect(page.locator('#exercice-1')).to_be_visible()
                        expect(page.locator('#exercice-2')).to_be_hidden()
                    if name.startswith('cours/'):
                        expect(page.locator('.lesson-toc')).to_be_visible()
                        expect(page.locator('.lesson-content')).to_be_visible()
                        expect(page.locator('.support-scaffold')).to_have_count(1)
                        expect(page.locator('.study-quiz')).to_have_count(2)
                        expect(page.locator('.study-quiz form:visible')).to_have_count(2)
                        expect(page.locator('.lesson-reading-controls')).to_be_visible()
                        assert page.locator('.lesson-toc nav a').count() >= 6
                        assert page.evaluate("Array.from(document.querySelectorAll('.lesson-toc nav a')).every(a => document.getElementById(decodeURIComponent(a.hash.slice(1))))"), name
                    checks += 1
            page.set_viewport_size({'width': 390, 'height': 844})
            page.goto(base + 'exercices/fonctions.html')
            expect(page.locator('.exercise-block')).to_have_count(9)
            expect(page.locator('details.check')).to_have_count(9)
            expect(page.locator('#exercice-1')).to_be_visible()
            expect(page.locator('#exercice-2')).to_be_hidden()
            first_inputs = page.locator('#exercice-1 input[data-expect]')
            values = ['-11', '-5', '7', '5', '0']
            assert first_inputs.count() == len(values)
            for control, value in zip(first_inputs.all(), values):
                control.fill(value)
            page.locator('#exercice-1 button[type="submit"]').click()
            expect(page.locator('#exercice-1 .answer-row.is-correct')).to_have_count(5)
            expect(page.locator('#exercise-score')).to_have_text('1/9')
            page.locator('[data-nav="next"]').click()
            expect(page.locator('#exercice-2')).to_be_visible()
            expect(page.locator('#exercice-1')).to_be_hidden()
            page.locator('[data-step="0"]').click()
            expect(page.locator('#exercice-1')).to_be_visible()
            page.locator('#exercice-1 details.check summary').click()
            assert page.locator('#exercice-1 details.check').evaluate('(el) => el.open')
            expect(page.locator('#exercice-1 .answer-row.is-revealed')).to_have_count(5)
            expect(page.locator('#exercice-1 input.answer-was-correct')).to_have_count(5)
            expect(page.locator('#exercice-1 .answer-row.was-correct')).to_have_count(5)
            for control, expected in zip(first_inputs.all(), values):
                expect(control).to_have_value(expected)
            expect(page.locator('#exercise-score')).to_have_text('1/9')

            # Afficher le corrigé remplit aussi les formules, sans augmenter le score.
            page.locator('[data-step="1"]').click()
            second_inputs = page.locator('#exercice-2 input[data-expect]')
            # Mélange de réponses justes, fausses et une réponse absente.
            second_inputs.nth(0).fill('18')
            second_inputs.nth(1).fill('99')
            second_inputs.nth(2).fill('42')
            page.locator('#exercice-2 details.check summary').click()
            expect(page.locator('#exercice-2 .answer-row.is-revealed')).to_have_count(3)
            expect(page.locator('#exercice-2 input.answer-was-correct')).to_have_count(2)
            expect(page.locator('#exercice-2 input.answer-was-wrong')).to_have_count(2)
            expect(page.locator('#exercice-2 .answer-row.was-correct')).to_have_count(1)
            expect(page.locator('#exercice-2 .answer-row.was-wrong')).to_have_count(2)
            first_color = second_inputs.nth(0).evaluate('(el) => getComputedStyle(el).backgroundColor')
            wrong_color = second_inputs.nth(1).evaluate('(el) => getComputedStyle(el).backgroundColor')
            assert first_color != wrong_color, 'Les bulles vertes et rouges doivent être visibles.'
            for control, expected in zip(second_inputs.all(), ['18', '6', '42', '7']):
                expect(control).to_have_value(expected)
            page.locator('#exercice-2 button[type="submit"]').click()
            expect(page.locator('#exercise-score')).to_have_text('1/9')
            page.locator('#exercice-2 [data-action="reset"]').click()
            expect(page.locator('#exercice-2 details.check')).not_to_have_attribute('open', '')
            expect(page.locator('#exercice-2 input.answer-was-correct')).to_have_count(0)
            expect(page.locator('#exercice-2 input.answer-was-wrong')).to_have_count(0)
            for control in second_inputs.all():
                expect(control).to_have_value('')
            for control, value in zip(second_inputs.all(), ['18', '6', '42', '7']):
                control.fill(value)
            page.locator('#exercice-2 button[type="submit"]').click()
            expect(page.locator('#exercise-score')).to_have_text('2/9')

            # Les réponses à choix, les intervalles et les virgules sont pris en charge.
            page.locator('[data-step="2"]').click()
            page.locator('#exercice-3 details.check summary').click()
            expect(page.locator('#exercice-3 input[data-expect="1;3|1,3"]')).to_have_value('1 ; 3')
            expect(page.locator('#exercice-3 select[data-expect="]1;3["]')).to_have_value(']1 ; 3[')
            expect(page.locator('#exercice-3 select.answer-was-wrong')).to_have_count(1)
            expect(page.locator('#exercice-3 select[data-expect="]1;3["]')).to_be_disabled()
            expect(page.locator('#exercise-score')).to_have_text('2/9')
            page.locator('[data-step="8"]').click()
            page.locator('#exercice-9 details.check summary').click()
            last_inputs = page.locator('#exercice-9 input[data-expect]')
            for control, expected in zip(last_inputs.all(), ['4,9729', '5,0176', '2,23', '2,24']):
                expect(control).to_have_value(expected)
            expect(page.locator('#exercise-score')).to_have_text('2/9')
            # Tous les nouveaux parcours : valider, consulter, recommencer.
            extra_slugs = ['second-degre','suites','suites-arithmetiques','suites-geometriques','derivees','variations','statistiques-deux-variables','probabilites-conditionnelles','bernoulli','variables-aleatoires','calcul','evolutions','logique','statistiques-descriptives','python-tableur']
            for slug in extra_slugs:
                page.goto(base + f'exercices/{slug}.html')
                expect(page.locator('.exercise-block')).to_have_count(8)
                first = page.locator('#exercice-1 [data-expect]')
                assert first.count() >= 2, slug
                for control in first.all():
                    value = control.get_attribute('data-expect').split('|')[0]
                    if control.evaluate('(el) => el.tagName === "SELECT"'):
                        control.select_option(value=value)
                    else:
                        control.fill(value)
                page.locator('#exercice-1 button[type="submit"]').click()
                expect(page.locator('#exercise-score')).to_have_text('1/8')
                page.locator('#exercice-1 details.check summary').click()
                expect(page.locator('#exercice-1 .answer-row.was-correct')).to_have_count(first.count())
                page.locator('[data-nav="next"]').click()
                expect(page.locator('#exercice-2')).to_be_visible()
                page.locator('#exercice-2 details.check summary').click()
                expect(page.locator('#exercice-2 .answer-row.was-wrong')).not_to_have_count(0)
                expect(page.locator('#exercise-score')).to_have_text('1/8')
                page.locator('#exercice-2 [data-action="reset"]').click()
                expect(page.locator('#exercice-2 .answer-row.is-revealed')).to_have_count(0)

            # Questions actives et lecture accessible dans les 16 cours.
            lesson_slugs = ['fonctions', 'second-degre', 'suites',
                            'suites-arithmetiques', 'suites-geometriques',
                            'derivees', 'variations', 'statistiques-deux-variables',
                            'probabilites-conditionnelles', 'bernoulli',
                            'variables-aleatoires', 'calcul', 'evolutions',
                            'logique', 'statistiques-descriptives', 'python-tableur']
            for slug in lesson_slugs:
                page.goto(base + f'cours/{slug}.html')
                quiz1, quiz2 = page.locator('.study-quiz').first, page.locator('.study-quiz').last
                expected = quiz1.get_attribute('data-correct')
                quiz1.locator(f'input[value="{expected}"]').check()
                quiz1.locator('button[type="submit"]').click()
                expect(quiz1.locator('.study-feedback')).to_contain_text('Bien joué')
                assert quiz1.locator('.study-feedback').get_attribute('data-result') == 'correct'
                wrong = next(value for value in ['a', 'b', 'c'] if value != quiz2.get_attribute('data-correct'))
                quiz2.locator(f'input[value="{wrong}"]').check()
                quiz2.locator('button[type="submit"]').click()
                expect(quiz2.locator('.study-feedback')).to_contain_text('Pas encore')
                quiz2.locator(f'input[value="{quiz2.get_attribute("data-correct")}"]').check()
                quiz2.locator('button[type="submit"]').click()
                expect(quiz2.locator('.study-feedback')).to_contain_text('Bien joué')
                quiz2.locator('details summary').click()
                expect(quiz2.locator('details.study-solution')).to_have_attribute('open', '')

            # Ajustement de lecture et couleurs qui aident sans remplacer les mots.
            page.goto(base + 'cours/second-degre.html')
            initial_size = page.locator('.lesson-content').evaluate('(el) => parseFloat(getComputedStyle(el).fontSize)')
            page.locator('#reading-large-toggle').click()
            enlarged_size = page.locator('.lesson-content').evaluate('(el) => parseFloat(getComputedStyle(el).fontSize)')
            assert enlarged_size > initial_size, (initial_size, enlarged_size)
            expect(page.locator('#reading-large-toggle')).to_have_attribute('aria-pressed', 'true')
            page.locator('#reading-focus-toggle').click()
            expect(page.locator('.lesson-toc')).to_be_hidden()
            expect(page.locator('.lesson-content')).to_be_visible()
            page.locator('#reading-focus-toggle').click()
            expect(page.locator('.lesson-toc')).to_be_visible()
            visual_colors = page.evaluate("""() => ({
                formula: getComputedStyle(document.querySelector('.lesson-content .formula')).backgroundColor,
                example: getComputedStyle(document.querySelector('.lesson-content .example')).backgroundColor,
                warning: getComputedStyle(document.querySelector('.lesson-content .warning')).backgroundColor
            })""")
            assert len(set(visual_colors.values())) == 3, visual_colors
            page.locator('.support-scaffold summary').click()
            expect(page.locator('.support-scaffold')).to_have_attribute('open', '')

            page.goto(base + 'lecons.html')
            expect(page.locator('.lesson-card:visible')).to_have_count(16)
            page.locator('#course-search').fill('derivee')
            expect(page.locator('.lesson-card:visible')).to_have_count(2)
            page.locator('#course-search').fill('')
            page.locator('#course-category').select_option('probabilites')
            expect(page.locator('.lesson-card:visible')).to_have_count(3)
            page.locator('#course-search').fill('xyznotfound')
            expect(page.locator('#no-results')).to_be_visible()
            expect(page.locator('.lesson-card:visible')).to_have_count(0)
            page.locator('#course-search').fill('')
            page.locator('#course-category').select_option('')
            page.locator('a.lesson-card[href="cours/fonctions.html"]').click()
            expect(page).to_have_url(base + 'cours/fonctions.html')
            check = page.locator('details.check').first
            check.locator('summary').click()
            assert check.evaluate('(el) => el.open')
            page.evaluate("window.dispatchEvent(new Event('beforeprint'))")
            assert page.locator('details:not([open])').count() == 0
            page.evaluate("window.dispatchEvent(new Event('afterprint'))")
            assert check.evaluate('(el) => el.open')
            page.locator('.course-pagination a').last.click()
            expect(page).to_have_url(base + 'cours/second-degre.html')
            page.goto(base + 'cours/variables-aleatoires.html')
            for probability in ['0', '1', '0.3']:
                page.locator('[name="p"]').fill(probability)
                page.locator('[name="n"]').fill('20')
                page.locator('[name="N"]').fill('40')
                page.locator('#simulation-form button').click()
                expect(page.locator('#simulation-output table tbody tr')).to_have_count(3)
                assert page.locator('.sim-bars span').count() == 10
                assert '40' in page.locator('#simulation-output').inner_text()
                if probability in ['0', '1']:
                    counts = page.locator('#simulation-output tbody tr td:nth-child(2)').all_text_contents()
                    assert counts == ['40', '40', '40'], (probability, counts)
                bins = page.locator('#simulation-output details li').all_text_contents()
                assert sum(int(item.split(':')[-1].strip().split()[0]) for item in bins) == 40
                assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1')
            page.locator('[name="n"]').fill('0')
            page.evaluate("document.querySelector('#simulation-form').dispatchEvent(new Event('submit', {bubbles:true, cancelable:true}))")
            assert 'Choisir' in page.locator('#simulation-output').inner_text()
            nojs = browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 844})
            static = nojs.new_page()
            static.goto(base + 'lecons.html')
            expect(static.locator('.lesson-card:visible')).to_have_count(16)
            expect(static.locator('.catalog-tools')).to_be_hidden()
            static.locator('a.lesson-card[href="cours/calcul.html"]').click()
            expect(static.locator('.lesson-content')).to_be_visible()
            expect(static.locator('.lesson-toc')).to_be_hidden()
            static.locator('details.check summary').click()
            assert static.locator('details.check').evaluate('(el) => el.open')
            expect(static.locator('.study-quiz')).to_have_count(2)
            expect(static.locator('.study-quiz form')).to_have_count(2)
            expect(static.locator('.study-quiz form').first).to_be_hidden()
            static.locator('.study-solution').first.locator('summary').click()
            expect(static.locator('.study-solution').first).to_have_attribute('open', '')
            assert static.evaluate("document.querySelector('.lesson-content').getBoundingClientRect().width >= document.querySelector('.lesson-layout').getBoundingClientRect().width - 2")
            nojs.close()
            assert not errors, errors
            assert not failed_responses, failed_responses
            browser.close()
            print(f'BROWSER OK: {checks} page/width combinations (320, 390, 768, 1440 px); search, filters, TOCs, corrections, print events, navigation, simulation and no-JavaScript fallback.')
            print('No JavaScript exceptions, no HTTP errors, no global horizontal overflow.')
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=3)

if __name__ == '__main__':
    main()

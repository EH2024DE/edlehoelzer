import json
import re
import subprocess
import unittest
from pathlib import Path
from html.parser import HTMLParser


class Structure(HTMLParser):
    VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
            'link', 'meta', 'param', 'source', 'track', 'wbr'}

    def __init__(self, source):
        super().__init__()
        self.stack, self.errors = [], []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        if tag not in self.VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if not self.stack or self.stack[-1] != tag:
            self.errors.append(tag)
        else:
            self.stack.pop()

ROOT = Path(__file__).resolve().parents[1]
SOURCE = (ROOT / 'handgefertigte-holzprodukte-fuer-unternehmen/index.html').read_text()


class B2BClarityTests(unittest.TestCase):
    def test_structure_images_and_fragments(self):
        parsed = Structure(SOURCE.replace(' />', '>'))
        self.assertEqual(parsed.errors, [])
        self.assertEqual(parsed.stack, [])
        ids = re.findall(r'\bid="([^"]+)"', SOURCE)
        self.assertEqual(len(ids), len(set(ids)))
        for fragment in re.findall(r'href="#([^"]+)"', SOURCE):
            self.assertIn(fragment, ids)
        for src in re.findall(r'<img[^>]+src="([^"]+)"', SOURCE):
            self.assertTrue((ROOT / src.removeprefix('./').lstrip('/')).is_file(), src)

    def test_no_implied_business_references_and_concrete_combinations(self):
        main = SOURCE.split('<main')[1].split('</main>')[0]
        self.assertNotIn('b2b-proof-strip', main)
        self.assertNotIn('Gabriel', main)
        self.assertNotIn('Beliebt für Mitarbeitergeschenke', main)
        for text in ['Küchenutensilien-Sets', 'Frühstücksbrett mit Buttermesser',
                     'Schneidebrett mit Pflegebalsam', 'Holzvisitenkarten',
                     'Nach deiner Idee']:
            self.assertIn(text, main)
        self.assertLess(main.index('id="produkte"'), main.index('id="anfrage"'))
        self.assertNotIn('Wenn das Projekt ernst gemeint ist', main)
        self.assertNotIn('<div class="b2b-process">', main)
        self.assertNotIn('<ul class="b2b-form-steps">', main)
        self.assertIn('Erst nach deiner Freigabe setzen wir den Auftrag um.', main)
        products = main.split('<div class="b2b-products"')[1].split('id="vorteile"')[0]
        self.assertEqual(re.findall(r'<h3>(.*?)</h3>', products), [
            'Schneide- &amp; Servierbretter', 'Küchenutensilien-Sets',
            'Geschenksets', 'Massivholz-Visitenkarten'])
        self.assertIn('/assets/kuechenutensilien-set-geschenkbox-800.jpg', products)
        self.assertNotIn('hochwertige-kuechenaccessoires-800.jpg', products)

    def test_form_contract_and_metadata_preserved(self):
        before = subprocess.check_output(['git', 'show', 'origin/main:handgefertigte-holzprodukte-fuer-unternehmen/index.html'], cwd=ROOT, text=True)
        before = before.replace('/b2b.html', '/handgefertigte-holzprodukte-fuer-unternehmen/')
        for marker in [r'<title>.*?</title>', r'<link rel="canonical"[^>]+>',
                       r'<form class="b2b-form"[^>]+>']:
            self.assertEqual(re.search(marker, SOURCE).group(), re.search(marker, before).group())
        fields = lambda s: re.findall(r'<(?:input|select|textarea)\b[^>]*\bname="([^"]+)"', s)
        self.assertEqual(set(fields(SOURCE)), (set(fields(before)) - {'product'}) | {'budget_basis'})
        self.assertIn('data-goatcounter-title="b2b_form_submit"', SOURCE)

    def test_low_barrier_form_and_mobile_swipe(self):
        form = SOURCE.split('<form class="b2b-form"')[1].split('</form>')[0]
        required = re.findall(r'<(?:input|select|textarea)\b[^>]*\brequired\b[^>]*>', form)
        self.assertEqual([re.search(r'name="([^"]+)"', tag)[1] for tag in required],
                         ['name', 'email', 'quantity', 'budget', 'budget_basis', 'message'])
        self.assertNotIn('name="product"', form)
        self.assertIn('Pro Stück / Geschenkset', form)
        self.assertIn('Gesamtprojekt', form)
        self.assertNotIn('name="budget"', form.split('<details class="b2b-optional">')[1])
        self.assertIn('<details class="b2b-optional">', form)
        self.assertIn('grid-auto-flow:column', SOURCE)
        self.assertIn('scroll-snap-type:x mandatory', SOURCE)
        self.assertIn('geschenkset-erster-entwurf-800.jpg', SOURCE)

    def test_price_orientation_has_format_examples(self):
        self.assertIn('Kompakte Langholzbretter · z. B. Frühstücksbrett', SOURCE)
        self.assertIn('Mittlere Langholzbretter · bis ca. 40 × 30 cm', SOURCE)
        self.assertIn('Große Bretter · einfache Stirnholzausführung', SOURCE)
        for price in ['ca. 60 € pro Stück', '90–120 € pro Stück', '180–230 € pro Stück']:
            self.assertIn(price, SOURCE)

    def test_benefits_are_specific_and_qualified(self):
        benefits = SOURCE.split('<dl class="b2b-benefits">')[1].split('</dl>')[0]
        self.assertEqual(benefits.count('<dt>'), 6)
        for text in ['Handgefertigt in Deutschland', 'Dein Logo.', 'regionalem Holz',
                     'sind Mengenrabatte möglich', 'zur Verfügbarkeit', 'Machbarkeit, Preis und Termin']:
            self.assertIn(text, benefits)
        self.assertNotIn('ausschließlich regional', benefits)

    def test_faq_json_matches_visible_copy(self):
        schemas = [json.loads(s) for s in re.findall(r'<script type="application/ld\+json">(.*?)</script>', SOURCE, re.S)]
        faq = next(s for s in schemas if s.get('@type') == 'FAQPage')
        block = SOURCE.split('<div class="b2b-faq">')[1].split('</section>')[0]
        visible = re.findall(r'<h3>(.*?)</h3>\s*<p>(.*?)</p>', block, re.S)
        self.assertEqual([(q['name'], q['acceptedAnswer']['text']) for q in faq['mainEntity']], visible)


if __name__ == '__main__':
    unittest.main()

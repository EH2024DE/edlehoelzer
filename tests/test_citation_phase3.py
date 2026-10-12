import json
import re
import subprocess
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
ROUTES = ("schneidebrett-nach-mass", "hackblock", "stirnholz-vs-langholz", "schneidebrett-aufbereiten")


def normalized(value):
    return re.sub(r"\s+", " ", value).strip()


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.ids, self.links, self.h1, self.schemas, self.qa = [], [], [], [], {}
        self.title, self.canonical = "", ""
        self.capture, self.chunks, self.script, self.question = None, [], None, None
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href", "")
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.script = []
        if tag in ("title", "h1", "h3", "p"):
            self.capture, self.chunks = tag, []

    def handle_data(self, data):
        if self.script is not None:
            self.script.append(data)
        elif self.capture:
            self.chunks.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self.script is not None:
            self.schemas.append(json.loads("".join(self.script)))
            self.script = None
        if tag == self.capture:
            text = normalized("".join(self.chunks))
            if tag == "title":
                self.title = text
            elif tag == "h1":
                self.h1.append(text)
            elif tag == "h3":
                self.question = text
            elif tag == "p" and self.question:
                self.qa.setdefault(self.question, []).append(text)
            self.capture, self.chunks = None, []


def objects(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from objects(child)
    elif isinstance(value, list):
        for child in value:
            yield from objects(child)


class Phase3Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.sources = {r: (ROOT / r / "index.html").read_text() for r in ROUTES}
        cls.pages = {r: Page(s) for r, s in cls.sources.items()}
        cls.products = {p["listingId"]: p for p in json.loads((ROOT / "products.json").read_text())["products"] if p.get("listingId")}

    def test_title_h1_canonical_unchanged(self):
        for route, page in self.pages.items():
            with self.subTest(route=route):
                before = Page(subprocess.check_output(["git", "show", f"origin/main:{route}/index.html"], cwd=ROOT, text=True))
                self.assertEqual((page.title, page.h1, page.canonical), (before.title, before.h1, before.canonical))
                self.assertEqual(len(page.h1), 1)

    def test_unique_ids_and_local_links(self):
        cache = {}
        for route, page in self.pages.items():
            self.assertEqual(len(page.ids), len(set(page.ids)), route)
            for href in page.links:
                u = urlsplit(href)
                if u.scheme or u.netloc:
                    continue
                path = unquote(u.path)
                target = ROOT / path.lstrip("/") if path.startswith("/") else ROOT / route / path
                if target.is_dir():
                    target /= "index.html"
                self.assertTrue(target.is_file(), f"{route}: {href}")
                if u.fragment:
                    if target not in cache:
                        cache[target] = Page(target.read_text()).ids
                    self.assertIn(unquote(u.fragment), cache[target], f"{route}: {href}")

    def test_faq_schema_matches_visible_answers(self):
        for route, page in self.pages.items():
            for obj in objects(page.schemas):
                if obj.get("@type") == "Question":
                    question = normalized(obj["name"])
                    with self.subTest(route=route, question=question):
                        self.assertIn(question, page.qa)
                        self.assertIn(normalized(obj["acceptedAnswer"]["text"]), page.qa[question])

    def test_hackblock_real_catalog_data(self):
        p = self.products["4417507555"]
        self.assertTrue(p["dataVerified"])
        self.assertEqual(p["woodCut"], "end")
        self.assertEqual(p["material"], "Eiche")
        self.assertIn("7,9 kg", p["badges"])
        self.assertEqual(p["sizeLabel"], "59,5 x 38 cm")
        self.assertEqual(p["thicknessLabel"], "4,9 cm")
        self.assertFalse(p["finderProfile"]["juiceGroove"])
        self.assertEqual(p["availabilityStatus"], "made_to_order")
        text = self.sources["hackblock"]
        for value in ("59,5 × 38 cm", "4,9 cm", "7,9 kg", "keine Saftrille", "auf Bestellung", "Ohne ausdrückliche produktbezogene Freigabe"):
            self.assertIn(value, text)
        self.assertNotIn("Schläge aufnehmen", text)

    def test_product_pair_is_not_claimed_as_measured_test(self):
        edge, end = self.products["1774262638"], self.products["4370784882"]
        self.assertEqual((edge["sizeLabel"], edge["thicknessLabel"], edge["woodCut"]), ("40 x 30 cm", "3 cm", "edge"))
        self.assertEqual((end["sizeLabel"], end["thicknessLabel"], end["woodCut"]), ("41 x 30 cm", "4,7 cm", "end"))
        source = self.sources["stirnholz-vs-langholz"]
        block = source.split("Zwei reale Formate aus unserem Sortiment")[1].split("grain-decision-title")[0]
        self.assertNotIn("kg", block)
        self.assertIn("kein Test", block)
        self.assertIn("weder ein Gewichtsunterschied", block)
        self.assertIn('<td>Stirnholz</td><td>Langholz</td>', block)

    def test_project_data_not_inferred_and_phase1_not_duplicated(self):
        source = self.sources["schneidebrett-nach-mass"]
        self.assertEqual(source.count("7,9 kg"), 1)
        projects = source.split('id="referenzprojekt"')[1].split('class="customBudget"')[0]
        self.assertNotRegex(projects, r"\d+\s*kg")
        # Both project dimensions were confirmed by the owner on 2026-10-12.
        self.assertEqual(projects.count("60 × 75 cm bei 5 cm Brettstärke"), 2)
        self.assertIn("kein festes Standardformat", projects)

    def test_refurbishment_not_presented_as_measured_case(self):
        source = self.sources["schneidebrett-aufbereiten"]
        block = source.split('id="ergebnis"')[1].split('id="nicht-weiterarbeiten"')[0]
        self.assertNotRegex(block, r"\d+\s*(mm|kg|€|Tage|Wochen)")
        for text in ("nicht von uns gefertigt", "geglättet und neu geölt", "keine Reparatur struktureller Schäden"):
            self.assertIn(text, block)

    def test_short_summary_answers(self):
        for route, source in self.sources.items():
            block = source.split('id="summary-title"')[1].split("</section>")[0]
            paragraph = re.search(r"<p>(.*?)</p>", block, re.S).group(1)
            sentences = [s for s in re.split(r"[.!?](?:\s|$)", paragraph) if s.strip()]
            self.assertGreaterEqual(len(sentences), 2, route)
            self.assertLessEqual(len(sentences), 5, route)


if __name__ == "__main__":
    unittest.main()

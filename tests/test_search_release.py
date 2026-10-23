import subprocess
import unittest
import re

import test_citation_phase3 as phase3
from test_citation_phase3 import Page, ROOT


class ReleaseTests(phase3.Phase3Tests):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        for route in ("messerschonendes-schneidebrett", "schneidebrett-oel-vergleich",
                      "en/cutting-board-oil-comparison", "en/knife-friendly-cutting-board"):
            cls.sources[route] = (ROOT / route / "index.html").read_text()
            cls.pages[route] = Page(cls.sources[route])

    def test_title_h1_canonical_unchanged(self):
        for route, page in self.pages.items():
            before = Page(subprocess.check_output(["git", "show", f"origin/main:{route}/index.html"], cwd=ROOT, text=True))
            self.assertEqual(page.canonical, before.canonical, route)
            self.assertEqual(page.h1, before.h1, route)
            if route != "messerschonendes-schneidebrett":
                self.assertEqual(page.title, before.title, route)

    def test_unverified_weights_absent(self):
        for route, source in self.sources.items():
            with self.subTest(route=route):
                self.assertNotRegex(source, r"(?:14|20|13[,.]3|10[,.]5|15[,.]8)\s*kg")

    def test_short_summary_answers(self):
        for route in phase3.ROUTES:
            block = self.sources[route].split('class="pageSummary"')[1].split('</section>')[0]
            paragraph = re.search(r"<p>(.*?)</p>", block, re.S).group(1)
            self.assertGreaterEqual(len(re.findall(r"[.!?](?:\s|$)", paragraph)), 2)
            self.assertLessEqual(len(re.findall(r"[.!?](?:\s|$)", paragraph)), 5)

    def test_protected_files_unchanged(self):
        # Catalog prices evolve after release; dedicated product tests cover them.
        for path in ("robots.txt", "llms.txt", "sitemap.xml",
                     "welches-oel-schneidebrett/index.html", "en/index.html",
                     "schneidebrett-eiche-vs-nussbaum/index.html", "schneidebrett-saftrille/index.html"):
            before = subprocess.check_output(["git", "show", f"origin/main:{path}"], cwd=ROOT)
            current = (ROOT / path).read_bytes()
            # Approved route migrations may update links, not protected content.
            current = current.replace(b'/schneidebrett-fachwerk-eiche/', b'/erbstueck/')
            before = before.replace(b'/schneidebrett-fachwerk-eiche/', b'/erbstueck/')
            if path == "sitemap.xml":
                current = re.sub(rb'(<loc>https://edlehoelzer.de/erbstueck/</loc>\s*<lastmod>)[^<]+', rb'\g<1>DATE', current)
                before = re.sub(rb'(<loc>https://edlehoelzer.de/erbstueck/</loc>\s*<lastmod>)[^<]+', rb'\g<1>DATE', before)
            self.assertEqual(current, before, path)

    def test_oil_redirect_preserved(self):
        source = self.sources["schneidebrett-oel-vergleich"]
        before = subprocess.check_output(["git", "show", "origin/main:schneidebrett-oel-vergleich/index.html"], cwd=ROOT, text=True)
        for marker in ('<meta http-equiv="refresh"', 'window.location.replace('):
            current_line = next(line for line in source.splitlines() if marker in line)
            previous_line = next(line for line in before.splitlines() if marker in line)
            self.assertEqual(current_line, previous_line)


if __name__ == "__main__":
    unittest.main()

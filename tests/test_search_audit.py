import importlib.util
import unittest
from pathlib import Path


def load(name, file):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).parents[1] / "scripts" / file)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


gsc = load("gsc", "analyze-gsc-export.py")
inventory = load("inventory", "search-content-inventory.py")


class AuditTests(unittest.TestCase):
    def test_numbers(self):
        self.assertEqual(gsc.number("1.234,5"), 1234.5)
        self.assertEqual(gsc.number("0.27%"), 0.27)

    def test_weighted_position_and_ctr(self):
        result = gsc.aggregate([dict(clicks=1, impressions=10, position=2), dict(clicks=2, impressions=90, position=12)])
        self.assertEqual(result["position"], 11)
        self.assertEqual(result["ctr_percent"], 3)

    def test_brand_is_not_oil(self):
        self.assertEqual(gsc.cluster("edle hölzer"), "Marke")
        self.assertEqual(gsc.cluster("welches öl für schneidebrett"), "Öl und Pflege")

    def test_comparison_headers(self):
        data = {"queries": [{"Häufigste Suchanfragen": "schneidebrett nach maß", "Letzte 3\u00a0Monate Klicks": "2", "Letzte 3\u00a0Monate Impressionen": "100", "Letzte 3\u00a0Monate Position": "10"}]}
        result = gsc.summarize(data, True)
        self.assertEqual(result["periods"]["Letzte 3 Monate"]["clusters"]["Maßanfertigung"]["clicks"], 2)
        self.assertNotIn("query_page_pairs", result)

    def test_static_inventory_ignores_scripts(self):
        page = inventory.Inventory()
        page.feed('<title>Test</title><main><h1>Answer</h1><script>hidden</script><p>Visible</p></main>')
        self.assertNotIn("hidden", " ".join(page.body))
        self.assertEqual(page.headings[0]["text"], "Answer")

    def test_faq_scope_does_not_include_form_disclosures(self):
        page = inventory.Inventory()
        page.feed('<main><details><summary>More wishes</summary></details><div class="faqList"><article class="faqItem"><h3>Real question?</h3><p>Answer</p></article></div></main>')
        self.assertEqual(page.faq, ["Real question?"])


if __name__ == "__main__":
    unittest.main()

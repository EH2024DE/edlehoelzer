"""Build the documented benchmark tables from retained browser evidence."""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / "docs/benchmark-evidence/2026-10-12"
RUNS = json.loads((EVIDENCE / "runs.json").read_text())
if not any(r["prompt_id"] == 12 and r["run"] == 1 for r in RUNS):
    # Initial retained UI evidence predates the timestamped runner.
    RUNS.append({"prompt_id": 12, "run": 1, "date": "2026-10-12",
                 "prompt": "Wann lohnt sich die professionelle Aufbereitung eines Schneidebretts?"})
PARTIAL = {(1, 2), (12, 1), (14, 1)}
CLUSTERS = {
    1: "Massanfertigung/Kuecheninsel", 2: "Massanfertigung/Kauf", 3: "Massanfertigung/Groesse",
    4: "Bauweise", 5: "Bauweise/Messerschonung", 6: "Hackblock", 7: "Holzarten",
    8: "Eiche vs Nussbaum", 9: "BBQ", 10: "Saftrille", 11: "Aufbereitung/Abschleifen",
    12: "Aufbereitung/Service", 13: "Oel/Pflege", 14: "Brotzeit/Servieren", 15: "Qualitaet/Kauf",
}
INTENT = {1: "very_high", 2: "very_high", 3: "very_high", 4: "medium", 5: "medium", 6: "very_high",
          7: "medium", 8: "medium", 9: "very_high", 10: "medium", 11: "medium", 12: "very_high",
          13: "lower", 14: "medium", 15: "very_high"}
SUMMARIES = {
    1: "Material, Bauweise, Arbeitsflaeche und stationaere Nutzung; teils Anbieterempfehlungen.",
    2: "Liste deutscher Anbieter mit Massoptionen und Kauf-/Konfiguratorlinks.",
    3: "Groessenempfehlungen nach Platz und Nutzung; verschiedene konkrete Formate.",
    4: "Vergleich von Faserorientierung, Gewicht, Pflege und Alltagshandling.",
    5: "Messerfreundlichkeit mit Bauweisenvergleich und Produkt-/Testquellen.",
    6: "Auswahlkriterien und Produktvergleich; Ratgeber und Vergleichsportale.",
    7: "Holzartenwahl anhand Haerte, Poren und Eignung; englischsprachige Fachratgeber.",
    8: "Eiche/Nussbaum nach Eigenschaften, Optik und Nutzung; kein universeller Sieger.",
    9: "Tranchieren, ausreichend Flaeche und Fluessigkeiten; Produkt-/BBQ-Empfehlungen.",
    10: "Saftrille fuer Fluessigkeiten; Flaechenverlust und Reinigung als Abwaegung.",
    11: "Schleifabfolge, Pflege und Reparaturgrenzen.",
    12: "Aufbereiten versus Ersetzen nach Zustand, Material und Wirtschaftlichkeit.",
    13: "Geeignete Pflegeoele und Anwendung; Pflege-/Herstellerquellen.",
    14: "Brotzeit und Anrichten nach Holz, Format und Tischwirkung; Produktoptionen.",
    15: "Verarbeitung, Material, Dimensionen und Nutzung als Qualitaetskriterien.",
}


def sources(text):
    # Expanded citation dialogs contain a domain/name followed by a page title.
    found = re.findall(r'button "Open ([^"\n]+)"[^\n]*:\n\s+- generic: ([^\n]+)\n\s+- paragraph: ([^\n]+)', text)
    out = []
    for _, name, title in found:
        item = {"name": name.strip(), "title": title.strip()}
        if item not in out:
            out.append(item)
    return out


fields = "date prompt_id prompt run language eh_source_presence eh_citation_presence eh_url competitor_1 competitor_2 competitor_3 cited_topic gsc_cluster commercial_intent notes".split()
fields += "model_product_mode search_mode region eh_mentioned answer_summary all_visible_sources source_order direct_visible_urls citation_url_status evidence_file source_capture".split()
rows = []
for r in sorted(RUNS, key=lambda x: (x["prompt_id"], x["run"])):
    pid, run = r["prompt_id"], r["run"]
    file = EVIDENCE / f"p{pid:02d}-r{run}.txt"
    raw = file.read_text()
    base = raw.split("SOURCE POPOVER")[0]
    items = sources(raw)
    names = list(dict.fromkeys(x["name"] for x in items))
    badges = list(dict.fromkeys(re.findall(r'button "([^"\n]+ \+\d+)"', base)))
    if (pid, run) in PARTIAL:
        names += [x for x in badges if x not in names]
    urls = list(dict.fromkeys(re.findall(r"/url: (https?://[^\s]+)", raw)))
    urls = [u for u in urls if not re.search(r"(chatgpt\.com|openai\.com)", u)]
    positive = (pid, run) == (12, 1)
    notes = "Visible UI only; exact model and hidden queries unavailable. Source order is first observed, not a ranking."
    if (pid, run) in PARTIAL:
        notes += " Incomplete expansion of +N source list: absence cannot be established."
    if positive:
        notes += " EH appears in grouped inline citation beside replacement guidance for deeply scratched plastic boards; individual claim attribution and exact EH URL not resolved. Not evidence of a service-price citation."
        notes += " Initial retained capture: date known, exact timestamp unavailable; not in runs.json."
    if pid == 6:
        notes += " Generic phrase edle Hoelzer is not an EH brand mention."
    rows.append({
        "date": r["date"], "prompt_id": f"P{pid:02d}", "prompt": r["prompt"], "run": run,
        "language": "de", "eh_source_presence": "unknown" if (pid, run) in PARTIAL else "no",
        "eh_citation_presence": "yes_grouped" if positive else "no_visible",
        "eh_url": "", "competitor_1": names[0] if names else "",
        "competitor_2": names[1] if len(names) > 1 else "", "competitor_3": names[2] if len(names) > 2 else "",
        "cited_topic": "Replacement guidance; grouped EH +1 citation, individual attribution unresolved" if positive else "",
        "gsc_cluster": CLUSTERS[pid], "commercial_intent": INTENT[pid], "notes": notes,
        "model_product_mode": "ChatGPT; logged out; exact model not exposed", "search_mode": "Websuche selected",
        "region": "not_visible", "eh_mentioned": "citation_domain_only" if positive else "no_brand_observed",
        "answer_summary": SUMMARIES[pid], "all_visible_sources": json.dumps(items, ensure_ascii=False),
        "source_order": json.dumps(names, ensure_ascii=False), "direct_visible_urls": json.dumps(urls, ensure_ascii=False),
        "citation_url_status": "EH exact URL unresolved" if positive else "Popover title/domain observed; URLs only where visible",
        "evidence_file": str(file.relative_to(ROOT)), "source_capture": "partial" if (pid, run) in PARTIAL else "expanded",
    })
with (ROOT / "docs/chatgpt-citation-results.csv").open("w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fields)
    writer.writeheader()
    writer.writerows(rows)

# Brief page observations, not assertions about ChatGPT's internal ranking.
K = "https://kraterholz.com/blogs/kaufberatung/welches-schneidebrett-fuer-kuecheninsel"
N = "https://naturecrafts.de/blogs/wissenswertes/langsholz-oder-stirnholz-schneidebrett"
S = "https://www.spechtwerk.com/shop/erhoehtes-schneidebrett-nach-mass/"
B = "https://bevelandbond.com/blogs/blog/best-cutting-board-with-juice-groove"
gap_data = [
    (1, "Kraterholz", K, "Hersteller-Ratgeber", "yes", "yes", "product links; no measured workshop case", "formats", "yes", "no named author observed", "Quick choice by use", "Existing EH examples lack verified case weight", "Annotate existing island example", "public title match, citation href not captured"),
    (2, "SPECHTWERK", S, "Produktseite", "yes", "product attributes, not comparison", "product and custom options", "product dimensions/options", "not fully assessed", "maker brand", "Direct custom-product purchase path", "EH already explains inquiry; concrete reference specs can improve evidence", "Add verified reference specification", "direct href observed in P02-R1"),
    (3, "Kraterholz", K, "Hersteller-Ratgeber", "yes", "yes", "product links", "formats", "yes", "no named author observed", "Concrete size/use associations", "No missing generic size guide", "Use measured EH kitchen-island example", "public title match"),
    (4, "NatureCrafts", N, "Hersteller-Ratgeber", "yes", "yes", "own product links; no paired test observed", "not a measured pair", "yes", "brand, no individual observed", "Self-contained comparison", "EH already has comparable table", "Measured equal-format handling example instead of more generic text", "public title match"),
    (5, "Serious Eats", "https://www.seriouseats.com/best-wooden-cutting-boards", "Magazin/Fachtest", "yes", "yes", "documented hands-on tests", "yes", "yes", "Grace Kelly", "Named test method and photos", "EH has no equivalent knife-edge test", "Do not invent test; document handling only", "public title match"),
    (6, "WELT", "https://www.welt.de/vergleich/hackblock/", "Vergleichsportal", "criteria", "yes", "physical testing not established", "product specs", "yes", "Marc H.", "Scannable product selection; affiliate context", "EH product facts mostly dynamic", "Static verified product-spec block; no testsieger claim", "public title match"),
    (7, "WOOD Magazine", "https://www.woodmagazine.com/wood-supplies/wood-species/best-food-safe-wood-cutting-boards", "Fachquelle", "yes", "no", "editorial advice, not workshop test", "no", "species distinction", "staff/editorial policy", "Focused species answer", "EH broad guide; exact species evidence matters", "Primary species references only where useful", "public title match"),
    (8, "Rune-Jakobsen", "https://rune-jakobsen.com/en-de/blogs/rune-jakobsen-design/oak-vs-walnut-which-type-of-wood-is-best-for-cutting-boards", "Hersteller-Ratgeber", "yes", "not DOM verified", "not measured product test", "density/Janka references", "hardness not knife proof", "not verified", "Referenced species data", "EH ranks well; no evidence title is problem", "Protect; consider primary reference after review", "public search title match, direct page retrieval incomplete"),
    (9, "Bevel & Bond", B, "Hersteller-Ratgeber", "yes", "yes", "own products, no independent trial", "product specs", "yes", "James Taylor", "Use and product specifications linked", "EH can show usable area for actual BBQ board", "Optional real product example; not universal thickness rule", "same provider; groove page contextual analysis, exact P09 URL unresolved"),
    (10, "Bevel & Bond", B, "Hersteller-Ratgeber", "yes", "yes", "own products", "product specs", "yes", "James Taylor", "With/without and concrete products", "EH already has table and contra", "Protect; measured area example only", "public title match"),
    (11, "Deer & Oak", "https://www.deerandoak.co.uk/blogs/news/how-to-sand-a-wooden-cutting-board", "Hersteller-Ratgeber", "yes", "product table", "no documented repair case observed", "SKU sizes/weights", "yes", "no individual observed", "Immediate procedure and product context", "EH already has procedure and before/after", "Add verified case caption only", "public title match"),
    (12, "BfR / Verbraucherzentrale / USDA FSIS", "", "Fachquelle", "not page audited", "unknown", "unknown", "unknown", "food safety", "institution", "Safety authority, not manufacturer competitor", "EH grouped citation already observed; exact URL missing", "Verify EH citation URL; no blanket rewrite", "source names observed, exact URLs not recovered"),
    (13, "Bevel & Bond", "", "Hersteller-Ratgeber", "not exact page audited", "unknown", "unknown", "unknown", "unknown", "unknown", "Repeated provider across questions", "Insufficient exact-page evidence", "Protect successful oil pages", "provider observed; exact oil article unresolved"),
    (14, "woodprojectstosell.com / Manufactum", "https://www.manufactum.de/", "Ratgeber / Shop", "not exact page audited", "unknown", "unknown", "product sizes in response", "unknown", "unknown", "Visible serving-product examples", "EH format/role distinctions can be more concrete", "Real breakfast versus hosting format table; verify missing sources first", "partial source list; Manufactum homepage is observed destination, not inferred product URL"),
    (15, "Bevel & Bond / Manufactum", "", "Hersteller-Ratgeber / Shop", "not exact pages audited", "unknown", "unknown", "unknown", "unknown", "unknown", "Quality criteria with product context", "No single proven new content gap", "Observe; reuse verified workshop facts", "source names observed; exact article URLs unresolved"),
]
gap_fields = "prompt_id competitor competitor_url page_type direct_answer comparison_table first_party_evidence concrete_measurements limitations author_signal likely_advantage eh_gap recommended_action url_evidence".split()
with (ROOT / "docs/chatgpt-competitor-gap.csv").open("w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(gap_fields)
    writer.writerows((f"P{x[0]:02d}", *x[1:]) for x in gap_data)

assert len(rows) == 37
assert len({(r["prompt_id"], r["run"]) for r in rows}) == 37
assert all(sum(r["prompt_id"] == f"P{i:02d}" for r in rows) == 3 for i in range(1, 11))
assert sum(r["source_capture"] == "partial" for r in rows) == 3
assert sum(r["eh_citation_presence"] == "yes_grouped" for r in rows) == 1
assert all(not r["eh_url"] for r in rows)
assert len(gap_data) == 15
print("Validated: 37 runs, 15 prompts, first 10 repeated 3 times, 3 partial captures, 1 grouped EH citation.")

"""Summarize GSC UI ZIP exports without inventing query-to-page joins."""
import argparse
import csv
import io
import json
import re
import zipfile
from pathlib import Path


CLUSTERS = [
    ("Marke", r"edle[ -]h[oö]lzer|edle hoelzer"),
    ("Maßanfertigung", r"(?:nach|auf) ma[ßs]|sonderma[ßs]|ma[ßs]anfertig|made.to.measure|custom.*board|k[üu]cheninsel"),
    ("Öl und Pflege", r"\b[oö]l|ölen|einölen|lein|tung|mineral|pflege|bienenwachs|\boil\b|wax|care"),
    ("Aufbereitung", r"aufbereit|abschleif|schleifen|verzogen|riss|rau\b|riecht|refurb|sanding|warped"),
    ("Gravur", r"gravur|graviert|engrav|personalisiert"),
    ("Saftrille", r"saftrille|juice groove"),
    ("Bauweise und Hackblock", r"stirnholz|langholz|längsholz|hirnholz|hackblock|butcher|end grain|edge grain"),
    ("Holzarten", r"nussbaum|walnuss|eiche|buche|ahorn|holzart|walnut|oak|beech|maple|best wood"),
    ("Frühstück und Servieren", r"brotzeit|frühstück|servier|tapas|charcuterie|snack|breakfast|serving"),
    ("Geschenk", r"geschenk|gift|hochzeit|wedding"),
    ("Messer und Qualität", r"messer|qualität|hochwertig|knife|quality"),
    ("Herkunft", r"germany|deutschland|manufaktur|regional|nachhaltig|handmade"),
    ("Massivholz allgemein", r"massivholz|holzschneidebrett|wooden cutting board"),
]


def cluster(query):
    # One primary cluster per query; avoids double-counting in totals.
    return next((name for name, pattern in CLUSTERS if re.search(pattern, query, re.I)), "Sonstige")


def number(value):
    text = str(value).strip().replace("\u00a0", "").replace(" ", "").replace("%", "")
    if "," in text:
        text = text.replace(".", "").replace(",", ".")
    return float(text or 0)


def read_zip(path):
    result = {}
    with zipfile.ZipFile(path) as archive:
        for name in archive.namelist():
            if name.endswith(".csv"):
                rows = list(csv.DictReader(io.StringIO(archive.read(name).decode("utf-8-sig"))))
                # ZIP filename encoding varies; CSV headers identify dimensions.
                if name.startswith("Suchanfragen"):
                    key = "queries"
                elif name.startswith("Seiten"):
                    key = "pages"
                elif name.startswith("Diagramm"):
                    key = "dates"
                elif name.startswith("Filter"):
                    key = "filters"
                elif name.startswith("Darstellung"):
                    key = "appearance"
                elif name.startswith("Ger"):
                    key = "devices"
                else:
                    key = "countries"
                result[key] = rows
    return result


def metrics(row, period=""):
    prefix = period + " " if period else ""
    return {key: number(row.get(prefix + label, 0)) for key, label in
            [("clicks", "Klicks"), ("impressions", "Impressionen"), ("position", "Position")]}


def aggregate(rows):
    impressions = sum(row["impressions"] for row in rows)
    clicks = sum(row["clicks"] for row in rows)
    return {"clicks": clicks, "impressions": impressions,
            "ctr_percent": round(100 * clicks / impressions, 3) if impressions else 0,
            "position": round(sum(row["position"] * row["impressions"] for row in rows) / impressions, 2) if impressions else None}


def summarize(data, comparison=False):
    periods = ["Letzte 3\u00a0Monate", "Vorherige 3\u00a0Monate"] if comparison else [""]
    # Google uses NBSP in headers. Normalize only for matching.
    normalized = {dimension: [{k.replace("\u00a0", " "): v for k, v in row.items()} for row in rows]
                  for dimension, rows in data.items()}
    result = {"limitation": "Separate query/page exports are NOT a Query x Page join. Query totals exclude anonymized queries and may be row-limited.",
              "row_counts": {key: len(rows) for key, rows in data.items()}, "filters": data.get("filters", [])}
    result["periods"] = {}
    for period in periods:
        period = period.replace("\u00a0", " ")
        queries = []
        for row in normalized.get("queries", []):
            query = next(iter(row.values()))
            queries.append({"query": query, "cluster": cluster(query), **metrics(row, period)})
        buckets = {name: aggregate([r for r in queries if r["cluster"] == name]) for name in sorted({r["cluster"] for r in queries})}
        dimensions = {}
        for dimension in ["pages", "devices", "countries", "appearance"]:
            dimensions[dimension] = [{"label": next(iter(row.values())), **metrics(row, period)}
                                     for row in normalized.get(dimension, [])]
        result["periods"][period or "full"] = {"exported_query_totals": aggregate(queries), "clusters": buckets,
            "opportunities_5_to_15": sorted([r for r in queries if 5 <= r["position"] <= 15 and r["impressions"] >= 20], key=lambda r: -r["impressions"]),
            **dimensions}
    dates = data.get("dates", [])
    if dates:
        result["available_date_range"] = [min(row["Datum"] for row in dates), max(row["Datum"] for row in dates)]
        result["property_totals"] = aggregate([metrics(row) for row in dates])
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("zip", type=Path)
    parser.add_argument("--comparison", action="store_true")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    args.output.write_text(json.dumps(summarize(read_zip(args.zip), args.comparison), ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {args.output}; no query/page join inferred.")

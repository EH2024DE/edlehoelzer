"""Reproducible static HTML inventory; excludes navigation from content counts."""
import argparse
import csv
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse


class Inventory(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.title = []
        self.meta = {}
        self.canonical = ""
        self.alternates = []
        self.headings = []
        self.faq = []
        self.links = []
        self.images = []
        self.body = []
        self.schemas = []
        self.errors = []
        self.main = 0
        self.capture = None
        self.script = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag not in {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}:
            is_faq = "faq" in (attrs.get("class", "") + " " + attrs.get("id", "")).lower()
            self.stack.append((tag, is_faq))
        if tag == "main":
            self.main += 1
        if tag == "meta":
            self.meta[attrs.get("name", attrs.get("property", ""))] = attrs.get("content", "")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href", "")
        if tag == "link" and attrs.get("hreflang"):
            self.alternates.append(attrs)
        if tag == "script":
            self.script = {"type": attrs.get("type"), "text": []}
        if tag == "title" or (self.main and tag in ["h1", "h2", "h3", "summary"]):
            self.capture = {"tag": tag, "text": [], "faq": any(frame[1] for frame in self.stack)}
        if self.main and tag == "a":
            self.links.append(attrs.get("href", ""))
        if self.main and tag == "img":
            self.images.append({"src": attrs.get("src", ""), "alt": attrs.get("alt", "")})

    def handle_endtag(self, tag):
        if self.capture and self.capture["tag"] == tag:
            text = " ".join(" ".join(self.capture["text"]).split())
            if tag == "title":
                self.title.append(text)
            elif tag != "summary":
                self.headings.append({"level": tag, "text": text})
            if self.capture["faq"] and tag in {"h3", "summary"}:
                self.faq.append(text)
            self.capture = None
        if tag == "script" and self.script:
            if self.script["type"] == "application/ld+json":
                try:
                    self.schemas.append(json.loads("".join(self.script["text"])))
                except json.JSONDecodeError as error:
                    self.errors.append(str(error))
            self.script = None
        if tag == "main":
            self.main = max(0, self.main - 1)
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                break

    def handle_data(self, text):
        if self.script is not None:
            self.script["text"].append(text)
            return
        if self.capture:
            self.capture["text"].append(text)
        if self.main:
            self.body.append(text)


def schema_types(value):
    result = set()
    if isinstance(value, dict):
        kind = value.get("@type", [])
        result.update([kind] if isinstance(kind, str) else kind)
        for child in value.values():
            result.update(schema_types(child))
    elif isinstance(value, list):
        for child in value:
            result.update(schema_types(child))
    return result


def schema_questions(value):
    if isinstance(value, dict):
        found = [value.get("name", "")] if value.get("@type") == "Question" else []
        return found + [question for child in value.values() for question in schema_questions(child)]
    if isinstance(value, list):
        return [question for child in value for question in schema_questions(child)]
    return []


def generate(root):
    records = []
    for file in sorted(root.rglob("*.html")):
        if any(part in [".git", "node_modules", "build"] for part in file.relative_to(root).parts):
            continue
        page = Inventory()
        page.feed(file.read_text())
        text = " ".join(" ".join(page.body).split())
        links = list(dict.fromkeys(page.links))
        records.append({
            "file": str(file.relative_to(root)), "url": page.canonical,
            "title": " ".join(page.title), "meta_description": page.meta.get("description", ""),
            "robots": page.meta.get("robots", ""), "headings": page.headings,
            "word_count_main": len(text.split()), "first_150_words": " ".join(text.split()[:150]),
            "main_text": text, "faq_questions": list(dict.fromkeys(page.faq + [q for q in schema_questions(page.schemas) if q in text])),
            "schema_types": sorted(schema_types(page.schemas)), "schema_errors": page.errors,
            "internal_links_main": [link for link in links if link.startswith(("/", "#", "https://edlehoelzer.de"))],
            "external_links_main": [link for link in links if link.startswith("http") and urlparse(link).hostname != "edlehoelzer.de"],
            "contact_links_main": [link for link in links if link.startswith(("mailto:", "tel:"))],
            "images_main": page.images, "hreflang": page.alternates,
        })
    return records


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    parser.add_argument("--csv-output")
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    records = generate(root)
    Path(args.output).write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n")
    if args.csv_output:
        assessments = {row["file"]: row for row in csv.DictReader((root / "docs/search-page-assessments.csv").open())}
        fields = ["file", "url", "title", "h1", "meta_description", "headings", "word_count_main", "first_150_words", "faq_questions", "schema_types", "internal_links_main", "external_links_main", "contact_links_main", "first_party_signals", "intent", "primary_query", "secondary_clusters", "citation_fit", "intent_fit", "first_party_fit", "conversion_fit", "conversion_path", "action"]
        with Path(args.csv_output).open("w", newline="") as stream:
            writer = csv.DictWriter(stream, fieldnames=fields)
            writer.writeheader()
            for record in records:
                row = {key: record.get(key, "") for key in fields}
                row["h1"] = " | ".join(h["text"] for h in record["headings"] if h["level"] == "h1")
                row.update(assessments.get(record["file"], {}))
                for key, value in row.items():
                    if isinstance(value, (dict, list)):
                        row[key] = json.dumps(value, ensure_ascii=False)
                writer.writerow(row)
    print(f"Inventoried {len(records)} HTML files into {args.output}")

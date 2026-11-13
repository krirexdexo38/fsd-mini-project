"""List overdue reviews and current triggers without treating history as live decisions."""

import argparse
from datetime import date
from pathlib import Path
import re
import sys


FILES = ("infrastructure.md", "decisions.md", "runtime.md")


def active_lines(text, *, decisions=False):
    sections = [[]]
    fence = ""
    for number, line in enumerate(text.splitlines(), 1):
        marker = re.match(r"^\s*(`{3,}|~{3,})", line)
        if marker:
            token = marker.group(1)
            if not fence:
                fence = token
            elif token[0] == fence[0] and len(token) >= len(fence):
                fence = ""
            continue
        if fence:
            continue
        if re.match(r"^##\s+Change C-\S+", line):
            break
        if decisions and re.match(r"^##\s+", line):
            sections.append([])
        sections[-1].append((number, line))

    for section in sections:
        if decisions and any(
            re.match(r"^\s*(?:[-*]\s+)?(?:\*\*)?Superseded by(?:\*\*)?\s*[:\u2014-]\s*\S", line)
            for _, line in section
        ):
            continue
        yield from section


def findings(text, today, *, decisions=False):
    for number, line in active_lines(text, decisions=decisions):
        match = re.match(r"^\s*(?:[-*]\s+)?(NEXT REVIEW|TRIGGER):\s*(.*?)\s*$", line)
        if not match:
            continue
        field, value = match.groups()
        if field == "TRIGGER":
            yield number, "TRIGGER" if value else "MALFORMED", line.strip()
            continue
        try:
            if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
                raise ValueError("use YYYY-MM-DD")
            review_date = date.fromisoformat(value)
        except ValueError:
            yield number, "MALFORMED", line.strip()
        else:
            if review_date < today:
                yield number, "PAST-DUE", line.strip()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", type=Path, default=Path.cwd(), help="project root")
    arguments = parser.parse_args()
    checked = found = 0
    for name in FILES:
        path = arguments.root / "definitions" / name
        try:
            text = path.read_text(encoding="utf-8")
        except FileNotFoundError:
            continue
        except (OSError, UnicodeError):
            print(f"Could not read {path}; check its permissions and UTF-8 encoding.", file=sys.stderr)
            return 1
        checked += 1
        for number, kind, line in findings(text, date.today(), decisions=name == "decisions.md"):
            print(f"{kind} definitions/{name}:{number}: {line}")
            found += 1
    if not checked:
        print(f"No decision files found under {arguments.root}.")
    else:
        print(f"Checked {checked} decision files; found {found} review dates or triggers to inspect.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

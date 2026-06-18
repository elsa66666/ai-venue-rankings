#!/usr/bin/env python3
"""Validate manually maintained venue JSON files."""

from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
VALID_TYPES = {"conference", "journal"}
VALID_CCF = {"A", "B", "C", "None", "Unknown"}
CONFERENCE_DATE_FIELDS = ("deadline", "notification", "conference_date")
CONFERENCE_REQUIRED = {
    "type",
    "abbr",
    "full_name",
    "field",
    "ccf_rank",
    "deadline",
    "notification",
    "conference_date",
    "location",
    "website",
    "submission_cycle",
    "note",
}
JOURNAL_REQUIRED = {
    "type",
    "abbr",
    "full_name",
    "field",
    "ccf_rank",
    "cas_partition",
    "jcr_quartile",
    "impact_factor",
    "publisher",
    "submission_mode",
    "website",
    "warning",
    "note",
}


def load_json(name: str) -> list[dict]:
    with (DATA_DIR / name).open(encoding="utf-8") as handle:
      data = json.load(handle)
    if not isinstance(data, list):
        raise ValueError(f"{name} must contain a JSON array")
    return data


def is_date_or_tbd(value: object) -> bool:
    if value == "TBD":
        return True
    if not isinstance(value, str):
        return False
    try:
        datetime.strptime(value, "%Y-%m-%d")
    except ValueError:
        return False
    return True


def validate_record(record: dict, required: set[str], index: int, source: str) -> list[str]:
    errors: list[str] = []
    label = f"{source}[{index}] {record.get('abbr', '<missing abbr>')}"

    missing = sorted(required - record.keys())
    if missing:
        errors.append(f"{label}: missing fields: {', '.join(missing)}")

    if record.get("type") not in VALID_TYPES:
        errors.append(f"{label}: invalid type {record.get('type')!r}")

    if record.get("ccf_rank") not in VALID_CCF:
        errors.append(f"{label}: invalid ccf_rank {record.get('ccf_rank')!r}")

    if not isinstance(record.get("field"), list) or not record.get("field"):
        errors.append(f"{label}: field must be a non-empty list")

    website = record.get("website")
    if not isinstance(website, str) or not website.startswith(("http://", "https://")):
        errors.append(f"{label}: website must be an official http(s) URL")

    return errors


def validate_conferences(records: list[dict]) -> list[str]:
    errors: list[str] = []
    for index, record in enumerate(records):
        errors.extend(validate_record(record, CONFERENCE_REQUIRED, index, "conferences.json"))
        if record.get("type") != "conference":
            errors.append(f"conferences.json[{index}] {record.get('abbr', '<missing abbr>')}: type must be conference")
        if record.get("ccf_rank") not in {"A", "B", "C"}:
            errors.append(f"conferences.json[{index}] {record.get('abbr', '<missing abbr>')}: conference sample should be CCF A/B/C only")
        for field in CONFERENCE_DATE_FIELDS:
            if field in record and not is_date_or_tbd(record[field]):
                errors.append(f"conferences.json[{index}] {record.get('abbr', '<missing abbr>')}: {field} must be YYYY-MM-DD or TBD")
    return errors


def validate_journals(records: list[dict]) -> list[str]:
    errors: list[str] = []
    for index, record in enumerate(records):
        errors.extend(validate_record(record, JOURNAL_REQUIRED, index, "journals.json"))
        if record.get("type") != "journal":
            errors.append(f"journals.json[{index}] {record.get('abbr', '<missing abbr>')}: type must be journal")
        partition = record.get("cas_partition")
        if not isinstance(partition, str) or not partition:
            errors.append(f"journals.json[{index}] {record.get('abbr', '<missing abbr>')}: cas_partition must be a non-empty string")
    return errors


def main() -> int:
    conferences = load_json("conferences.json")
    journals = load_json("journals.json")
    errors = validate_conferences(conferences) + validate_journals(journals)

    print("Validation summary")
    print(f"- conferences: {len(conferences)}")
    print(f"- journals: {len(journals)}")
    print(f"- missing fields / invalid values: {len(errors)}")

    if errors:
        print("\nIssues:")
        for error in errors:
            print(f"- {error}")
        return 1

    print("\nAll data records look valid.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

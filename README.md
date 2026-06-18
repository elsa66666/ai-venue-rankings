# AI Venue Rankings

A static GitHub Pages website for tracking AI-related conferences and journals with CCF ranking, conference deadline, journal partition, JCR quartile, impact factor, official website, and submission notes.

Screenshot placeholder: add a screenshot after the first GitHub Pages deployment.

## Features

- Search by abbreviation, full name, field, note, publisher, or location.
- Filter by venue type, field, CCF rank, CAS partition, JCR quartile, upcoming submission deadline, and rolling submission.
- Sort by deadline, CCF rank, abbreviation, or numeric impact factor.
- Show journal impact factor as a dedicated table/card field.
- Show conference date, abstract deadline, submission deadline, and notification date as separate columns.
- Toggle between table and card views.
- Vanilla HTML, CSS, JavaScript, and JSON only.
- Works on GitHub Pages with no build step.

## Data Sources and Inspirations

This repository is inspired by these projects and data-source ideas:

- `ccfddl/ccf-deadlines`
- `Hanscal/ai-conference-deadlines`
- `hitfyd/ShowJCR`
- `yosh3289/jcr_mcp`
- `zhangyifei01/CV_AI_Journals`

The current version does not scrape websites automatically. Data is manually maintained in `data/conferences.json` and `data/journals.json`.

Journal CAS partition, JCR quartile, impact factor, and warning fields were filled from the ShowJCR CSV files referenced by `yosh3289/jcr_mcp`: `FQBJCR2025-UTF8.csv`, `JCR2024-UTF8.csv`, and `XR2026-UTF8.csv`.

## Data Disclaimer

This repository does not guarantee the correctness of CCF ranking, CAS partition, JCR quartile, impact factor, deadlines, locations, or warning status. Ranking and partition information may change over time. Always verify information from official CCF, CAS, JCR, and venue websites before submission.

CCF rankings are currently checked against the 2026 CCF directory mirror at `https://ccf.atom.im/`, with the official CCF page linked from that mirror. Conference examples in this repository should be limited to CCF-listed conferences. Use `TBD`, `Unknown`, or `None` when exact values are uncertain or a venue is not listed.

## Run Locally

Open `index.html` directly in a browser, or run a tiny static server:

```bash
cd ai-venue-rankings
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Validate Data

```bash
cd ai-venue-rankings
python3 scripts/validate_data.py
```

## Add a Conference

Edit `data/conferences.json` and add a record like:

```json
{
  "type": "conference",
  "abbr": "ACL",
  "full_name": "Annual Meeting of the Association for Computational Linguistics",
  "field": ["NLP", "AI"],
  "ccf_rank": "A",
  "core_rank": "A*",
  "abstract_deadline": "TBD",
  "submission_deadline": "TBD",
  "deadline": "TBD",
  "notification": "TBD",
  "notification_date": "TBD",
  "conference_date": "TBD",
  "location": "TBD",
  "website": "https://www.aclweb.org/portal/acl",
  "submission_cycle": "annual",
  "date_source": "TBD",
  "note": "Main NLP conference."
}
```

Use `YYYY-MM-DD` for known dates or `TBD` for unknown dates. The visible conference deadline columns are `abstract_deadline`, `submission_deadline`, and `notification_date`; `deadline` is kept as a submission-deadline alias. Keep conference examples to CCF A/B/C venues only.

## Add a Journal

Edit `data/journals.json` and add a record like:

```json
{
  "type": "journal",
  "abbr": "TPAMI",
  "full_name": "IEEE Transactions on Pattern Analysis and Machine Intelligence",
  "field": ["CV", "AI"],
  "ccf_rank": "A",
  "cas_partition": "Unknown",
  "jcr_quartile": "Unknown",
  "impact_factor": "TBD",
  "publisher": "IEEE",
  "submission_mode": "rolling",
  "website": "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=34",
  "warning": "Unknown",
  "note": "Top journal in computer vision and pattern recognition."
}
```

Use `Unknown` or `TBD` for uncertain partition, quartile, impact factor, or warning values.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Open the repository settings.
3. Go to Pages.
4. Select branch `main`.
5. Select root folder `/`.
6. Open the generated GitHub Pages URL.

No build step is required.

## License

MIT

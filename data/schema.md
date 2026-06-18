# Data Schema

This project uses two manually maintained JSON files:

- `data/conferences.json`
- `data/journals.json`

No automatic scraping is required for the static site. Add or update venues by editing JSON records directly, then run `python scripts/validate_data.py`.

## Conference Record

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

Conference `ccf_rank` must be one of `A`, `B`, `C`, `None`, or `Unknown`. For this repository, conference examples should be kept to CCF-listed conferences only.

Date fields use `YYYY-MM-DD` or `TBD`. The UI shows `abstract_deadline`, `submission_deadline`, and `notification_date` as separate columns. The legacy `deadline` field is kept as an alias of `submission_deadline` for simple sorting and backward compatibility.

## Journal Record

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

Use `Unknown` or `TBD` for uncertain CCF, CAS, JCR, impact factor, warning, or deadline values. Verify against official CCF, CAS, JCR, and venue pages before relying on the data.

Current journal partition fields use the ShowJCR data sources referenced by `yosh3289/jcr_mcp`: `cas_partition` comes from `FQBJCR2025`, `jcr_quartile` and `impact_factor` come from `JCR2024`, and `warning` comes from `XR2026`.

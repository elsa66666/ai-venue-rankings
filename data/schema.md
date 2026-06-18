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
  "deadline": "TBD",
  "notification": "TBD",
  "conference_date": "TBD",
  "location": "TBD",
  "website": "https://www.aclweb.org/portal/acl",
  "submission_cycle": "annual",
  "note": "Main NLP conference."
}
```

Conference `ccf_rank` must be one of `A`, `B`, `C`, `None`, or `Unknown`. For this repository, conference examples should be kept to CCF-listed conferences only.

Date fields use `YYYY-MM-DD` or `TBD`.

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

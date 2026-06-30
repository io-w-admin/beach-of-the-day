# Beach of the Day

Simple static site that shows a map of the island and selects one beach per day.

Quick start (run from the repo root):

```bash
npm run serve
# then open http://localhost:8000 in your browser
```


Building website for deployment
```bash
npm i
npm run build
# result files (minified) are saved in dist/ directory

```

Edit `beaches.json` to add or change beaches. The selection is deterministic per day (UTC).

# SolidFrame.ai

AI-powered business automation solutions.

## Site Structure

The `site/` folder contains the solidframe.ai website. Each subfolder maps to a URL route:

| Route | Folder | Description |
|-------|--------|-------------|
| `/` | `site/home/` | Main landing page |
| `/hvac` | `site/hvac/` | HVAC AI Dispatcher landing page |
| `/hvac/dashboard` | `site/hvac/app/` | HVAC demo application |

See `site/pages.json` for the complete page registry.

## Adding a New Landing Page

1. Create a folder: `site/[route-name]/`
2. Add `index.html` and any CSS/assets
3. Add entry to `site/pages.json`
4. Deploy

## Project Structure

```
solidframe/
├── site/              # The website (deploy this to Vercel)
│   ├── pages.json     # Page registry
│   ├── home/          # Root landing page
│   └── hvac/          # HVAC landing + demo app
├── archive/           # Old experiments (preserved for reference)
├── openspec/          # Specifications
├── outreach/          # Business files
└── scraper/           # Utility scripts
```

## Development

### Landing Pages
Static HTML/CSS - just edit and deploy.

### HVAC Demo App
```bash
cd site/hvac/app/frontend
npm install
npm run dev
```

Backend:
```bash
cd site/hvac/app/backend
pip install -r requirements.txt
uvicorn main:app --reload
```

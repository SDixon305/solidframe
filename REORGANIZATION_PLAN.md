# SolidFrame.ai Reorganization Plan

## Objective
Restructure the current workspace to serve as the monorepo/root for the "SolidFrame.ai" agency, housing multiple distinct projects including the existing "HVAC Agent Demo" and a new "HVAC landing page".

## Current Structure Analysis
The current root directory `/Users/sethdixon/AI SLOP/HVAC Agent Demo` contains the full stack application for the HVAC demo.
- **Backend**: `backend/` (Python/FastAPI)
- **Frontend**: `frontend/` (Next.js)
- **Documentation**: `docs/`, `*.md`, `*.txt`
- **Configuration**: Root `package.json` (ngrok), `.gitignore`

## Proposed Structure
We will treat the current root directory as the `solidframe.ai` agency folder. We will create subdirectories for each project.

```
/ (Current Root -> solidframe.ai)
├── .git/                       # Remains at root
├── .gitignore                  # Updated root gitignore
├── REORGANIZATION_PLAN.md      # This file
├── HVAC Agent Demo/            # [MOVED] Existing project container
│   ├── backend/
│   ├── frontend/
│   ├── docs/
│   ├── AGENTS.md
│   ├── ARCHITECTURE.md
│   ├── README.md
│   ├── package.json            # (Moved from root)
│   └── ... (all other project files)
└── HVAC landing page/          # [NEW] Simple landing page project
    └── README.md               # Initial placeholder
```

## Migration Steps

### 1. Create Project Directories
- Create directory `HVAC Agent Demo`.
- Create directory `HVAC landing page`.

### 2. Migrate "HVAC Agent Demo" Files
The following items will be moved from the root into `HVAC Agent Demo/`:
- **Directories**:
    - `backend/`
    - `frontend/`
    - `docs/`
    - `node_modules/` (Root level modules)
- **Files**:
    - `AGENTS.md`
    - `AI-Editor-Prompt.txt`
    - `ARCHITECTURE.md`
    - `DEPLOYMENT_CHECKLIST.md`
    - `DEPLOYMENT_GUIDE.md`
    - `FINAL_FIX_SUMMARY.md`
    - `FIX_SUMMARY.md`
    - `HVAC_AI_Agency_Pricing_2025.txt`
    - `QUICK_START.md`
    - `README.md`
    - `ROI_Calculator_Engineering_Spec.md`
    - `ROI_Calculator_PRD.md`
    - `twilio_research.md`
    - `package.json`
    - `package-lock.json`
    - `.env` (if exists in root - currently none seen in root list, but check)
    - `localtunnel.log`, `ngrok.log` (if preserved)

### 3. Root Level Maintenance
- The `.git` directory will remain in the root.
- A new root `README.md` can be created to describe the agency structure.
- The root `.gitignore` should be reviewed. It likely ignores `node_modules` and `.env`. We can keep a basic one at the root.

## Impact Analysis
- **IDE**: You may need to update your "Active Document" paths or reopen the workspace if you want to focus on a specific sub-project.
- **Terminals**: Any running terminals (like the `uvicorn` server in `backend`) will need to be stopped and restarted from the new path `HVAC Agent Demo/backend`.
- **Git**: Git history will be preserved, but file paths will show as renamed.

## Next Steps
1.  Execute the file moves.
2.  Create the `HVAC landing page` folder.
3.  Verify the structure.

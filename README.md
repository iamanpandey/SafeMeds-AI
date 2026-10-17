# SafeMeds AI

**Hear medicine details. Know when to verify.**

SafeMeds AI is an accessibility-focused student prototype that helps people read printed medicine-label text. This version connects the existing frontend to a FastAPI backend that runs OCR on an uploaded image.

> **Safety note:** OCR only extracts visible text. It can misread medicine names, strengths, batch numbers, and dates. It does not authenticate a medicine, prescribe a dose, or determine whether a medicine is safe. Always compare results with the original package and ask a pharmacist or clinician when needed.

## What works in this version

- Existing HTML/CSS design is retained; no visual redesign is intended.
- Upload and preview a label image.
- Send the image to the FastAPI backend.
- OCR extraction using Tesseract (English and Hindi language packs on Render).
- Heuristic extraction of likely medicine name, strength, batch number, manufacturing date, expiry date, and printed instructions.
- Display all OCR text for manual comparison.
- Read extracted details aloud using the browser's speech synthesis.
- Chat answers use the latest OCR fields for basic label questions and refuse dosage/safety recommendations.
- Image-size and file-type checks, API error handling, and health endpoints.

**Prototype limitations:** OCR output and extracted fields are not guaranteed to be correct. Field extraction uses simple patterns, not a trained medicine-understanding model. The assistant is rule-based, not a generative AI medical assistant. Voice input support depends on the browser/device.

## Project structure

```text
SafeMeds-AI/
├── index.html
├── styles.css
├── script.js
├── README.md
├── .gitignore
├── build.sh
├── backend/
│   ├── main.py
│   └── requirements.txt
└── tests/
    └── test_extraction.py
```

## Run the backend locally (Windows)

### 1. Install Tesseract OCR

Install Tesseract OCR for Windows and ensure `tesseract.exe` is available on your PATH. Install the English language data; install Hindi language data too if available.

If Tesseract is installed in a non-standard location, add this near the top of `backend/main.py` and update the path:

```python
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
```

### 2. Create a virtual environment and install Python packages

Run these commands in the project root in PowerShell:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r backend/requirements.txt
```

### 3. Start FastAPI

```powershell
uvicorn backend.main:app --reload
```

API docs: `http://127.0.0.1:8000/docs`  
Health check: `http://127.0.0.1:8000/health`

## Connect the existing frontend to the API

In `script.js`, find this setting near the top:

```javascript
const API_BASE_URL = "";
```

Set it to your backend URL. For local testing:

```javascript
const API_BASE_URL = "http://127.0.0.1:8000";
```

For deployment, use the actual URL assigned by Render, for example:

```javascript
const API_BASE_URL = "https://YOUR-BACKEND-NAME.onrender.com";
```

Replace the example with your real backend URL. Save and push `script.js` to GitHub; the static frontend should redeploy automatically.

## Deploy the backend on Render

Create a **Web Service** using the same GitHub repository.

- **Runtime:** Python 3
- **Root Directory:** leave blank (project root)
- **Build Command:** `bash build.sh`
- **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path:** `/health` (if the dashboard offers this setting)

`build.sh` installs Tesseract and its Hindi language pack, then installs the Python dependencies.

After deployment:
1. Open `https://YOUR-BACKEND-NAME.onrender.com/health` and confirm it returns `{"status":"ok"}`.
2. Copy the actual backend URL.
3. Put that URL in `API_BASE_URL` in `script.js`.
4. Commit and push the frontend update.
5. Test a clear medicine-label image on the existing frontend URL.

### CORS

For the first prototype, the API allows cross-origin requests. After the frontend is deployed, you can restrict the backend by setting the `FRONTEND_ORIGIN` environment variable to the exact frontend URL. Do not include a trailing slash unless your deployment URL requires it.

## API endpoint

`POST /api/scan`

Send a multipart form upload with the field name `file` containing an image.

Example response:

```json
{
  "success": true,
  "raw_text": "text recognized from the label",
  "fields": {
    "medicine_name": "text detected as a possible name",
    "strength": "500 mg",
    "batch_number": "A1234",
    "manufacturing_date": "01/2024",
    "expiry_date": "01/2027",
    "printed_instructions": null
  },
  "warning": "OCR may misread printed text..."
}
```

Fields may be `null` when not detected. Do not assume a missing field means the information is absent from the actual package.

## Run the field-extraction tests

From the project root:

```powershell
python -m unittest discover -s tests
```

These tests validate a few sample text patterns only; they do not measure OCR accuracy on real images.

## Roadmap

- Improve OCR cleanup and extraction with test images and labelled examples.
- Add a carefully scoped bilingual question-answering layer grounded in OCR output.
- Add accessibility testing with screen readers and keyboard-only navigation.
- Add automated backend tests and request logging that avoids storing medicine images.
- Evaluate accuracy against a labelled test set before making performance claims.

## Goals

- **SDG 3:** Good Health and Well-Being
- **SDG 10:** Reduced Inequalities

## Developer

Aman Pandey · Student project · AI and Assistive Technology

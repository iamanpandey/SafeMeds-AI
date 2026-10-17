import io
import os
import re
from datetime import datetime
from typing import Optional

import pytesseract
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageOps, UnidentifiedImageError
from pydantic import BaseModel

APP_VERSION = "0.1.0"
MAX_IMAGE_BYTES = 8 * 1024 * 1024

app = FastAPI(
    title="SafeMeds AI API",
    description="Prototype API for extracting printed text from medicine-label images.",
    version=APP_VERSION,
)

# For a student prototype, allow the static frontend to call this API.
# For production, set FRONTEND_ORIGIN to your exact Render frontend URL.
frontend_origin = os.getenv("FRONTEND_ORIGIN", "*")
origins = ["*"] if frontend_origin == "*" else [x.strip() for x in frontend_origin.split(",") if x.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class ExtractedFields(BaseModel):
    medicine_name: Optional[str] = None
    strength: Optional[str] = None
    batch_number: Optional[str] = None
    manufacturing_date: Optional[str] = None
    expiry_date: Optional[str] = None
    printed_instructions: Optional[str] = None


class ScanResponse(BaseModel):
    success: bool
    raw_text: str
    fields: ExtractedFields
    warning: str


def clean_value(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip(" :-|")


def extract_fields(text: str) -> ExtractedFields:
    """Heuristic extraction only; OCR text is not medical verification."""
    lines = [clean_value(line) for line in text.splitlines()]
    lines = [line for line in lines if line]
    joined = "\n".join(lines)

    strength = None
    strength_match = re.search(
        r"\b\d+(?:\.\d+)?\s?(?:mg|mcg|µg|g|kg|ml|mL|l|IU|units?)\b(?:\s*/\s*\d+(?:\.\d+)?\s?(?:ml|mL))?",
        joined,
        re.IGNORECASE,
    )
    if strength_match:
        strength = clean_value(strength_match.group(0))

    batch = None
    batch_match = re.search(
        r"(?:batch(?:\s*(?:no|number))?|lot(?:\s*(?:no|number))?)\s*[:#\-]?\s*([A-Z0-9][A-Z0-9\-\/]{1,})",
        joined,
        re.IGNORECASE,
    )
    if batch_match:
        batch = clean_value(batch_match.group(1))

    # Common printed labels and date formats; retain the text as read rather than
    # trying to infer or correct dates that OCR may have misread.
    date_pattern = r"([0-3]?\d[\/\-.][01]?\d[\/\-.](?:\d{4}|\d{2})|\d{4}[\/\-.][01]?\d[\/\-.][0-3]?\d|[01]?\d[\/\-.](?:\d{4}|\d{2})|[A-Za-z]{3,9}\s+\d{4})"
    mfg = None
    expiry = None
    mfg_match = re.search(r"(?:mfg\.?\s*(?:date)?|manufactur(?:e|ed|ing)\s*date|date\s*of\s*manufacture)\s*[:\-]?\s*" + date_pattern, joined, re.IGNORECASE)
    exp_match = re.search(r"(?:exp(?:iry|iration)?\.?\s*(?:date)?|use\s*before|best\s*before)\s*[:\-]?\s*" + date_pattern, joined, re.IGNORECASE)
    if mfg_match:
        mfg = clean_value(mfg_match.group(1))
    if exp_match:
        expiry = clean_value(exp_match.group(1))

    instructions = None
    instruction_keywords = re.compile(
        r"\b(take|dosage|dose|directions|instructions|before food|after food|once daily|twice daily|oral use|for external use)\b",
        re.IGNORECASE,
    )
    candidate_lines = [line for line in lines if instruction_keywords.search(line)]
    if candidate_lines:
        instructions = " ".join(candidate_lines[:3])[:500]

    # Avoid guessing the medicine name from arbitrary OCR text. Choose a likely
    # first non-metadata line, and expose the full OCR text for user review.
    medicine_name = None
    metadata = re.compile(
        r"(batch|lot|mfg|manufactur|exp|expiry|best before|use before|mg\b|mcg\b|ml\b|composition|store below|keep out)",
        re.IGNORECASE,
    )
    for line in lines[:10]:
        if len(line) >= 3 and not metadata.search(line) and not line.isdigit():
            medicine_name = line[:120]
            break

    return ExtractedFields(
        medicine_name=medicine_name,
        strength=strength,
        batch_number=batch,
        manufacturing_date=mfg,
        expiry_date=expiry,
        printed_instructions=instructions,
    )


@app.get("/")
def root():
    return {
        "name": "SafeMeds AI API",
        "version": APP_VERSION,
        "status": "running",
        "disclaimer": "OCR extracts printed text; it does not verify medicine identity, authenticity, dosage, or safety.",
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/scan", response_model=ScanResponse)
async def scan_label(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=415, detail="Please upload a JPG, PNG, or other supported image file.")

    raw = await file.read(MAX_IMAGE_BYTES + 1)
    if not raw:
        raise HTTPException(status_code=400, detail="The uploaded image is empty.")
    if len(raw) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Image is too large. Please use an image smaller than 8 MB.")

    try:
        image = Image.open(io.BytesIO(raw))
        image = ImageOps.exif_transpose(image).convert("RGB")
    except (UnidentifiedImageError, OSError):
        raise HTTPException(status_code=400, detail="The image could not be opened. Please try another JPG or PNG.")

    # English + Hindi OCR. Hindi language data is installed by build.sh on Render.
    try:
        raw_text = pytesseract.image_to_string(image, lang="eng+hin", config="--psm 6").strip()
    except pytesseract.TesseractError:
        try:
            raw_text = pytesseract.image_to_string(image, lang="eng", config="--psm 6").strip()
        except Exception as exc:
            raise HTTPException(status_code=503, detail="OCR is not ready on the server. Please try again later.") from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Could not process this image. Try a clearer photo.") from exc

    if not raw_text:
        return ScanResponse(
            success=True,
            raw_text="",
            fields=ExtractedFields(),
            warning="No text was detected. Try a sharper, well-lit photo with the full label visible.",
        )

    return ScanResponse(
        success=True,
        raw_text=raw_text[:12000],
        fields=extract_fields(raw_text),
        warning="OCR may misread printed text. Compare every field with the package; this result is not medical verification.",
    )

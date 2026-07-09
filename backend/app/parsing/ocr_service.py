import os

import fitz
import pytesseract
from PIL import Image, ImageOps


class OCRService:
    """
    OCR service for scanned PDF pages.

    Features:
    - Automatic initialization
    - 300 DPI rendering
    - Grayscale conversion
    - OCR optimization
    """

    _initialized = False

    @classmethod
    def initialize(cls):

        if cls._initialized:
            return

        tesseract_path = os.getenv("TESSERACT_PATH")

        if tesseract_path:
            pytesseract.pytesseract.tesseract_cmd = tesseract_path

        cls._initialized = True

    @classmethod
    def extract_text(
        cls,
        page: fitz.Page,
    ) -> str:

        cls.initialize()

        # Render at approximately 300 DPI
        matrix = fitz.Matrix(4, 4)

        pix = page.get_pixmap(
            matrix=matrix,
            alpha=False,
        )

        image = Image.frombytes(
            "RGB",
            [pix.width, pix.height],
            pix.samples,
        )

        # Convert to grayscale
        image = ImageOps.grayscale(image)

        # OCR configuration
        config = (
            "--oem 3 "
            "--psm 6 "
            "-l eng"
        )

        text = pytesseract.image_to_string(
            image,
            config=config,
        )

        return text.strip()
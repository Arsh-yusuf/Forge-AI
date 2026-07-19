import os

import fitz
import pytesseract
from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageStat


class OCRService:
    """
    OCR service for scanned PDF pages.

    Features:
    - Automatic initialization
    - 300 DPI rendering
    - Grayscale conversion
    - Image preprocessing (sharpening, contrast enhancement, binarization)
    - Smart PSM selection based on page density
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
    def _preprocess(cls, image: Image.Image) -> Image.Image:

        # Enhance contrast
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(2.0)

        # Sharpen
        image = image.filter(ImageFilter.SHARPEN)

        # Binarize using adaptive threshold
        image = image.point(lambda x: 0 if x < 160 else 255)

        return image

    @classmethod
    def _select_psm(cls, image: Image.Image) -> int:

        stat = ImageStat.Stat(image)
        avg_brightness = stat.mean[0]

        # Very bright pages (low ink density) are likely diagrams/P&IDs
        # Use PSM 11 (sparse text) for diagrams
        # Use PSM 6 (uniform block) for regular documents
        return 11 if avg_brightness > 240 else 6

    @classmethod
    def extract_text(
        cls,
        page: fitz.Page,
    ) -> str:

        cls.initialize()

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

        image = ImageOps.grayscale(image)

        image = cls._preprocess(image)

        psm = cls._select_psm(image)

        config = (
            f"--oem 3 "
            f"--psm {psm} "
            f"-l eng"
        )

        text = pytesseract.image_to_string(
            image,
            config=config,
        )

        return text.strip()
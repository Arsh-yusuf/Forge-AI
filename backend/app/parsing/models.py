from dataclasses import dataclass, field


@dataclass
class PageData:
    page_number: int
    text: str


@dataclass
class ParsedDocument:
    pages: list[PageData] = field(default_factory=list)

    @property
    def full_text(self) -> str:
        return "\n\n".join(page.text for page in self.pages)

    @property
    def page_count(self) -> int:
        return len(self.pages)
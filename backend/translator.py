import os
from typing import Optional

_client = None

def get_client():
    global _client
    if _client is None:
        from google.cloud import translate_v2 as translate
        _client = translate.Client()
    return _client

def translate_text(
    text: str,
    target_lang: str,
    source_lang: Optional[str] = None
) -> str:
    if not text or not text.strip():
        return text
    result = get_client().translate(
        text,
        target_language=target_lang,
        source_language=source_lang,
        format_="text"
    )
    return result["translatedText"]

def to_english(text: str, source_lang: str) -> str:
    return translate_text(text, "en", source_lang)

def from_english(text: str, target_lang: str) -> str:
    return translate_text(text, target_lang, "en")

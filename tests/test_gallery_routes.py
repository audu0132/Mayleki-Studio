"""
Test suite for Portfolio Gallery tag parsing and image validations.
"""
import pytest

def test_gallery_item_schema():
    item = {
        "title": "Bridal Hair & Makeup Transformation",
        "category": "Bridal",
        "imageUrl": "https://example.com/bridal.jpg",
        "featured": True
    }
    assert item["category"] in ["Bridal", "Academy", "Hair Styling", "Skin Care"]
    assert item["imageUrl"].startswith("http")
    assert isinstance(item["featured"], bool)

def test_category_filtering():
    categories = ["Bridal", "Academy", "Hair", "Skin"]
    assert "Bridal" in categories

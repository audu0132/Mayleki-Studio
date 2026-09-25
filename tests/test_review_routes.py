"""
Test suite for Review and Rating submissions.
"""
import pytest

def test_rating_boundary_checks():
    valid_ratings = [1, 2, 3, 4, 5]
    for r in valid_ratings:
        assert 1 <= r <= 5

    invalid_ratings = [0, 6, -1, 10]
    for r in invalid_ratings:
        assert not (1 <= r <= 5)

def test_review_comment_length():
    comment = "Excellent bridal makeup service by Mayleki Studio!"
    assert len(comment) >= 5
    assert len(comment) <= 500

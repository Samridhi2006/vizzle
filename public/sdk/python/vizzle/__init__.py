"""
Vizzle — Python SDK for the Vizzle Virtual Try-On API.

Quick start::

    from vizzle import VizzleClient

    client = VizzleClient(api_key="vzk_your_key")
    result = client.tryon(product_id="...", user_photo_url="https://...")
    status = client.wait_for_tryon(result.prediction_id)
    print(status.output_url)
"""
from .client import VizzleClient
from .models import TryOnResult, TryOnStatus, VideoResult, VideoStatus, CreditBalance
from .exceptions import (
    VizzleError,
    AuthenticationError,
    InsufficientCreditsError,
    ModerationRejectedError,
    RateLimitError,
    NotFoundError,
    ServerError,
)

__version__ = "1.0.0"
__all__ = [
    "VizzleClient",
    "TryOnResult",
    "TryOnStatus",
    "VideoResult",
    "VideoStatus",
    "CreditBalance",
    "VizzleError",
    "AuthenticationError",
    "InsufficientCreditsError",
    "ModerationRejectedError",
    "RateLimitError",
    "NotFoundError",
    "ServerError",
]

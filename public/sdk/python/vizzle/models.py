"""
Vizzle Python SDK — data models
"""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class TryOnResult:
    """Returned immediately by client.tryon() — poll status() until done."""
    prediction_id: str
    status: str  # "starting" | "processing" | "succeeded" | "failed"


@dataclass
class TryOnStatus:
    """Full status of a try-on prediction."""
    prediction_id: str
    status: str
    output_url: Optional[str] = None       # HTTPS URL of result image when done
    error: Optional[str] = None
    created_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


@dataclass
class VideoResult:
    """Returned immediately by client.generate_video() — poll video_status() until done."""
    prediction_id: str
    status: str  # "starting" | "processing" | "succeeded" | "failed"


@dataclass
class VideoStatus:
    """Full status of a video generation prediction."""
    prediction_id: str
    status: str
    output_url: Optional[str] = None       # HTTPS URL of result MP4 when done
    error: Optional[str] = None
    created_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


@dataclass
class CreditBalance:
    """Current credit wallet state for a store."""
    balance: float
    tier: str
    requests_per_hour: int
    requests_per_day: int
    transactions: list = field(default_factory=list)

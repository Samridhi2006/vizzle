"""
Vizzle Python SDK — VizzleClient
"""
import time
from typing import Optional
import urllib.request
import urllib.error
import json

from .exceptions import (
    VizzleError,
    AuthenticationError,
    InsufficientCreditsError,
    ModerationRejectedError,
    RateLimitError,
    NotFoundError,
    ServerError,
)
from .models import TryOnResult, TryOnStatus, VideoResult, VideoStatus, CreditBalance

_DEFAULT_BASE_URL = "https://vizzle-backend.onrender.com"


class VizzleClient:
    """
    Python client for the Vizzle Virtual Try-On API.

    Usage::

        from vizzle import VizzleClient

        client = VizzleClient(api_key="vzk_your_api_key_here")

        # Start a try-on
        result = client.tryon(
            product_id="prod_abc123",
            user_photo_url="https://example.com/photo.jpg",
        )

        # Poll until done
        status = client.wait_for_tryon(result.prediction_id)
        print(status.output_url)
    """

    def __init__(
        self,
        api_key: str,
        base_url: str = _DEFAULT_BASE_URL,
        timeout: int = 30,
    ):
        if not api_key:
            raise ValueError("api_key must be provided")
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    # ── Internal ──────────────────────────────────────────────────────────────

    def _request(self, method: str, path: str, body: Optional[dict] = None) -> dict:
        url = f"{self.base_url}{path}"
        data = json.dumps(body).encode() if body else None
        req = urllib.request.Request(
            url,
            data=data,
            method=method,
            headers={
                "x-api-key": self.api_key,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                return json.loads(resp.read())
        except urllib.error.HTTPError as e:
            status = e.code
            try:
                payload = json.loads(e.read())
            except Exception:
                payload = {}
            message = payload.get("error", e.reason or "Unknown error")

            if status == 401:
                raise AuthenticationError(message, status, payload) from e
            if status == 402:
                raise InsufficientCreditsError(message, status, payload) from e
            if status == 422:
                raise ModerationRejectedError(message, status, payload) from e
            if status == 429:
                raise RateLimitError(message, status, payload) from e
            if status == 404:
                raise NotFoundError(message, status, payload) from e
            if status >= 500:
                raise ServerError(message, status, payload) from e
            raise VizzleError(message, status, payload) from e
        except urllib.error.URLError as e:
            raise VizzleError(f"Network error: {e.reason}") from e

    # ── Try-On ────────────────────────────────────────────────────────────────

    def tryon(
        self,
        product_id: str,
        user_photo_url: str,
        garment_type: Optional[str] = None,
        use_vision: Optional[bool] = None,
    ) -> TryOnResult:
        """
        Start an image try-on. Returns immediately with a prediction_id.
        Costs ₹2.50 per call (deducted from your credit balance).
        """
        body = {"product_id": product_id, "user_photo_url": user_photo_url}
        if garment_type:
            body["garment_type"] = garment_type
        if use_vision is not None:
            body["use_vision"] = use_vision

        data = self._request("POST", "/api/v1/tryon", body)
        return TryOnResult(
            prediction_id=data["prediction_id"],
            status=data.get("status", "starting"),
        )

    def tryon_status(self, prediction_id: str) -> TryOnStatus:
        """Poll the status of a try-on prediction."""
        data = self._request("GET", f"/api/v1/tryon/status/{prediction_id}")
        return TryOnStatus(
            prediction_id=prediction_id,
            status=data["status"],
            output_url=data.get("output_url"),
            error=data.get("error"),
        )

    def wait_for_tryon(
        self,
        prediction_id: str,
        poll_interval: float = 3.0,
        max_wait: float = 120.0,
    ) -> TryOnStatus:
        """
        Block until the try-on is complete or max_wait seconds elapse.
        Returns the final TryOnStatus.
        """
        elapsed = 0.0
        while elapsed < max_wait:
            status = self.tryon_status(prediction_id)
            if status.status in ("succeeded", "failed", "canceled"):
                return status
            time.sleep(poll_interval)
            elapsed += poll_interval
        raise TimeoutError(f"Try-on {prediction_id} did not complete within {max_wait}s")

    # ── Video ─────────────────────────────────────────────────────────────────

    def generate_video(
        self,
        image_url: str,
        motion_type: Optional[str] = None,
        duration: Optional[int] = None,
        fps: Optional[int] = None,
    ) -> VideoResult:
        """
        Start a video generation job. Returns immediately with a prediction_id.
        Costs ₹5.00 per call.

        motion_type: "subtle_walk" | "pose_showcase" | "gentle_turn"
        """
        body: dict = {"image_url": image_url}
        if motion_type:
            body["motion_type"] = motion_type
        if duration:
            body["duration"] = duration
        if fps:
            body["fps"] = fps

        data = self._request("POST", "/api/v1/generate-video", body)
        return VideoResult(
            prediction_id=data["prediction_id"],
            status=data.get("status", "starting"),
        )

    def video_status(self, prediction_id: str) -> VideoStatus:
        """Poll the status of a video generation prediction."""
        data = self._request("GET", f"/api/v1/generate-video/status/{prediction_id}")
        return VideoStatus(
            prediction_id=prediction_id,
            status=data["status"],
            output_url=data.get("output_url"),
            error=data.get("error"),
        )

    def wait_for_video(
        self,
        prediction_id: str,
        poll_interval: float = 5.0,
        max_wait: float = 300.0,
    ) -> VideoStatus:
        """Block until the video is complete or max_wait seconds elapse."""
        elapsed = 0.0
        while elapsed < max_wait:
            status = self.video_status(prediction_id)
            if status.status in ("succeeded", "failed", "canceled"):
                return status
            time.sleep(poll_interval)
            elapsed += poll_interval
        raise TimeoutError(f"Video {prediction_id} did not complete within {max_wait}s")

    # ── Credits ───────────────────────────────────────────────────────────────

    def credits(self, store_id: str) -> CreditBalance:
        """Get the current credit balance for a store."""
        data = self._request("GET", f"/api/credits?store_id={store_id}")
        tier = data.get("tier", {})
        return CreditBalance(
            balance=data.get("balance", 0),
            tier=tier.get("tier", "BASIC"),
            requests_per_hour=tier.get("requestsPerHour", 100),
            requests_per_day=tier.get("requestsPerDay", 1000),
            transactions=data.get("transactions", []),
        )

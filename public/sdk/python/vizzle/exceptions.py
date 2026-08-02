"""
Vizzle Python SDK — exceptions
"""


class VizzleError(Exception):
    """Base exception for all Vizzle SDK errors."""

    def __init__(self, message: str, status_code: int | None = None, body: dict | None = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.body = body or {}

    def __repr__(self):
        return f"{self.__class__.__name__}(status={self.status_code}, message={self.message!r})"


class AuthenticationError(VizzleError):
    """Raised when the API key is missing or invalid (HTTP 401)."""


class InsufficientCreditsError(VizzleError):
    """Raised when the store does not have enough credits (HTTP 402)."""

    @property
    def balance(self) -> float:
        return self.body.get("balance", 0.0)

    @property
    def required(self) -> float:
        return self.body.get("required", 0.0)


class ModerationRejectedError(VizzleError):
    """Raised when the uploaded image is rejected by AI content moderation (HTTP 422)."""


class RateLimitError(VizzleError):
    """Raised when the store exceeds its rate limit (HTTP 429)."""


class NotFoundError(VizzleError):
    """Raised when a requested resource does not exist (HTTP 404)."""


class ServerError(VizzleError):
    """Raised for unexpected server-side errors (HTTP 5xx)."""

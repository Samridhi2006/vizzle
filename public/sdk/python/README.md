# Vizzle Python SDK

Python client for the [Vizzle Virtual Try-On API](https://vizzle.ai). Zero external dependencies — uses Python stdlib only.

## Installation

```bash
pip install vizzle
# or from source:
pip install -e sdk/python/
```

## Quick Start

```python
from vizzle import VizzleClient

client = VizzleClient(api_key="vzk_your_api_key_here")

# ── Image Try-On ─────────────────────────────────────────────────────────────
result = client.tryon(
    product_id="your_product_sku",
    user_photo_url="https://example.com/shopper.jpg",
    garment_type="upper_body",   # optional
)

# Block until done (polls every 3s, max 2min)
status = client.wait_for_tryon(result.prediction_id)
print(status.output_url)   # → set as <img src="...">

# ── Video Generation ─────────────────────────────────────────────────────────
video = client.generate_video(
    image_url=status.output_url,
    motion_type="subtle_walk",   # "subtle_walk" | "pose_showcase" | "gentle_turn"
    duration=4,
    fps=24,
)

video_status = client.wait_for_video(video.prediction_id, max_wait=300)
print(video_status.output_url)  # → MP4 URL

# ── Credit Balance ────────────────────────────────────────────────────────────
balance = client.credits(store_id="your_store_id")
print(f"Balance: ₹{balance.balance:.2f} | Tier: {balance.tier}")
```

## Error Handling

```python
from vizzle import (
    VizzleClient,
    InsufficientCreditsError,
    ModerationRejectedError,
    RateLimitError,
    AuthenticationError,
)

try:
    result = client.tryon(product_id="...", user_photo_url="...")
except ModerationRejectedError:
    print("Image rejected — NSFW or misleading content detected (no charge)")
except InsufficientCreditsError as e:
    print(f"Top up needed: ₹{e.balance:.2f} available, ₹{e.required:.2f} required")
except RateLimitError:
    print("Rate limit exceeded — slow down requests")
except AuthenticationError:
    print("Invalid API key")
```

## Pricing

| Operation         | Cost per request |
|-------------------|-----------------|
| Image Try-On      | ₹2.50           |
| Video Generation  | ₹5.00           |

Top up credits at your [Billing Dashboard](https://your-dashboard.vercel.app/dashboard/billing).

## API Reference

### `VizzleClient(api_key, base_url?, timeout?)`

| Parameter  | Type  | Default                                   |
|------------|-------|-------------------------------------------|
| `api_key`  | `str` | Required                                  |
| `base_url` | `str` | `https://vizzle-backend.onrender.com`     |
| `timeout`  | `int` | `30` seconds                              |

### Methods

| Method                                        | Returns        | Description                          |
|-----------------------------------------------|----------------|--------------------------------------|
| `tryon(product_id, user_photo_url, ...)`      | `TryOnResult`  | Start image try-on                   |
| `tryon_status(prediction_id)`                 | `TryOnStatus`  | Get current status                   |
| `wait_for_tryon(prediction_id, ...)`          | `TryOnStatus`  | Block until done                     |
| `generate_video(image_url, ...)`              | `VideoResult`  | Start video generation               |
| `video_status(prediction_id)`                 | `VideoStatus`  | Get current status                   |
| `wait_for_video(prediction_id, ...)`          | `VideoStatus`  | Block until done                     |
| `credits(store_id)`                           | `CreditBalance`| Get wallet balance                   |

## License

MIT

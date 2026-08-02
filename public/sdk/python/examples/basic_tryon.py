"""
Example: Basic Virtual Try-On with the Vizzle Python SDK
"""
import sys
sys.path.insert(0, "../")

from vizzle import VizzleClient, InsufficientCreditsError, ModerationRejectedError

# ── Configuration ─────────────────────────────────────────────────────────────
API_KEY      = "vzk_your_api_key_here"
PRODUCT_ID   = "your_product_id"
USER_PHOTO   = "https://example.com/user-photo.jpg"

# ── Run ───────────────────────────────────────────────────────────────────────
client = VizzleClient(api_key=API_KEY)

# Check current balance
balance = client.credits(store_id="your_store_id")
print(f"Current balance: ₹{balance.balance:.2f}")
print(f"Tier: {balance.tier} ({balance.requests_per_hour} req/hr)\n")

try:
    # Start try-on (costs ₹2.50)
    print("Starting virtual try-on...")
    result = client.tryon(
        product_id=PRODUCT_ID,
        user_photo_url=USER_PHOTO,
        garment_type="upper_body",
    )
    print(f"  Prediction ID: {result.prediction_id}")
    print(f"  Status: {result.status}\n")

    # Poll until complete (up to 2 minutes)
    print("Waiting for result...")
    status = client.wait_for_tryon(result.prediction_id, poll_interval=3.0)

    if status.status == "succeeded":
        print(f"✅ Try-on complete!")
        print(f"   Output URL: {status.output_url}")
    else:
        print(f"❌ Try-on failed: {status.error}")

except ModerationRejectedError:
    print("❌ Image rejected by content moderation — please use an appropriate photo.")
except InsufficientCreditsError as e:
    print(f"❌ Not enough credits (₹{e.balance:.2f} / ₹{e.required:.2f} needed).")
    print("   Top up at: https://your-dashboard.vercel.app/dashboard/billing")

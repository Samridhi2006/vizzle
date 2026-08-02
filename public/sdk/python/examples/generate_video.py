"""
Example: Generate an animated video from a try-on result image
"""
import sys
sys.path.insert(0, "../")

from vizzle import VizzleClient, InsufficientCreditsError

API_KEY    = "vzk_your_api_key_here"
IMAGE_URL  = "https://res.cloudinary.com/dstnpbknv/image/upload/v1234/vizzle/tryon-output/result.jpg"

client = VizzleClient(api_key=API_KEY)

try:
    print("Starting video generation...")
    result = client.generate_video(
        image_url=IMAGE_URL,
        motion_type="subtle_walk",  # "subtle_walk" | "pose_showcase" | "gentle_turn"
        duration=4,
        fps=24,
    )
    print(f"  Prediction ID: {result.prediction_id}")

    print("Waiting for video (this may take 1–3 minutes)...")
    status = client.wait_for_video(result.prediction_id, poll_interval=5.0, max_wait=300.0)

    if status.status == "succeeded":
        print(f"✅ Video ready!")
        print(f"   MP4 URL: {status.output_url}")
    else:
        print(f"❌ Video generation failed: {status.error}")

except InsufficientCreditsError as e:
    print(f"❌ Not enough credits (₹{e.balance:.2f} / ₹{e.required:.2f} needed).")

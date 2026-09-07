from rembg import remove
from PIL import Image
import io, os, sys

# Force UTF-8 output on Windows
sys.stdout.reconfigure(encoding='utf-8')

public = r"d:\vizzle\LandingPage-1\public"

files = [
    ("vz_tryon_garment.jpg", "vz_tryon_garment.png"),
    ("vz_tryon_result.jpg",  "vz_tryon_result.png"),
]

for src, dst in files:
    src_path = os.path.join(public, src)
    dst_path = os.path.join(public, dst)
    print(f"Processing {src} ...", flush=True)
    with open(src_path, "rb") as f:
        input_data = f.read()
    output_data = remove(input_data)
    img = Image.open(io.BytesIO(output_data)).convert("RGBA")
    img.save(dst_path, "PNG")
    print(f"  Saved: {dst}", flush=True)

print("Done!", flush=True)

from PIL import Image
import os

base = r'C:\Users\samri\.gemini\antigravity-ide\brain\d31c2085-04a2-47bc-9d66-b0c6aea40808\.user_uploaded'
out_dir = r'd:\vizzle\LandingPage-1\public\images\poses\women'
os.makedirs(out_dir, exist_ok=True)

configs = [
    # File 1: Upper body 1-10
    {
        'file': 'media_1790882967970.png',
        'rows': [
            (11, 258, [(14, 199), (217, 402), (420, 604), (622, 807), (825, 1010)]),
            (277, 514, [(14, 199), (217, 402), (420, 604), (623, 807), (825, 1010)])
        ],
        'start_idx': 1
    },
    # File 2: Upper body 11-20
    {
        'file': 'media_1790882984206.png',
        'rows': [
            (18, 249, [(10, 195), (213, 398), (416, 601), (619, 805), (823, 1008)]),
            (267, 516, [(9, 195), (213, 398), (416, 601), (619, 804), (823, 1008)])
        ],
        'start_idx': 11
    },
    # File 3: Full body 21-30
    {
        'file': 'media_1790883006857.png',
        'rows': [
            (18, 269, [(5, 194), (212, 400), (419, 607), (626, 814), (833, 1021)]),
            (287, 533, [(5, 194), (212, 400), (419, 607), (626, 814), (833, 1021)])
        ],
        'start_idx': 21
    },
    # File 4: Full body 31-40
    {
        'file': 'media_1790883024649.png',
        'rows': [
            (20, 266, [(16, 200), (219, 403), (421, 605), (623, 808), (826, 1010)]),
            (284, 517, [(16, 200), (218, 403), (421, 605), (623, 808), (826, 1010)])
        ],
        'start_idx': 31
    }
]

total_cropped = 0
for cfg in configs:
    src_path = os.path.join(base, cfg['file'])
    im = Image.open(src_path).convert('RGB')
    idx = cfg['start_idx']
    for y1, y2, cols in cfg['rows']:
        for x1, x2 in cols:
            cropped = im.crop((int(x1), int(y1), int(x2), int(y2)))
            fname = f'women_pose_{idx:02d}.jpg'
            dst = os.path.join(out_dir, fname)
            cropped.save(dst, quality=95)
            print(f'Cropped {fname} from {cfg["file"]} bbox=({x1},{y1},{x2},{y2}) size={cropped.size}')
            idx += 1
            total_cropped += 1

print(f'Done! Successfully cropped {total_cropped} poses.')

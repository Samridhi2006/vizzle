Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $PSScriptRoot "..\public\images\models\headshots"
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

function Crop-Headshot($srcRelative, $x, $y, $cropW, $cropH, $outName) {
    $srcPath = Join-Path $PSScriptRoot ("..\public\" + $srcRelative)
    if (-not (Test-Path $srcPath)) {
        Write-Warning "Source not found: $srcPath"
        return
    }

    $srcBmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $srcPath))
    $destW = 450
    $destH = 600
    $destBmp = New-Object System.Drawing.Bitmap($destW, $destH)
    $g = [System.Drawing.Graphics]::FromImage($destBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::White)

    $srcRect = New-Object System.Drawing.Rectangle($x, $y, $cropW, $cropH)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $destW, $destH)
    $g.DrawImage($srcBmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    $destPath = Join-Path $outDir ($outName + ".jpg")
    $destBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $destBmp.Dispose()
    $srcBmp.Dispose()
    Write-Output "Successfully generated: $destPath"
}

# Exactly centered 3:4 crop from head to mid-chest:
# 1. Meera (hero_model_1.jpg: 896x1200, center x=430)
Crop-Headshot "hero_model_1.jpg" 310 140 270 360 "meera"

# 2. Zara (hero_model_2.jpg: 896x1200, center x=450)
Crop-Headshot "hero_model_2.jpg" 315 40 270 360 "zara"

# 3. Naina (gallery/col1_blouse.jpg: 1024x1024, center x=510)
Crop-Headshot "gallery/col1_blouse.jpg" 240 40 540 720 "naina"

# 4. Priya (step2_base_model_emerald.jpg: 1200x896, model center x=605)
Crop-Headshot "step2_base_model_emerald.jpg" 480 50 250 333 "priya"

# 5. Anaya (showcase/western_beige_coord.jpg: 896x1200, center x=470)
Crop-Headshot "showcase/western_beige_coord.jpg" 340 60 260 346 "anaya"

# 6. Ishita (step2_model_base.jpg: 1024x1024, center x=505)
Crop-Headshot "step2_model_base.jpg" 365 50 280 373 "ishita"

# 7. Diya (gallery/col5_extra_lehenga.jpg: 896x1200, center x=460)
Crop-Headshot "gallery/col5_extra_lehenga.jpg" 330 70 260 346 "diya"

# 8. Kavya (showcase/western_emerald_dress.jpg: 896x1200, center x=450)
Crop-Headshot "showcase/western_emerald_dress.jpg" 320 50 260 346 "kavya"

# 9. Riya (gallery/col5_female_denim.jpg: 896x1200, center x=450)
Crop-Headshot "gallery/col5_female_denim.jpg" 320 50 260 346 "riya"

# 10. Sana (showcase/western_leather_jacket.jpg: 896x1200, center x=445)
Crop-Headshot "showcase/western_leather_jacket.jpg" 315 65 260 346 "sana"

Write-Output "All 10 headshots successfully cropped with exact head-to-mid-chest centering!"

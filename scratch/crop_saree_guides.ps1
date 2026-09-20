Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "..\public\garments\women\saree.jpg"
$outDir = Join-Path $PSScriptRoot "..\public\images\studio\saree_guide"

if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$srcBmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $srcPath))

# Helper function for high quality cropping
function Crop-Image($x, $y, $cropW, $cropH, $targetW, $targetH, $destPath) {
    $destBmp = New-Object System.Drawing.Bitmap($targetW, $targetH)
    $g = [System.Drawing.Graphics]::FromImage($destBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::White)

    $srcRect = New-Object System.Drawing.Rectangle($x, $y, $cropW, $cropH)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)
    $g.DrawImage($srcBmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    $destBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $destBmp.Dispose()
    Write-Output "Saved: $destPath"
}

# 1. Body: Clean horizontal top-down product crop of the body fabric with gold zari border
Crop-Image 88 180 500 280 480 268 (Join-Path $outDir "body.jpg")

# 2. Pallu: Clean horizontal top-down product crop of the intricate gold brocade pallu
Crop-Image 460 370 500 280 480 268 (Join-Path $outDir "pallu.jpg")

# 3. Folded: Angled folded saree package with soft shadow matching reference
$foldedW = 400
$foldedH = 480
$foldedBmp = New-Object System.Drawing.Bitmap($foldedW, $foldedH)
$gFolded = [System.Drawing.Graphics]::FromImage($foldedBmp)
$gFolded.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gFolded.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gFolded.Clear([System.Drawing.Color]::White)

# Translate & rotate for realistic 3D folded product appearance
$gFolded.TranslateTransform(200, 240)
$gFolded.RotateTransform(-6)
$gFolded.TranslateTransform(-100, -170)

# Soft shadow
$shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 0, 0, 0))
$gFolded.FillRectangle($shadowBrush, 12, 12, 190, 320)
$shadowBrush.Dispose()

# Folded Body (top half of folded stack)
$srcFoldBody = New-Object System.Drawing.Rectangle(90, 150, 420, 260)
$destFoldBody = New-Object System.Drawing.Rectangle(0, 0, 190, 150)
$gFolded.DrawImage($srcBmp, $destFoldBody, $srcFoldBody, [System.Drawing.GraphicsUnit]::Pixel)

# Folded Pallu (bottom half showing gold border)
$srcFoldPallu = New-Object System.Drawing.Rectangle(460, 400, 440, 300)
$destFoldPallu = New-Object System.Drawing.Rectangle(0, 150, 190, 170)
$gFolded.DrawImage($srcBmp, $destFoldPallu, $srcFoldPallu, [System.Drawing.GraphicsUnit]::Pixel)

# Crisp edge border
$edgePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 170, 70), 2)
$gFolded.DrawRectangle($edgePen, 0, 0, 190, 320)
$edgePen.Dispose()

# White layer fold highlights
$highlightPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 255, 255, 255), 1.5)
$gFolded.DrawLine($highlightPen, 0, 150, 190, 150)
$highlightPen.Dispose()

$gFolded.Dispose()
$foldedBmp.Save((Join-Path $outDir "folded.jpg"), [System.Drawing.Imaging.ImageFormat]::Jpeg)
$foldedBmp.Dispose()
Write-Output "Saved angled folded.jpg"

# 4. Long: Vertical long unfolded saree strip matching reference
$longW = 400
$longH = 480
$longBmp = New-Object System.Drawing.Bitmap($longW, $longH)
$gLong = [System.Drawing.Graphics]::FromImage($longBmp)
$gLong.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gLong.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gLong.Clear([System.Drawing.Color]::White)

# Saree strip centered, running vertically
# Soft shadow
$longShadow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 0, 0, 0))
$gLong.FillRectangle($longShadow, 95, 20, 218, 444)
$longShadow.Dispose()

# Body section (top 60%)
$srcLongBody = New-Object System.Drawing.Rectangle(90, 100, 380, 500)
$destLongBody = New-Object System.Drawing.Rectangle(90, 16, 210, 260)
$gLong.DrawImage($srcBmp, $destLongBody, $srcLongBody, [System.Drawing.GraphicsUnit]::Pixel)

# Pallu section (bottom 40%)
$srcLongPallu = New-Object System.Drawing.Rectangle(460, 420, 440, 440)
$destLongPallu = New-Object System.Drawing.Rectangle(90, 276, 210, 180)
$gLong.DrawImage($srcBmp, $destLongPallu, $srcLongPallu, [System.Drawing.GraphicsUnit]::Pixel)

# Edge pen
$stripPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(190, 160, 60), 2)
$gLong.DrawRectangle($stripPen, 90, 16, 210, 440)
$stripPen.Dispose()

$gLong.Dispose()
$longBmp.Save((Join-Path $outDir "long.jpg"), [System.Drawing.Imaging.ImageFormat]::Jpeg)
$longBmp.Dispose()
Write-Output "Saved vertical long.jpg"

$srcBmp.Dispose()
Write-Output "All 4 guide images successfully re-generated!"

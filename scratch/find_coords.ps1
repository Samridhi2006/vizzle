Add-Type -AssemblyName System.Drawing
$imagePath = "C:\Users\samri\.gemini\antigravity-ide\brain\d31c2085-04a2-47bc-9d66-b0c6aea40808\.user_uploaded\media_1789315203611.png"
$bmp = [System.Drawing.Bitmap]::FromFile($imagePath)

# Let's inspect rows around y=225 to find card 1 (Natural Limestone) and card 2 (Brick & Grid)
# Let's scan y=300
Write-Output "Image size: $($bmp.Width) x $($bmp.Height)"

# Row 1 photo top is around y=223, label starts around y=530?
# Let's check pixel colors around x=120, y from 150 to 550
for ($y = 200; $y -lt 550; $y += 20) {
    $c = $bmp.GetPixel(120, $y)
    Write-Output "x=120, y=${y} R=$($c.R) G=$($c.G) B=$($c.B)"
}
$bmp.Dispose()

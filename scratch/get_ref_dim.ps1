Add-Type -AssemblyName System.Drawing
$imagePath = "C:\Users\samri\.gemini\antigravity-ide\brain\d31c2085-04a2-47bc-9d66-b0c6aea40808\.user_uploaded\media_1789315203611.png"
$bmp = [System.Drawing.Bitmap]::FromFile($imagePath)
Write-Output "WIDTH:$($bmp.Width) HEIGHT:$($bmp.Height)"
$bmp.Dispose()

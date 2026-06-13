# Truncate export.js to remove dead code after line 955
$file = "c:\Users\Chris\Desktop\WEBSITES\EMMA Experiential Major Mapping Assistant\js\export.js"
$lines = Get-Content $file
$cutoff = 955
$lines[0..($cutoff-1)] | Set-Content $file -Encoding UTF8
Write-Host "Truncated from $($lines.Count) to $cutoff lines"

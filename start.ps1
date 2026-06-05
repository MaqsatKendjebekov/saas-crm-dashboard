$nodePath = "C:\Users\Qoto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

if (Get-Command node -ErrorAction SilentlyContinue) {
  node server.js
} elseif (Test-Path $nodePath) {
  & $nodePath server.js
} else {
  Write-Error "Node.js not found. Install Node or update start.ps1 with a valid path."
}

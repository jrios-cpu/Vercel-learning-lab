$ErrorActionPreference = "Stop"
$repo = "https://github.com/jrios-cpu/Vercel-learning-lab.git"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "Git is not installed on this PC. Install Git for Windows, then run this script again."
}

Set-Location $PSScriptRoot
if (-not (Test-Path ".git")) { git init }
git branch -M main

$remote = git remote 2>$null
if ($remote -contains "origin") { git remote set-url origin $repo } else { git remote add origin $repo }

if (-not (git config user.name)) { git config user.name "jrios-cpu" }
if (-not (git config user.email)) { git config user.email "jrios-cpu@users.noreply.github.com" }

git add .
$changes = git status --porcelain
if ($changes) { git commit -m "chore: snapshot v5.1 production baseline" }

git push -u origin main
Write-Host "Pushed to $repo" -ForegroundColor Green

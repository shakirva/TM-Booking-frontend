<#
PowerShell helper to perform a safe Next/React upgrade workflow.
Run from the frontend folder: `.rontend\scripts\upgrade-next-react.ps1`
This script will:
 - create a branch `chore/upgrade-next-react`
 - run `npm install` to update lockfile
 - run `npm audit` and `npm audit fix`
 - run `npm run build` to verify
 - if build succeeds, stage and commit package.json and package-lock.json

IMPORTANT: Review output at each step. Do not run `--force` unless you accept breaking changes.
#>

param(
    [switch]$AutoCommit
)

function Run-Check($cmd, $failMessage) {
    Write-Host "\n> $cmd" -ForegroundColor Cyan
    $res = cmd /c $cmd
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: $failMessage" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}

Write-Host "Starting upgrade helper (frontend)..." -ForegroundColor Green

# Ensure script runs from repo frontend folder
$expected = "frontend"
if ((Split-Path -Leaf (Get-Location)) -ne $expected) {
    Write-Host "Please run this script from the repository 'frontend' folder." -ForegroundColor Yellow
    Write-Host "cd path\to\frontend; .\scripts\upgrade-next-react.ps1" -ForegroundColor Yellow
    exit 1
}

# 1) Create branch
$branch = "chore/upgrade-next-react"
Write-Host "Creating branch: $branch" -ForegroundColor Green
Run-Check "git checkout -b $branch" "Failed creating branch. Resolve local git issues first."

# 2) Install updated deps
Write-Host "Installing dependencies (this will update package-lock.json)..." -ForegroundColor Green
Run-Check "npm install" "npm install failed. Fix errors before continuing."

# 3) Run audit & auto-fix (non-force)
Write-Host "Running npm audit and npm audit fix (no --force)..." -ForegroundColor Green
Run-Check "npm audit" "npm audit reported errors (non-zero exit). Review output."
Run-Check "npm audit fix" "npm audit fix failed. Review output."

# 4) Build the app
Write-Host "Building the app to validate (npm run build)..." -ForegroundColor Green
$buildCmd = "npm run build"
Write-Host "This may take a minute..." -ForegroundColor Cyan
$res = cmd /c $buildCmd
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Please inspect errors above. You can revert the lockfile or open a PR for review." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "Build succeeded." -ForegroundColor Green

# 5) Stage and commit package changes
if ($AutoCommit) {
    Write-Host "Staging and committing package changes..." -ForegroundColor Green
    Run-Check "git add package.json package-lock.json" "Failed to stage lockfile changes"
    Run-Check "git commit -m \"chore: upgrade next/react and apply audit fixes\"" "Failed to commit"
    Write-Host "Committed changes to branch $branch" -ForegroundColor Green
} else {
    Write-Host "Package files updated. Review changes, then commit them manually:" -ForegroundColor Yellow
    Write-Host "  git add package.json package-lock.json" -ForegroundColor Cyan
    Write-Host "  git commit -m \"chore: upgrade next/react and apply audit fixes\"" -ForegroundColor Cyan
}

Write-Host "Upgrade helper finished. Push the branch and open a PR for CI/staging deployment." -ForegroundColor Green
Write-Host "  git push -u origin $branch" -ForegroundColor Cyan

exit 0

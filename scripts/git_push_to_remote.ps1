param(
    [string]$remoteUrl = 'https://github.com/mandhara123/pdf-extraction-playground.git',
    [string]$branch = 'main'
)

Write-Host "Setting remote to $remoteUrl and pushing branch $branch..."
git remote remove origin -ErrorAction SilentlyContinue
git remote add origin $remoteUrl
git branch -M $branch
git push -u origin $branch

Write-Host "Done. If authentication fails, configure your Git credentials or use SSH remote URLs."
Write-Host "=== Starting npm fix ==="

# 1. Clean npm cache
npm cache clean --force

# 2. Remove node_modules and lock file
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }

# 3. Ensure proper permissions (run as admin if possible)
# Skipping ACL fix on Windows (run as admin if needed)

# 4. Remove deprecated inflight (if present)
if (npm list inflight 2>$null) {
    npm uninstall inflight
} else {
    Write-Host "inflight not installed, skipping"
}

# 5. Upgrade deprecated dev packages
npm install rimraf@^4.0.0 glob@^9.0.0 @eslint/config-array @eslint/object-schema --save-dev

# 6. Install all dependencies (legacy peer deps to avoid conflicts)
npm install --legacy-peer-deps

Write-Host "=== npm fix completed ==="

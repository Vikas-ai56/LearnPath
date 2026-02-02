#!/bin/bash
# Fix esbuild permissions - run with sudo if needed
cd "$(dirname "$0")"
sudo xattr -dr com.apple.provenance node_modules/@esbuild 2>/dev/null
sudo xattr -dr com.apple.quarantine node_modules/@esbuild 2>/dev/null
sudo chmod -R +x node_modules/@esbuild 2>/dev/null
echo "Fixed esbuild permissions"

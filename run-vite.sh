#!/bin/bash
# Bypass macOS security for esbuild
cd "$(dirname "$0")"
export ESBUILD_BINARY_PATH=node_modules/@esbuild/darwin-arm64/bin/esbuild
npx --yes vite "$@"

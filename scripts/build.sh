#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
UPSTREAM_SHA="${UPSTREAM_SHA:-89a50e3e3d221b4291cce7cbf91db6f4b0790679}"
WORK_DIR="$ROOT_DIR/.build/omni-tools"

rm -rf "$ROOT_DIR/.build" "$ROOT_DIR/dist"
mkdir -p "$ROOT_DIR/.build"

printf '%s\n' "[ITJK] Preparing OmniTools ${UPSTREAM_SHA}..."
git init "$WORK_DIR"
git -C "$WORK_DIR" remote add origin https://github.com/iib0011/omni-tools.git
git -C "$WORK_DIR" fetch --depth 1 origin "$UPSTREAM_SHA"
git -C "$WORK_DIR" checkout --detach FETCH_HEAD

printf '%s\n' "[ITJK] OmniTools commit: $(git -C "$WORK_DIR" rev-parse --short HEAD)"

cd "$WORK_DIR"
printf '%s\n' "[ITJK] Installing dependencies..."
npm ci

printf '%s\n' "[ITJK] Building production bundle..."
npm run build

cp -R "$WORK_DIR/dist" "$ROOT_DIR/dist"
printf '%s\n' "[ITJK] Build complete: $ROOT_DIR/dist"

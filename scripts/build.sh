#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
SOURCE_SHA="${SOURCE_SHA:-89a50e3e3d221b4291cce7cbf91db6f4b0790679}"
WORK_DIR="$ROOT_DIR/.build/source"

rm -rf "$ROOT_DIR/.build" "$ROOT_DIR/dist"
mkdir -p "$ROOT_DIR/.build"

printf '%s\n' "[ITJK] Preparing source ${SOURCE_SHA}..."
git init "$WORK_DIR"
git -C "$WORK_DIR" remote add origin https://github.com/iib0011/omni-tools.git
git -C "$WORK_DIR" fetch --depth 1 origin "$SOURCE_SHA"
git -C "$WORK_DIR" checkout --detach FETCH_HEAD

printf '%s\n' "[ITJK] Source commit: $(git -C "$WORK_DIR" rev-parse --short HEAD)"

cd "$WORK_DIR"
printf '%s\n' "[ITJK] Installing dependencies..."
npm ci

printf '%s\n' "[ITJK] Applying ITJK branding..."
node "$ROOT_DIR/scripts/apply-branding.mjs" "$WORK_DIR" "$ROOT_DIR/overrides"

printf '%s\n' "[ITJK] Building production bundle..."
npm run build

cp -R "$WORK_DIR/dist" "$ROOT_DIR/dist"

printf '%s\n' "[ITJK] Verifying that upstream branding and profile links are absent from production output..."
if grep -RniE 'omnitools|omni-tools|iib0011|discord\.gg/SDbbn3hT4b|1-r9-rDYnDJic9dnDywKTAsueehIAVp5F' "$ROOT_DIR/dist"; then
  printf '%s\n' "[ITJK] ERROR: upstream branding/reference found in production output."
  exit 1
fi

printf '%s\n' "[ITJK] Build complete: $ROOT_DIR/dist"

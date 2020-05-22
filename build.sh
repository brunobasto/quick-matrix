#!/bin/bash

set -e

export OPTIMIZE="-Os"
export LDFLAGS="${OPTIMIZE}"
export CFLAGS="${OPTIMIZE}"
export CXXFLAGS="${OPTIMIZE}"

echo "============================================="
echo "Compiling wasm bindings"
echo "============================================="
(
  # Compile C/C++ code
  emcc \
    ${OPTIMIZE} \
    --bind \
    -s "EXTRA_EXPORTED_RUNTIME_METHODS=['addOnPostRun', 'ccall']" \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s ASSERTIONS=1 \
    -s MALLOC=emmalloc \
    -s STRICT=1 \
    -s WASM_ASYNC_COMPILATION=0 \
    -o ./native.js \
    src/c/arithmetic.c

  # Create output folder
  mkdir -p wasm
  # Move artifacts
  mv native.{js,wasm} wasm
)
echo "============================================="
echo "Compiling wasm bindings done"
echo "============================================="
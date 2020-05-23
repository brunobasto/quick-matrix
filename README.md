# quick-matrix - Experiments on matrix algebra API for JavaScript

```ts
const vector = from([1, 2, 3]);
const matrix = from([
    [1, 2, 3],
    [4, 5, 6]
]);

multiply(vector, matrix);
```

## Features (so far)
- [Numpy](https://numpy.org/)-like broadcasting
- For now just the four elementary operations are implemented: +, -, * and /.
- Multiple engines are supported: V8 (pure JavaScript), [GPU.js](https://gpu.rocks/) and [WASM](https://webassembly.org/) ([emscripten](https://emscripten.org/))

## Benchmarks

```sh
yarn benchmark
```

![](https://github.com/brunobasto/quick-matrix/blob/master/assets/benchmarks.png?raw=true)

Durations are measured for a thousand of operations.

NOTE: I might not be using [GPU.js](https://gpu.rocks/) correctly or maybe the graphics card on my MacBook Pro (Radeon Pro 560X 4 GB or Intel UHD Graphics 630 1536 MB) is just slow, but I don't see the benefit of using it yet.


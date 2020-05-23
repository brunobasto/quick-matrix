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

- For now just the four elementary operations are implemented: +, -, * and /.
- Multiple engines are supported: V8, GPU.js and WASM (emscripten)

## Benchmarks

```sh
yarn benchmark
```

![](https://github.com/brunobasto/quick-matrix/blob/master/assets/benchmarks.png?raw=true)

Durations are measured for a thousand of operations.

NOTE: I might not be using GPU.js correctly or maybe the graphics card on my MacBook Pro (Radeon Pro 560X 4 GB or Intel UHD Graphics 630 1536 MB) is just slow, but I don't see the benefit of using it yet.


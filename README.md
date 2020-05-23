# quick-matrix - Experiments on matrix algebra API for JavaScript

```ts
import {from, multiply} from 'quick-matrix';

const vector = from([1, 2, 3]);
const matrix = from([
    [1, 2, 3],
    [4, 5, 6]
]);

const result = multiply(vector, matrix);
console.log(result);
// outputs: [[1, 4, 9], [4, 10, 18]]
```

Right now the API for the operations (`add()`, `multiply()`, `subtract()` and etc) expects that vectors (and columns of a matrix) are of type `Float32Array`. Initially I made it so that it would accept just plain old JavaScript number arrays. But it turns out that there's a performance drawback to that because I need to convert it to a typed array before interfacing with either WASM or GPU.js. In the near future I will make so that I can internally make the necessary conversions if the right type is not passed. When I do that, the will be no need to initialize with `from()`.

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


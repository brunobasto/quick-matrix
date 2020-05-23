import { fill } from '../src/ts/api/fill';
import { Matrix, Operation, Vector } from '../src/ts/types';
import countdown from 'countdown';
import EngineGPU from '../src/ts/engines/EngineGPU';
import EngineV8 from '../src/ts/engines/EngineV8';
import EngineWASM from '../src/ts/engines/EngineWASM';
import shape from '../src/ts/api/shape';

const benchmark = (
    name: string,
    fn: Function,
    iterations: number = 100
) => {
    const start = (new Date()).getTime();

    for (let i = 0; i < iterations; i++) {
        fn();
    }

    const end = (new Date()).getTime();

    const duration = countdown(
        start,
        end,
        countdown.MINUTES | countdown.SECONDS | countdown.MILLISECONDS
    ).toString();

    console.log(`${name}: ${duration}`);

    return end - start;
}

(() => {
    const { MULTIPLY } = Operation;

    const gpu = new EngineGPU();
    const wasm = new EngineWASM();
    const v8 = new EngineV8();

    const scalar = 5;
    const smallVector = fill([10e2, 0], scalar) as Vector;
    const mediumVector = fill([10e4, 0], scalar) as Vector;
    const largeVector = fill([10e5, 0], scalar) as Vector;
    const smallMatrix = fill([512, 512], scalar) as Matrix;
    const mediumMatrix = fill([1024, 1024], scalar) as Matrix;
    const largeMatrix = fill([4096, 4096], scalar) as Matrix;
    const largeRowsMatrix = fill([16384, 100], scalar) as Matrix;
    const largeColumnsMatrix = fill([100, 16384], scalar) as Matrix;

    const benchmarkScalarScalar = () => {
        console.log(`=== scalar x scalar ===`);

        benchmark(`WASM`, () => {
            wasm.operateBinaryScalars(scalar, scalar, MULTIPLY);
        });
        benchmark(`GPU`, () => {
            gpu.operateBinaryScalars(scalar, scalar, MULTIPLY);
        });
        benchmark(`V8`, () => {
            v8.operateBinaryScalars(scalar, scalar, MULTIPLY);
        });
    }

    const benchmarkVectorScalar = () => {
        // small
        console.log(`=== vector(${shape(smallVector)}) x scalar ===`);

        benchmark(`WASM`, () => {
            wasm.operateBinaryVectorAndScalar(smallVector, scalar, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateBinaryVectorAndScalar(smallVector, scalar, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateBinaryVectorAndScalar(smallVector, scalar, MULTIPLY)
        });
        // medium
        console.log(`=== vector(${shape(mediumVector)}) x scalar ===`);

        benchmark(`WASM`, () => {
            wasm.operateBinaryVectorAndScalar(mediumVector, scalar, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateBinaryVectorAndScalar(mediumVector, scalar, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateBinaryVectorAndScalar(mediumVector, scalar, MULTIPLY)
        });
        // large
        console.log(`=== vector(${shape(largeVector)}) x scalar ===`);

        benchmark(`WASM`, () => {
            wasm.operateBinaryVectorAndScalar(largeVector, scalar, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateBinaryVectorAndScalar(largeVector, scalar, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateBinaryVectorAndScalar(largeVector, scalar, MULTIPLY)
        });
    }

    const benchmarkVectorVector = () => {
        // small
        console.log(`=== vector(${shape(smallVector)}) x vector(${shape(smallVector)}) ===`);

        benchmark(`WASM`, () => {
            wasm.operateBinaryVectors(smallVector, smallVector, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateBinaryVectors(smallVector, smallVector, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateBinaryVectors(smallVector, smallVector, MULTIPLY)
        });
        // medium
        console.log(`=== vector(${shape(mediumVector)}) x vector(${shape(mediumVector)}) ===`);

        benchmark(`WASM`, () => {
            wasm.operateBinaryVectors(mediumVector, mediumVector, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateBinaryVectors(mediumVector, mediumVector, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateBinaryVectors(mediumVector, mediumVector, MULTIPLY)
        });
        // large
        console.log(`=== vector(${shape(largeVector)}) x vector(${shape(largeVector)}) ===`);

        benchmark(`WASM`, () => {
            wasm.operateBinaryVectors(largeVector, largeVector, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateBinaryVectors(largeVector, largeVector, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateBinaryVectors(largeVector, largeVector, MULTIPLY)
        });
    }

    const benchmarkMatrixScalar = () => {
        // small
        console.log(`=== matrix(${shape(smallMatrix)}) x scalar ===`);

        benchmark(`WASM`, () => {
            wasm.operateBinaryMatrixAndScalar(smallMatrix, scalar, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateBinaryMatrixAndScalar(smallMatrix, scalar, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateBinaryMatrixAndScalar(smallMatrix, scalar, MULTIPLY)
        });
        // medium
        console.log(`=== matrix(${shape(mediumMatrix)}) x scalar ===`);

        benchmark(`WASM`, () => {
            wasm.operateBinaryMatrixAndScalar(mediumMatrix, scalar, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateBinaryMatrixAndScalar(mediumMatrix, scalar, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateBinaryMatrixAndScalar(mediumMatrix, scalar, MULTIPLY)
        });
        // large
        console.log(`=== matrix(${shape(largeMatrix)}) x scalar === `);

        benchmark(`WASM`, () => {
            wasm.operateBinaryMatrixAndScalar(largeMatrix, scalar, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateBinaryMatrixAndScalar(largeMatrix, scalar, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateBinaryMatrixAndScalar(largeMatrix, scalar, MULTIPLY)
        });
        // large rows
        console.log(`=== matrix(${shape(largeRowsMatrix)}) x scalar === `);

        benchmark(`WASM`, () => {
            wasm.operateBinaryMatrixAndScalar(largeRowsMatrix, scalar, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateBinaryMatrixAndScalar(largeRowsMatrix, scalar, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateBinaryMatrixAndScalar(largeRowsMatrix, scalar, MULTIPLY)
        });
        // large columns
        console.log(`=== matrix(${shape(largeColumnsMatrix)}) x scalar === `);

        benchmark(`WASM`, () => {
            wasm.operateBinaryMatrixAndScalar(largeColumnsMatrix, scalar, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateBinaryMatrixAndScalar(largeColumnsMatrix, scalar, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateBinaryMatrixAndScalar(largeColumnsMatrix, scalar, MULTIPLY)
        });
    }

    const benchmarkMatrixMatrix = () => {
        // small
        console.log(`=== matrix(${shape(smallMatrix)}) x matrix(${shape(smallMatrix)}) ===`);

        benchmark(`WASM`, () => {
            wasm.operateBinaryMatrices(smallMatrix, smallMatrix, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateBinaryMatrices(smallMatrix, smallMatrix, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateBinaryMatrices(smallMatrix, smallMatrix, MULTIPLY)
        });
        // medium
        console.log(`=== matrix(${shape(mediumMatrix)}) x matrix(${shape(mediumMatrix)}) ===`);

        benchmark(`WASM`, () => {
            wasm.operateBinaryMatrices(mediumMatrix, mediumMatrix, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateBinaryMatrices(mediumMatrix, mediumMatrix, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateBinaryMatrices(mediumMatrix, mediumMatrix, MULTIPLY)
        });
        // large
        console.log(`=== matrix(${shape(largeMatrix)}) x matrix(${shape(largeMatrix)}) ===`);

        benchmark(`WASM`, () => {
            wasm.operateBinaryMatrices(largeMatrix, largeMatrix, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateBinaryMatrices(largeMatrix, largeMatrix, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateBinaryMatrices(largeMatrix, largeMatrix, MULTIPLY)
        });
    }

    benchmarkScalarScalar();
    benchmarkVectorScalar();
    benchmarkVectorVector();
    benchmarkMatrixScalar();
    benchmarkMatrixMatrix();
})();
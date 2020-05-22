import { ArithmeticOperation } from '../src/ts/Engine';
import { fill, fillVector } from '../src/ts/fill';
import EngineGPU from '../src/ts/EngineGPU';
import EngineV8 from '../src/ts/EngineV8';
import EngineWASM from '../src/ts/EngineWASM';
import countdown from 'countdown';
import shape from '../src/ts/shape';

const benchmark = (
    name: string,
    fn: Function,
    iterations: number = 1000
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
    const { MULTIPLY } = ArithmeticOperation;

    const gpu = new EngineGPU();
    const wasm = new EngineWASM();
    const v8 = new EngineV8();

    const scalar = 5;
    const smallVector = fillVector(10e2, scalar);
    const mediumVector = fillVector(10e4, scalar);
    const largeVector = fillVector(10e5, scalar);
    const smallMatrix = fill([5, 5], scalar);
    const mediumMatrix = fill([100, 100], scalar);
    const largeMatrix = fill([1024, 1024], scalar);

    const benchmarkScalarScalar = () => {
        console.log(`=== scalar x scalar ===`);

        benchmark(`WASM`, () => {
            wasm.operateOnScalars(scalar, scalar, MULTIPLY);
        });
        benchmark(`GPU`, () => {
            gpu.operateOnScalars(scalar, scalar, MULTIPLY);
        });
        benchmark(`V8`, () => {
            v8.operateOnScalars(scalar, scalar, MULTIPLY);
        });
    }

    const benchmarkVectorScalar = () => {
        // small
        console.log(`=== vector(${shape(smallVector)}) x scalar ===`);

        benchmark(`WASM`, () => {
            wasm.operateOnVectorAndScalar(smallVector, scalar, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateOnVectorAndScalar(smallVector, scalar, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateOnVectorAndScalar(smallVector, scalar, MULTIPLY)
        });
        // medium
        console.log(`=== vector(${shape(mediumVector)}) x scalar ===`);

        benchmark(`WASM`, () => {
            wasm.operateOnVectorAndScalar(mediumVector, scalar, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateOnVectorAndScalar(mediumVector, scalar, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateOnVectorAndScalar(mediumVector, scalar, MULTIPLY)
        });
        // large
        console.log(`=== vector(${shape(largeVector)}) x scalar ===`);

        benchmark(`WASM`, () => {
            wasm.operateOnVectorAndScalar(largeVector, scalar, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateOnVectorAndScalar(largeVector, scalar, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateOnVectorAndScalar(largeVector, scalar, MULTIPLY)
        });
    }

    const benchmarkVectorVector = () => {
        // small
        console.log(`=== vector(${shape(smallVector)}) x vector(${shape(smallVector)}) ===`);

        benchmark(`WASM`, () => {
            wasm.operateOnVectors(smallVector, smallVector, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateOnVectors(smallVector, smallVector, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateOnVectors(smallVector, smallVector, MULTIPLY)
        });
        // medium
        console.log(`=== vector(${shape(mediumVector)}) x vector(${shape(mediumVector)}) ===`);

        benchmark(`WASM`, () => {
            wasm.operateOnVectors(mediumVector, mediumVector, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateOnVectors(mediumVector, mediumVector, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateOnVectors(mediumVector, mediumVector, MULTIPLY)
        });
        // large
        console.log(`=== vector(${shape(largeVector)}) x vector(${shape(largeVector)}) ===`);

        benchmark(`WASM`, () => {
            wasm.operateOnVectors(largeVector, largeVector, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateOnVectors(largeVector, largeVector, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateOnVectors(largeVector, largeVector, MULTIPLY)
        });
    }

    const benchmarkMatrixScalar = () => {
        // small
        console.log(`=== matrix(${shape(smallMatrix)}) x scalar ===`);

        benchmark(`WASM`, () => {
            wasm.operateOnMatrixAndScalar(smallMatrix, scalar, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateOnMatrixAndScalar(smallMatrix, scalar, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateOnMatrixAndScalar(smallMatrix, scalar, MULTIPLY)
        });
        // medium
        console.log(`=== matrix(${shape(mediumMatrix)}) x scalar ===`);

        benchmark(`WASM`, () => {
            wasm.operateOnMatrixAndScalar(mediumMatrix, scalar, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateOnMatrixAndScalar(mediumMatrix, scalar, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateOnMatrixAndScalar(mediumMatrix, scalar, MULTIPLY)
        });
        // large
        console.log(`=== matrix(${shape(largeMatrix)}) x scalar === `);

        benchmark(`WASM`, () => {
            wasm.operateOnMatrixAndScalar(largeMatrix, scalar, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateOnMatrixAndScalar(largeMatrix, scalar, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateOnMatrixAndScalar(largeMatrix, scalar, MULTIPLY)
        });
    }


    const benchmarkMatrixMatrix = () => {
        // small
        console.log(`=== matrix(${shape(smallMatrix)}) x matrix(${shape(smallMatrix)}) ===`);

        benchmark(`WASM`, () => {
            wasm.operateOnMatrices(smallMatrix, smallMatrix, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateOnMatrices(smallMatrix, smallMatrix, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateOnMatrices(smallMatrix, smallMatrix, MULTIPLY)
        });
        // medium
        console.log(`=== matrix(${shape(mediumMatrix)}) x matrix(${shape(mediumMatrix)}) ===`);

        benchmark(`WASM`, () => {
            wasm.operateOnMatrices(mediumMatrix, mediumMatrix, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateOnMatrices(mediumMatrix, mediumMatrix, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateOnMatrices(mediumMatrix, mediumMatrix, MULTIPLY)
        });
        // large
        console.log(`=== matrix(${shape(largeMatrix)}) x matrix(${shape(largeMatrix)}) ===`);

        benchmark(`WASM`, () => {
            wasm.operateOnMatrices(largeMatrix, largeMatrix, MULTIPLY)
        });
        benchmark(`GPU`, () => {
            gpu.operateOnMatrices(largeMatrix, largeMatrix, MULTIPLY)
        });
        benchmark(`V8`, () => {
            v8.operateOnMatrices(largeMatrix, largeMatrix, MULTIPLY)
        });
    }

    benchmarkScalarScalar();
    benchmarkVectorScalar();
    benchmarkVectorVector();
    benchmarkMatrixScalar();
    benchmarkMatrixMatrix();
})();
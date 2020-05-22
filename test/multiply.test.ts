/**
 * @jest-environment node
 */

import { ArithmeticOperation } from '../src/ts/engines/Engine';
import { from } from '../src/ts/from';
import { Vector, Matrix } from '../src/ts/types';
import EngineGPU from '../src/ts/engines/EngineGPU';
import EngineV8 from '../src/ts/engines/EngineV8';
import EngineWASM from '../src/ts/engines/EngineWASM';
import multiply from '../src/ts/multiply';

const gpu = new EngineGPU();
const v8 = new EngineV8();
const wasm = new EngineWASM();

const { MULTIPLY } = ArithmeticOperation;

const vector = from([1, 2, 3]);
const matrix = from([
    [1, 2, 3],
    [4, 5, 6]
]);

test(`Multiply two numbers`, () => {
    expect(multiply(2, 3)).toBe(6);

    expect(gpu.operateOnScalars(2, 3, MULTIPLY)).toBe(6);
    expect(v8.operateOnScalars(2, 3, MULTIPLY)).toBe(6);
    expect(wasm.operateOnScalars(2, 3, MULTIPLY)).toBe(6);
});

test(`Multiply a number and a vector`, () => {
    const result = from([2, 4, 6]);

    expect(multiply(2, vector)).toStrictEqual(result);
    expect(multiply(vector, 2)).toStrictEqual(result);

    expect(gpu.operateOnVectorAndScalar(vector as Vector, 2, MULTIPLY)).toEqual(result);
    expect(v8.operateOnVectorAndScalar(vector as Vector, 2, MULTIPLY)).toStrictEqual(result);
    expect(wasm.operateOnVectorAndScalar(vector as Vector, 2, MULTIPLY)).toStrictEqual(result);
});

test(`Multiply a number and a matrix`, () => {
    const result = from([
        [2, 4, 6],
        [8, 10, 12]
    ]);

    expect(multiply(2, matrix)).toStrictEqual(result);
    expect(multiply(matrix, 2)).toStrictEqual(result);

    expect(gpu.operateOnMatrixAndScalar(matrix as Matrix, 2, MULTIPLY)).toEqual(result);
    expect(v8.operateOnMatrixAndScalar(matrix as Matrix, 2, MULTIPLY)).toStrictEqual(result);
    expect(wasm.operateOnMatrixAndScalar(matrix as Matrix, 2, MULTIPLY)).toStrictEqual(result);
});

test(`Multiply vectors`, () => {
    const vectorA = from([2, 3, 4]);
    const vectorB = from([5, 6, 7]);
    const result = from([10, 18, 28]);

    expect(multiply(vectorA, vectorB)).toStrictEqual(result);
    expect(multiply(vectorB, vectorA)).toStrictEqual(result);

    // Incompatible vector multiplication must throw an error
    expect(() => multiply(vectorA, from([1]))).toThrow();

    expect(gpu.operateOnVectors(vectorA as Vector, vectorB as Vector, MULTIPLY)).toEqual(result);
    expect(gpu.operateOnVectors(vectorB as Vector, vectorA as Vector, MULTIPLY)).toEqual(result);    
    expect(v8.operateOnVectors(vectorA as Vector, vectorB as Vector, MULTIPLY)).toStrictEqual(result);
    expect(v8.operateOnVectors(vectorB as Vector, vectorA as Vector, MULTIPLY)).toStrictEqual(result);
    expect(wasm.operateOnVectors(vectorA as Vector, vectorB as Vector, MULTIPLY)).toStrictEqual(result);
    expect(wasm.operateOnVectors(vectorB as Vector, vectorA as Vector, MULTIPLY)).toStrictEqual(result);
});

test(`Multiply matrices`, () => {
    const matrixA = from([
        [2, 3, 4],
        [5, 6, 7]
    ]);
    const matrixB = from([
        [8, 9, 10],
        [11, 12, 13]
    ]);
    const result = from([
        [16, 27, 40],
        [55, 72, 91]
    ]);

    expect(multiply(matrixA, matrixB)).toStrictEqual(result);
    expect(multiply(matrixB, matrixA)).toStrictEqual(result);

    // Incompatible matrix multiplication must throw an error
    expect(() => multiply(matrixB, from([
        [1, 2, 3, 4],
        [5, 6, 7, 8]
    ]))).toThrow();

    expect(gpu.operateOnMatrices(matrixA as Matrix, matrixB as Matrix, MULTIPLY)).toEqual(result);
    expect(gpu.operateOnMatrices(matrixB as Matrix, matrixA as Matrix, MULTIPLY)).toEqual(result);
    expect(v8.operateOnMatrices(matrixA as Matrix, matrixB as Matrix, MULTIPLY)).toStrictEqual(result);
    expect(v8.operateOnMatrices(matrixB as Matrix, matrixA as Matrix, MULTIPLY)).toStrictEqual(result);
    expect(wasm.operateOnMatrices(matrixA as Matrix, matrixB as Matrix, MULTIPLY)).toStrictEqual(result);
    expect(wasm.operateOnMatrices(matrixB as Matrix, matrixA as Matrix, MULTIPLY)).toStrictEqual(result);
});

test(`Multiply a vector and a matrix`, () => {
    const result = from([
        [1, 4, 9],
        [4, 10, 18]
    ]);
    // broadcast vector to matrix
    expect(multiply(vector, matrix)).toStrictEqual(result);
    expect(multiply(matrix, vector)).toStrictEqual(result);

    // broadcast rows with dimension 1
    expect(multiply(matrix, from([[1, 2, 3]]))).toStrictEqual(from([
        [1, 4, 9],
        [4, 10, 18]
    ]));
    expect(multiply(from([[1, 2, 3]]), matrix)).toStrictEqual(from([
        [1, 4, 9],
        [4, 10, 18]
    ]));
    
    // broadcast columns with dimension 1
    expect(multiply(matrix, from([[1], [2]]))).toStrictEqual(from([
        [1, 2, 3],
        [8, 10, 12]
    ]));
    expect(multiply(from([[1], [2]]), matrix)).toStrictEqual(from([
        [1, 2, 3],
        [8, 10, 12]
    ]));

    // Incompatible matrix and vvector multiplication must throw an error
    expect(() => multiply(matrix, from([1, 2]))).toThrow();
});
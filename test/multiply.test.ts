/**
 * @jest-environment node
 */

import { from, multiply } from '../src/ts';
import { Vector, Operation, Matrix } from '../src/ts/types';
import EngineGPU from '../src/ts/engines/EngineGPU';
import EngineV8 from '../src/ts/engines/EngineV8';
import EngineWASM from '../src/ts/engines/EngineWASM';

const gpu = new EngineGPU();
const v8 = new EngineV8();
const wasm = new EngineWASM();

const { MULTIPLY } = Operation;

const vector = from([1, 2, 3]);
const matrix = from([
    [1, 2, 3],
    [4, 5, 6]
]);

test(`Multiply two numbers`, () => {
    expect(multiply(2, 3)).toBe(6);

    expect(gpu.operateBinaryScalars(2, 3, MULTIPLY)).toBe(6);
    expect(v8.operateBinaryScalars(2, 3, MULTIPLY)).toBe(6);
    expect(wasm.operateBinaryScalars(2, 3, MULTIPLY)).toBe(6);
});

test(`Multiply a number and a vector`, () => {
    const result = from([2, 4, 6]);

    expect(multiply(2, vector)).toStrictEqual(result);
    expect(multiply(vector, 2)).toStrictEqual(result);

    expect(gpu.operateBinaryVectorAndScalar(vector as Vector, 2, MULTIPLY)).toEqual(result);
    expect(v8.operateBinaryVectorAndScalar(vector as Vector, 2, MULTIPLY)).toStrictEqual(result);
    expect(wasm.operateBinaryVectorAndScalar(vector as Vector, 2, MULTIPLY)).toStrictEqual(result);
});

test(`Multiply a number and a matrix`, () => {
    const result = from([
        [2, 4, 6],
        [8, 10, 12]
    ]);

    expect(multiply(2, matrix)).toStrictEqual(result);
    expect(multiply(matrix, 2)).toStrictEqual(result);

    expect(gpu.operateBinaryMatrixAndScalar(matrix as Matrix, 2, MULTIPLY)).toEqual(result);
    expect(v8.operateBinaryMatrixAndScalar(matrix as Matrix, 2, MULTIPLY)).toStrictEqual(result);
    expect(wasm.operateBinaryMatrixAndScalar(matrix as Matrix, 2, MULTIPLY)).toStrictEqual(result);
});

test(`Multiply vectors`, () => {
    const vectorA = from([2, 3, 4]);
    const vectorB = from([5, 6, 7]);
    const result = from([10, 18, 28]);

    expect(multiply(vectorA, vectorB)).toStrictEqual(result);
    expect(multiply(vectorB, vectorA)).toStrictEqual(result);

    // Incompatible vector operation must throw an error
    expect(() => multiply(vectorA, from([1]))).toThrow();

    expect(gpu.operateBinaryVectors(vectorA as Vector, vectorB as Vector, MULTIPLY)).toEqual(result);
    expect(gpu.operateBinaryVectors(vectorB as Vector, vectorA as Vector, MULTIPLY)).toEqual(result);    
    expect(v8.operateBinaryVectors(vectorA as Vector, vectorB as Vector, MULTIPLY)).toStrictEqual(result);
    expect(v8.operateBinaryVectors(vectorB as Vector, vectorA as Vector, MULTIPLY)).toStrictEqual(result);
    expect(wasm.operateBinaryVectors(vectorA as Vector, vectorB as Vector, MULTIPLY)).toStrictEqual(result);
    expect(wasm.operateBinaryVectors(vectorB as Vector, vectorA as Vector, MULTIPLY)).toStrictEqual(result);
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

    // Incompatible matrix operation must throw an error
    expect(() => multiply(matrixB, from([
        [1, 2, 3, 4],
        [5, 6, 7, 8]
    ]))).toThrow();

    expect(gpu.operateBinaryMatrices(matrixA as Matrix, matrixB as Matrix, MULTIPLY)).toEqual(result);
    expect(gpu.operateBinaryMatrices(matrixB as Matrix, matrixA as Matrix, MULTIPLY)).toEqual(result);
    expect(v8.operateBinaryMatrices(matrixA as Matrix, matrixB as Matrix, MULTIPLY)).toStrictEqual(result);
    expect(v8.operateBinaryMatrices(matrixB as Matrix, matrixA as Matrix, MULTIPLY)).toStrictEqual(result);
    expect(wasm.operateBinaryMatrices(matrixA as Matrix, matrixB as Matrix, MULTIPLY)).toStrictEqual(result);
    expect(wasm.operateBinaryMatrices(matrixB as Matrix, matrixA as Matrix, MULTIPLY)).toStrictEqual(result);
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
    expect(() => multiply(matrix, from([1, 2, 3, 4]))).toThrow();
});
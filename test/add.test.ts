/**
 * @jest-environment node
 */

import { Vector, Operation, Matrix } from '../src/ts/types';
import {add, from} from '../src/ts/';
import EngineGPU from '../src/ts/engines/EngineGPU';
import EngineV8 from '../src/ts/engines/EngineV8';
import EngineWASM from '../src/ts/engines/EngineWASM';

const gpu = new EngineGPU();
const v8 = new EngineV8();
const wasm = new EngineWASM();

const { ADD } = Operation;

const vector = from([1, 2, 3]) as Vector;
const matrix = from([
    [1, 2, 3],
    [4, 5, 6]
]) as Matrix;

test(`Add two numbers`, () => {
    const result = 5;

    expect(add(2, 3)).toBe(result);

    expect(gpu.operateBinaryScalars(2, 3, ADD)).toBe(result);
    expect(v8.operateBinaryScalars(2, 3, ADD)).toBe(result);
    expect(wasm.operateBinaryScalars(2, 3, ADD)).toBe(result);
});

test(`Add a number and a vector`, () => {
    const number = 2;
    const result = from([3, 4, 5]);

    expect(add(number, vector)).toStrictEqual(result);
    expect(add(vector, number)).toStrictEqual(result);

    expect(gpu.operateBinaryVectorAndScalar(vector, number, ADD)).toEqual(result);
    expect(v8.operateBinaryVectorAndScalar(vector, number, ADD)).toStrictEqual(result);
    expect(wasm.operateBinaryVectorAndScalar(vector, number, ADD)).toStrictEqual(result);
});

test(`Add a number and a matrix`, () => {
    const number = 2;
    const result = from([
        [3, 4, 5],
        [6, 7, 8]
    ]);

    expect(add(number, matrix)).toStrictEqual(result);
    expect(add(matrix, number)).toStrictEqual(result);

    expect(gpu.operateBinaryMatrixAndScalar(matrix, number, ADD)).toEqual(result);
    expect(v8.operateBinaryMatrixAndScalar(matrix, number, ADD)).toStrictEqual(result);
    expect(wasm.operateBinaryMatrixAndScalar(matrix, number, ADD)).toStrictEqual(result);
});

test(`Add vectors`, () => {
    const vectorA = from([2, 3, 4]) as Vector;
    const vectorB = from([5, 6, 7]) as Vector;
    const result = from([7, 9, 11]) as Vector;

    expect(add(vectorA, vectorB)).toStrictEqual(result);
    expect(add(vectorB, vectorA)).toStrictEqual(result);

    // Incompatible vector operation must throw an error
    expect(() => add(vectorA, from([1]))).toThrow();

    expect(gpu.operateBinaryVectors(vectorA, vectorB, ADD)).toEqual(result);
    expect(gpu.operateBinaryVectors(vectorB, vectorA, ADD)).toEqual(result);
    expect(v8.operateBinaryVectors(vectorA, vectorB, ADD)).toStrictEqual(result);
    expect(v8.operateBinaryVectors(vectorB, vectorA, ADD)).toStrictEqual(result);
    expect(wasm.operateBinaryVectors(vectorA, vectorB, ADD)).toStrictEqual(result);
    expect(wasm.operateBinaryVectors(vectorB, vectorA, ADD)).toStrictEqual(result);
});

test(`Add matrices`, () => {
    const matrixA = from([
        [2, 3, 4],
        [5, 6, 7]
    ]) as Matrix;
    const matrixB = from([
        [8, 9, 10],
        [11, 12, 13]
    ]) as Matrix;
    const result = from([
        [10, 12, 14],
        [16, 18, 20]
    ]) as Matrix;

    expect(add(matrixA, matrixB)).toStrictEqual(result);
    expect(add(matrixB, matrixA)).toStrictEqual(result);

    // Incompatible matrix operation must throw an error
    expect(() => add(matrixB, from([
        [1, 2, 3, 4],
        [5, 6, 7, 8]
    ]))).toThrow();

    expect(gpu.operateBinaryMatrices(matrixA, matrixB, ADD)).toEqual(result);
    expect(gpu.operateBinaryMatrices(matrixB, matrixA, ADD)).toEqual(result);
    expect(v8.operateBinaryMatrices(matrixA, matrixB, ADD)).toStrictEqual(result);
    expect(v8.operateBinaryMatrices(matrixB, matrixA, ADD)).toStrictEqual(result);
    expect(wasm.operateBinaryMatrices(matrixA, matrixB, ADD)).toStrictEqual(result);
    expect(wasm.operateBinaryMatrices(matrixB, matrixA, ADD)).toStrictEqual(result);
});

test(`Add a vector and a matrix`, () => {
    const result = from([
        [2, 4, 6],
        [5, 7, 9]
    ]);
    // broadcast vector to matrix
    expect(add(vector, matrix)).toStrictEqual(result);
    expect(add(matrix, vector)).toStrictEqual(result);

    // broadcast rows with dimension 1
    expect(add(matrix, from([[1, 2, 3]]))).toStrictEqual(result);
    expect(add(from([[1, 2, 3]]), matrix)).toStrictEqual(result);

    // broadcast columns with dimension 1
    expect(add(matrix, from([[1], [2]]))).toStrictEqual(from([
        [2, 3, 4],
        [6, 7, 8]
    ]));
    expect(add(from([[1], [2]]), matrix)).toStrictEqual(from([
        [2, 3, 4],
        [6, 7, 8]
    ]));

    // Incompatible matrix and vvector multiplication must throw an error
    expect(() => add(matrix, from([1, 2, 3, 4]))).toThrow();
});
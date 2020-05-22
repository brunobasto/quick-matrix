/**
 * @jest-environment node
 */

import { ArithmeticOperation } from '../src/ts/ArithmeticOperator';
import { from } from '../src/ts/from';
import { Vector, Matrix } from '../src/ts/types';
import add from '../src/ts/add';
import ArithmeticOperatorGPU from '../src/ts/ArithmeticOperatorGPU';
import ArithmeticOperatorV8 from '../src/ts/ArithmeticOperatorV8';
import ArithmeticOperatorWASM from '../src/ts/ArithmeticOperatorWASM';

const gpu = new ArithmeticOperatorGPU();
const v8 = new ArithmeticOperatorV8();
const wasm = new ArithmeticOperatorWASM();

const { ADD } = ArithmeticOperation;

const vector = from([1, 2, 3]);
const matrix = from([
    [1, 2, 3],
    [4, 5, 6]
]);

test(`Add two numbers`, () => {
    const result = 5;

    expect(add(2, 3)).toBe(result);

    expect(gpu.operateOnScalars(2, 3, ADD)).toBe(result);
    expect(v8.operateOnScalars(2, 3, ADD)).toBe(result);
    expect(wasm.operateOnScalars(2, 3, ADD)).toBe(result);
});

test(`Add a number and a vector`, () => {
    const number = 2;
    const result = from([3, 4, 5]);

    expect(add(number, vector)).toStrictEqual(result);
    expect(add(vector, number)).toStrictEqual(result);

    expect(gpu.operateOnVectorAndScalar(vector as Vector, number, ADD)).toEqual(result);
    expect(v8.operateOnVectorAndScalar(vector as Vector, number, ADD)).toStrictEqual(result);
    expect(wasm.operateOnVectorAndScalar(vector as Vector, number, ADD)).toStrictEqual(result);
});

test(`Add a number and a matrix`, () => {
    const number = 2;
    const result = from([
        [3, 4, 5],
        [6, 7, 8]
    ]);

    expect(add(number, matrix)).toStrictEqual(result);
    expect(add(matrix, number)).toStrictEqual(result);

    expect(gpu.operateOnMatrixAndScalar(matrix as Matrix, number, ADD)).toEqual(result);
    expect(v8.operateOnMatrixAndScalar(matrix as Matrix, number, ADD)).toStrictEqual(result);
    expect(wasm.operateOnMatrixAndScalar(matrix as Matrix, number, ADD)).toStrictEqual(result);
});

test(`Add vectors`, () => {
    const vectorA = from([2, 3, 4]);
    const vectorB = from([5, 6, 7]);
    const result = from([7, 9, 11]);

    expect(add(vectorA, vectorB)).toStrictEqual(result);
    expect(add(vectorB, vectorA)).toStrictEqual(result);

    // Incompatible vector multiplication must throw an error
    expect(() => add(vectorA, from([1]))).toThrow();

    expect(gpu.operateOnVectors(vectorA as Vector, vectorB as Vector, ADD)).toEqual(result);
    expect(gpu.operateOnVectors(vectorB as Vector, vectorA as Vector, ADD)).toEqual(result);
    expect(v8.operateOnVectors(vectorA as Vector, vectorB as Vector, ADD)).toStrictEqual(result);
    expect(v8.operateOnVectors(vectorB as Vector, vectorA as Vector, ADD)).toStrictEqual(result);
    expect(wasm.operateOnVectors(vectorA as Vector, vectorB as Vector, ADD)).toStrictEqual(result);
    expect(wasm.operateOnVectors(vectorB as Vector, vectorA as Vector, ADD)).toStrictEqual(result);
});

test(`Add matrices`, () => {
    const matrixA = from([
        [2, 3, 4],
        [5, 6, 7]
    ]);
    const matrixB = from([
        [8, 9, 10],
        [11, 12, 13]
    ]);
    const result = from([
        [10, 12, 14],
        [16, 18, 20]
    ]);

    expect(add(matrixA, matrixB)).toStrictEqual(result);
    expect(add(matrixB, matrixA)).toStrictEqual(result);

    // Incompatible matrix multiplication must throw an error
    expect(() => add(matrixB, from([
        [1, 2, 3, 4],
        [5, 6, 7, 8]
    ]))).toThrow();

    expect(gpu.operateOnMatrices(matrixA as Matrix, matrixB as Matrix, ADD)).toEqual(result);
    expect(gpu.operateOnMatrices(matrixB as Matrix, matrixA as Matrix, ADD)).toEqual(result);
    expect(v8.operateOnMatrices(matrixA as Matrix, matrixB as Matrix, ADD)).toStrictEqual(result);
    expect(v8.operateOnMatrices(matrixB as Matrix, matrixA as Matrix, ADD)).toStrictEqual(result);
    expect(wasm.operateOnMatrices(matrixA as Matrix, matrixB as Matrix, ADD)).toStrictEqual(result);
    expect(wasm.operateOnMatrices(matrixB as Matrix, matrixA as Matrix, ADD)).toStrictEqual(result);
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
    expect(() => add(matrix, from([1, 2]))).toThrow();
});
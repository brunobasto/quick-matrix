/**
 * @jest-environment node
 */

import add from '../src/ts/add';
import ArithmeticOperatorWASM from '../src/ts/ArithmeticOperatorWASM';
import ArithmeticOperatorV8 from '../src/ts/ArithmeticOperatorV8';
import ArithmeticOperatorGPU from '../src/ts/ArithmeticOperatorGPU';
import { ArithmeticOperation } from '../src/ts/ArithmeticOperator';

const gpu = new ArithmeticOperatorGPU();
const v8 = new ArithmeticOperatorV8();
const wasm = new ArithmeticOperatorWASM();

const { ADD } = ArithmeticOperation;

const vector = [1, 2, 3];
const matrix = [
    [1, 2, 3],
    [4, 5, 6]
];

test(`Add two numbers`, () => {
    const result = 5;

    expect(add(2, 3)).toBe(result);

    expect(gpu.operateOnScalars(2, 3, ADD)).toBe(result);
    expect(v8.operateOnScalars(2, 3, ADD)).toBe(result);
    expect(wasm.operateOnScalars(2, 3, ADD)).toBe(result);
});

test(`Add a number and a vector`, () => {
    const number = 2;
    const result = [3, 4, 5];

    expect(add(number, vector)).toStrictEqual(result);
    expect(add(vector, number)).toStrictEqual(result);

    expect(gpu.operateOnVectorAndScalar(vector, number, ADD)).toEqual(result);
    expect(v8.operateOnVectorAndScalar(vector, number, ADD)).toStrictEqual(result);
    expect(wasm.operateOnVectorAndScalar(vector, number, ADD)).toStrictEqual(result);
});

test(`Add a number and a matrix`, () => {
    const number = 2;
    const result = [
        [3, 4, 5],
        [6, 7, 8]
    ];

    expect(add(number, matrix)).toStrictEqual(result);
    expect(add(matrix, number)).toStrictEqual(result);

    expect(gpu.operateOnMatrixAndScalar(matrix, number, ADD)).toEqual(result);
    expect(v8.operateOnMatrixAndScalar(matrix, number, ADD)).toStrictEqual(result);
    expect(wasm.operateOnMatrixAndScalar(matrix, number, ADD)).toStrictEqual(result);
});

test(`Add vectors`, () => {
    const vectorA = [2, 3, 4];
    const vectorB = [5, 6, 7];
    const result = [7, 9, 11];

    expect(add(vectorA, vectorB)).toStrictEqual(result);
    expect(add(vectorB, vectorA)).toStrictEqual(result);

    // Incompatible vector multiplication must throw an error
    expect(() => add(vectorA, [1])).toThrow();

    expect(gpu.operateOnVectors(vectorA, vectorB, ADD)).toEqual(result);
    expect(gpu.operateOnVectors(vectorB, vectorA, ADD)).toEqual(result);    
    expect(v8.operateOnVectors(vectorA, vectorB, ADD)).toStrictEqual(result);
    expect(v8.operateOnVectors(vectorB, vectorA, ADD)).toStrictEqual(result);
    expect(wasm.operateOnVectors(vectorA, vectorB, ADD)).toStrictEqual(result);
    expect(wasm.operateOnVectors(vectorB, vectorA, ADD)).toStrictEqual(result);
});

test(`Add matrices`, () => {
    const matrixA = [
        [2, 3, 4],
        [5, 6, 7]
    ];
    const matrixB = [
        [8, 9, 10],
        [11, 12, 13]
    ];
    const result = [
        [10, 12, 14],
        [16, 18, 20]
    ];

    expect(add(matrixA, matrixB)).toStrictEqual(result);
    expect(add(matrixB, matrixA)).toStrictEqual(result);

    // Incompatible matrix multiplication must throw an error
    expect(() => add(matrixB, [
        [1, 2, 3, 4],
        [5, 6, 7, 8]
    ])).toThrow();

    expect(gpu.operateOnMatrices(matrixA, matrixB, ADD)).toEqual(result);
    expect(gpu.operateOnMatrices(matrixB, matrixA, ADD)).toEqual(result);
    expect(v8.operateOnMatrices(matrixA, matrixB, ADD)).toStrictEqual(result);
    expect(v8.operateOnMatrices(matrixB, matrixA, ADD)).toStrictEqual(result);
    expect(wasm.operateOnMatrices(matrixA, matrixB, ADD)).toStrictEqual(result);
    expect(wasm.operateOnMatrices(matrixB, matrixA, ADD)).toStrictEqual(result);
});

test(`Add a vector and a matrix`, () => {
    const result = [
        [2, 4, 6],
        [5, 7, 9]
    ];
    // broadcast vector to matrix
    expect(add(vector, matrix)).toStrictEqual(result);
    expect(add(matrix, vector)).toStrictEqual(result);

    // broadcast rows with dimension 1
    expect(add(matrix, [[1, 2, 3]])).toStrictEqual(result);
    expect(add([[1, 2, 3]], matrix)).toStrictEqual(result);
    
    // broadcast columns with dimension 1
    expect(add(matrix, [[1], [2]])).toStrictEqual([
        [2, 3, 4],
        [6, 7, 8]
    ]);
    expect(add([[1], [2]], matrix)).toStrictEqual([
        [2, 3, 4],
        [6, 7, 8]
    ]);

    // Incompatible matrix and vvector multiplication must throw an error
    expect(() => add(matrix, [1, 2])).toThrow();
});
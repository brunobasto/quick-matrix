/**
 * @jest-environment node
 */

import multiply from '../src/ts/multiply';
import ArithmeticOperatorWASM from '../src/ts/ArithmeticOperatorWASM';
import ArithmeticOperatorV8 from '../src/ts/ArithmeticOperatorV8';
import ArithmeticOperatorGPU from '../src/ts/ArithmeticOperatorGPU';
import { ArithmeticOperation } from '../src/ts/ArithmeticOperator';

const gpu = new ArithmeticOperatorGPU();
const v8 = new ArithmeticOperatorV8();
const wasm = new ArithmeticOperatorWASM();

const { MULTIPLY } = ArithmeticOperation;

const vector = [1, 2, 3];
const matrix = [
    [1, 2, 3],
    [4, 5, 6]
];

test(`Multiply two numbers`, () => {
    expect(multiply(2, 3)).toBe(6);

    expect(gpu.operateOnScalars(2, 3, MULTIPLY)).toBe(6);
    expect(v8.operateOnScalars(2, 3, MULTIPLY)).toBe(6);
    expect(wasm.operateOnScalars(2, 3, MULTIPLY)).toBe(6);
});

test(`Multiply a number and a vector`, () => {
    const result = [2, 4, 6];

    expect(multiply(2, vector)).toStrictEqual(result);
    expect(multiply(vector, 2)).toStrictEqual(result);

    expect(gpu.operateOnVectorAndScalar(vector, 2, MULTIPLY)).toEqual(result);
    expect(v8.operateOnVectorAndScalar(vector, 2, MULTIPLY)).toStrictEqual(result);
    expect(wasm.operateOnVectorAndScalar(vector, 2, MULTIPLY)).toStrictEqual(result);
});

test(`Multiply a number and a matrix`, () => {
    const result = [
        [2, 4, 6],
        [8, 10, 12]
    ];

    expect(multiply(2, matrix)).toStrictEqual(result);
    expect(multiply(matrix, 2)).toStrictEqual(result);

    expect(gpu.operateOnMatrixAndScalar(matrix, 2, MULTIPLY)).toEqual(result);
    expect(v8.operateOnMatrixAndScalar(matrix, 2, MULTIPLY)).toStrictEqual(result);
    expect(wasm.operateOnMatrixAndScalar(matrix, 2, MULTIPLY)).toStrictEqual(result);
});

test(`Multiply vectors`, () => {
    const vectorA = [2, 3, 4];
    const vectorB = [5, 6, 7];
    const result = [10, 18, 28];

    expect(multiply(vectorA, vectorB)).toStrictEqual(result);
    expect(multiply(vectorB, vectorA)).toStrictEqual(result);

    // Incompatible vector multiplication must throw an error
    expect(() => multiply(vectorA, [1])).toThrow();

    expect(gpu.operateOnVectors(vectorA, vectorB, MULTIPLY)).toEqual(result);
    expect(gpu.operateOnVectors(vectorB, vectorA, MULTIPLY)).toEqual(result);    
    expect(v8.operateOnVectors(vectorA, vectorB, MULTIPLY)).toStrictEqual(result);
    expect(v8.operateOnVectors(vectorB, vectorA, MULTIPLY)).toStrictEqual(result);
    expect(wasm.operateOnVectors(vectorA, vectorB, MULTIPLY)).toStrictEqual(result);
    expect(wasm.operateOnVectors(vectorB, vectorA, MULTIPLY)).toStrictEqual(result);
});

test(`Multiply matrices`, () => {
    const matrixA = [
        [2, 3, 4],
        [5, 6, 7]
    ];
    const matrixB = [
        [8, 9, 10],
        [11, 12, 13]
    ];
    const result = [
        [16, 27, 40],
        [55, 72, 91]
    ];

    expect(multiply(matrixA, matrixB)).toStrictEqual(result);
    expect(multiply(matrixB, matrixA)).toStrictEqual(result);

    // Incompatible matrix multiplication must throw an error
    expect(() => multiply(matrixB, [
        [1, 2, 3, 4],
        [5, 6, 7, 8]
    ])).toThrow();

    expect(gpu.operateOnMatrices(matrixA, matrixB, MULTIPLY)).toEqual(result);
    expect(gpu.operateOnMatrices(matrixB, matrixA, MULTIPLY)).toEqual(result);
    expect(v8.operateOnMatrices(matrixA, matrixB, MULTIPLY)).toStrictEqual(result);
    expect(v8.operateOnMatrices(matrixB, matrixA, MULTIPLY)).toStrictEqual(result);
    expect(wasm.operateOnMatrices(matrixA, matrixB, MULTIPLY)).toStrictEqual(result);
    expect(wasm.operateOnMatrices(matrixB, matrixA, MULTIPLY)).toStrictEqual(result);
});

test(`Multiply a vector and a matrix`, () => {
    const result = [
        [1, 4, 9],
        [4, 10, 18]
    ];
    // broadcast vector to matrix
    expect(multiply(vector, matrix)).toStrictEqual(result);
    expect(multiply(matrix, vector)).toStrictEqual(result);

    // broadcast rows with dimension 1
    expect(multiply(matrix, [[1, 2, 3]])).toStrictEqual([
        [1, 4, 9],
        [4, 10, 18]
    ]);
    expect(multiply([[1, 2, 3]], matrix)).toStrictEqual([
        [1, 4, 9],
        [4, 10, 18]
    ]);
    
    // broadcast columns with dimension 1
    expect(multiply(matrix, [[1], [2]])).toStrictEqual([
        [1, 2, 3],
        [8, 10, 12]
    ]);
    expect(multiply([[1], [2]], matrix)).toStrictEqual([
        [1, 2, 3],
        [8, 10, 12]
    ]);

    // Incompatible matrix and vvector multiplication must throw an error
    expect(() => multiply(matrix, [1, 2])).toThrow();
});
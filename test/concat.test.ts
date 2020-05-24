/**
 * @jest-environment node
 */

import { from } from '../src/ts/api/from';
import { Vector, Matrix } from '../src/ts/types';
import concat from '../src/ts/api/concat';

const vector = from([1, 2, 3]) as Vector;
const matrix = from([
    [1, 2, 3],
    [4, 5, 6]
]) as Matrix;

test(`Concat two numbers`, () => {
    expect(() => concat(2 as any, 3 as any)).toThrow();
});

test(`Concat a number and a vector`, () => {
    const number = 2 as any;

    expect(() => concat(number, vector)).toThrow();
    expect(() => concat(vector, number)).toThrow();
});

test(`Concat a number and a matrix`, () => {
    const number = 2 as any;

    expect(() => concat(number, matrix)).toThrow();
    expect(() => concat(matrix, number)).toThrow();
});

test(`Concat vectors`, () => {
    const vectorA = from([2, 3, 4]) as Vector;
    const vectorB = from([5, 6, 7]) as Vector;

    expect(concat(vectorA, vectorB)).toStrictEqual(from([2, 3, 4, 5, 6, 7]));
    expect(concat(vectorB, vectorA)).toStrictEqual(from([5, 6, 7, 2, 3, 4]));
});

test(`Concat matrices`, () => {
    const matrixA = from([
        [2, 3, 4],
        [5, 6, 7]
    ]) as Matrix;
    const matrixB = from([
        [8, 9, 10],
        [11, 12, 13]
    ]) as Matrix;

    expect(concat(matrixA, matrixB)).toStrictEqual(from([
        [2, 3, 4],
        [5, 6, 7],
        [8, 9, 10],
        [11, 12, 13]
    ]));
    expect(concat(matrixB, matrixA)).toStrictEqual(from([
        [8, 9, 10],
        [11, 12, 13],
        [2, 3, 4],
        [5, 6, 7],
    ]));
    expect(concat(matrixA, matrixB, 1)).toStrictEqual(from([
        [2, 3, 4, 8, 9, 10],
        [5, 6, 7, 11, 12, 13]
    ]));
    expect(concat(matrixB, matrixA, 1)).toStrictEqual(from([
        [8, 9, 10, 2, 3, 4],
        [11, 12, 13, 5, 6, 7]
    ]));

    // Incompatible matrix operation must throw an error
    expect(() => concat(matrixB, from([
        [1, 2, 3, 4],
        [5, 6, 7, 8]
    ]) as Matrix)).toThrow();

    expect(() => concat(matrixB, from([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12]
    ]) as Matrix, 1)).toThrow();
});

test(`Concat a vector and a matrix`, () => {
    expect(concat(vector, matrix)).toStrictEqual(from([
        [1, 2, 3],
        [1, 2, 3],
        [4, 5, 6],
    ]));
    expect(concat(from([11, 12]) as Vector, matrix, 1)).toStrictEqual(from([
        [11, 1, 2, 3],
        [12, 4, 5, 6],
    ]));
    expect(() => concat(vector, from([
        [1],
        [2]
    ]) as Matrix)).toThrow();
    expect(() => concat(from([
        [1],
        [2]
    ]) as Matrix, vector)).toThrow();
    expect(() => concat(vector, from([
        [1],
        [2]
    ]) as Matrix, 1)).toThrow();
    expect(() => concat(from([
        [1],
        [2]
    ]) as Matrix, vector, 1)).toThrow();
    expect(concat(matrix, vector)).toStrictEqual(from([
        [1, 2, 3],
        [4, 5, 6],
        [1, 2, 3],
    ]));
    expect(concat(matrix, from([11, 12]) as Vector, 1)).toStrictEqual(from([
        [1, 2, 3, 11],
        [4, 5, 6, 12],
    ]));
});
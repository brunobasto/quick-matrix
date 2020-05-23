/**
 * @jest-environment node
 */

import { Engine } from '../src/ts/engines/Engine';
import { from } from '../src/ts/api/from';
import { Vector, Operation, Matrix } from '../src/ts/types';
import EngineGPU from '../src/ts/engines/EngineGPU';
import EngineV8 from '../src/ts/engines/EngineV8';
import EngineWASM from '../src/ts/engines/EngineWASM';
import subtract from '../src/ts/api/subtract';

const { SUBTRACT } = Operation;
const engines = [new EngineGPU(), new EngineWASM(), new EngineV8()];

const forEachEngine = (fn: Function) => engines.forEach(engine => fn(engine));

test(`Subtract two numbers`, () => {
    const [operandA, operandB] = [2, 3];
    const [resultA, resultB] = [-1, 1];

    expect(subtract(2, 3)).toBe(resultA);
    expect(subtract(3, 2)).toBe(resultB);

    forEachEngine((engine: Engine) => {
        expect(engine.operateBinaryScalars(operandA, operandB, SUBTRACT)).toBe(resultA);
        expect(engine.operateBinaryScalars(operandB, operandA, SUBTRACT)).toBe(resultB);
    });
});

test(`Subtract a number and a vector`, () => {
    const number = 2;
    const vector = from([1, 2, 3]) as Vector;
    // number - vector
    const resultA = from([1, 0, -1]);
    // vector - number
    const resultB = from([-1, 0, 1]);

    expect(subtract(number, vector)).toStrictEqual(resultA);
    expect(subtract(vector, number)).toStrictEqual(resultB);

    forEachEngine((engine: Engine) => {
        expect(engine.operateBinaryVectorAndScalar(vector, number, SUBTRACT, true)).toEqual(resultA);
        expect(engine.operateBinaryVectorAndScalar(vector, number, SUBTRACT, false)).toEqual(resultB);
    })
});

test(`Subtract a number and a matrix`, () => {
    const number = 2;
    const matrix = from([
        [1, 2, 3],
        [4, 5, 6]
    ]) as Matrix;
    // number - matrix
    const resultA = from([
        [1, 0, -1],
        [-2, -3, -4]
    ]);
    // matrix - number
    const resultB = from([
        [-1, 0, 1],
        [2, 3, 4]
    ]);

    expect(subtract(number, matrix)).toStrictEqual(resultA);
    expect(subtract(matrix, number)).toStrictEqual(resultB);

    forEachEngine((engine: Engine) => {
        expect(engine.operateBinaryMatrixAndScalar(matrix, number, SUBTRACT, true)).toEqual(resultA);
        expect(engine.operateBinaryMatrixAndScalar(matrix, number, SUBTRACT, false)).toEqual(resultB);
    });
});

test(`Subtract vectors`, () => {
    const vectorA = from([2, 3, 4]) as Vector;
    const vectorB = from([5, 6, 7]) as Vector;
    // vectorA - vectorB
    const resultA = from([-3, -3, -3]) as Vector;
    // vectorB - vectorA
    const resultB = from([3, 3, 3]) as Vector;

    expect(subtract(vectorA, vectorB)).toStrictEqual(resultA);
    expect(subtract(vectorB, vectorA)).toStrictEqual(resultB);

    // Incompatible vector operation must throw an error
    expect(() => subtract(vectorA, from([1]))).toThrow();

    forEachEngine((engine: Engine) => {
        expect(engine.operateBinaryVectors(vectorA, vectorB, SUBTRACT)).toEqual(resultA);
        expect(engine.operateBinaryVectors(vectorB, vectorA, SUBTRACT)).toEqual(resultB);
    })
});

test(`Subtract matrices`, () => {
    const matrixA = from([
        [2, 3, 4],
        [5, 6, 7]
    ]) as Matrix;
    const matrixB = from([
        [8, 9, 10],
        [11, 12, 13]
    ]) as Matrix;
    // matrixA - matrixB
    const resultA = from([
        [-6, -6, -6],
        [-6, -6, -6]
    ]) as Matrix;
    // matrixB - matrixA
    const resultB = from([
        [6, 6, 6],
        [6, 6, 6]
    ]) as Matrix;

    expect(subtract(matrixA, matrixB)).toStrictEqual(resultA);
    expect(subtract(matrixB, matrixA)).toStrictEqual(resultB);

    // Incompatible matrix operation must throw an error
    expect(() => subtract(matrixB, from([
        [1, 2, 3, 4],
        [5, 6, 7, 8]
    ]))).toThrow();

    forEachEngine((engine: Engine) => {
        expect(engine.operateBinaryMatrices(matrixA, matrixB, SUBTRACT)).toEqual(resultA);
        expect(engine.operateBinaryMatrices(matrixB, matrixA, SUBTRACT)).toEqual(resultB);
    })
});

test(`Subtract a vector and a matrix`, () => {
    const vector = from([1, 2, 3]) as Vector;
    const matrix = from([
        [1, 2, 3],
        [4, 5, 6]
    ]) as Matrix;

    // broadcast vector to matrix
    expect(subtract(vector, matrix)).toStrictEqual(from([
        [0, 0, 0],
        [-3, -3, -3]
    ]));
    expect(subtract(matrix, vector)).toStrictEqual(from([
        [0, 0, 0],
        [3, 3, 3]
    ]));

    // broadcast rows with dimension 1
    expect(subtract(matrix, from([vector]))).toStrictEqual(from([
        [0, 0, 0],
        [3, 3, 3]
    ]));
    expect(subtract(from([vector]), matrix)).toStrictEqual(from([
        [0, 0, 0],
        [-3, -3, -3]
    ]));

    // broadcast columns with dimension 1
    expect(subtract(matrix, from([[1], [2]]))).toStrictEqual(from([
        [0, 1, 2],
        [2, 3, 4]
    ]));
    expect(subtract(from([[1], [2]]), matrix)).toStrictEqual(from([
        [0, -1, -2],
        [-2, -3, -4]
    ]));

    // Incompatible matrix and vvector multiplication must throw an error
    expect(() => subtract(matrix, from([1, 2]))).toThrow();
});
/**
 * @jest-environment node
 */

import { Engine } from '../src/ts/engines/Engine';
import { from } from '../src/ts/api/from';
import { Vector, Operation, Matrix } from '../src/ts/types';
import EngineGPU from '../src/ts/engines/EngineGPU';
import EngineV8 from '../src/ts/engines/EngineV8';
import EngineWASM from '../src/ts/engines/EngineWASM';
import divide from '../src/ts/api/divide';

const { DIVIDE } = Operation;
const engines = [new EngineGPU(), new EngineWASM(), new EngineV8()];

const forEachEngine = (fn: Function) => engines.forEach(engine => fn(engine));

test(`Divide two numbers`, () => {
    const [operandA, operandB] = [2, 4];
    const [resultA, resultB] = [operandA / operandB, operandB / operandA];

    expect(divide(operandA, operandB)).toBe(resultA);
    expect(divide(operandB, operandA)).toBe(resultB);

    forEachEngine((engine: Engine) => {
        expect(engine.operateBinaryScalars(operandA, operandB, DIVIDE)).toBe(resultA);
        expect(engine.operateBinaryScalars(operandB, operandA, DIVIDE)).toBe(resultB);
    });
});

test(`Divide a number and a vector`, () => {
    const number = 2;
    const vector = from([2, 4, 8]) as Vector;
    // number / vector
    const resultA = from([number / 2, number / 4, number / 8]);
    // vector / number
    const resultB = from([2 / number, 4 / number, 8 / number]);

    expect(divide(number, vector)).toStrictEqual(resultA);
    expect(divide(vector, number)).toStrictEqual(resultB);

    forEachEngine((engine: Engine) => {
        expect(engine.operateBinaryVectorAndScalar(vector, number, DIVIDE, true)).toEqual(resultA);
        expect(engine.operateBinaryVectorAndScalar(vector, number, DIVIDE, false)).toEqual(resultB);
    })
});

test(`Divide a number and a matrix`, () => {
    const number = 2;
    const matrix = from([
        [2, 4, 8],
        [16, 32, 64]
    ]) as Matrix;
    // number / matrix
    const resultA = from([
        [number / 2, number / 4, number / 8],
        [number / 16, number / 32, number / 64]
    ]);
    // matrix / number
    const resultB = from([
        [2 / number, 4 / number, 8 / number],
        [16 / number, 32 / number, 64 / number]
    ]);

    expect(divide(number, matrix)).toStrictEqual(resultA);
    expect(divide(matrix, number)).toStrictEqual(resultB);

    forEachEngine((engine: Engine) => {
        expect(engine.operateBinaryMatrixAndScalar(matrix, number, DIVIDE, true)).toEqual(resultA);
        expect(engine.operateBinaryMatrixAndScalar(matrix, number, DIVIDE, false)).toEqual(resultB);
    });
});

test(`Divide vectors`, () => {
    const vectorA = from([2, 4, 8]) as Vector;
    const vectorB = from([16, 32, 64]) as Vector;
    // vectorA / vectorB
    const resultA = from([2 / 16, 4 / 32, 8 / 64]) as Vector;
    // vectorB / vectorA
    const resultB = from([16 / 2, 32 / 4, 64 / 8]) as Vector;

    expect(divide(vectorA, vectorB)).toStrictEqual(resultA);
    expect(divide(vectorB, vectorA)).toStrictEqual(resultB);

    // Incompatible vector operation must throw an error
    expect(() => divide(vectorA, from([1]))).toThrow();

    forEachEngine((engine: Engine) => {
        expect(engine.operateBinaryVectors(vectorA, vectorB, DIVIDE)).toEqual(resultA);
        expect(engine.operateBinaryVectors(vectorB, vectorA, DIVIDE)).toEqual(resultB);
    })
});

test(`Divide matrices`, () => {
    const matrixA = from([
        [2, 4, 8],
        [16, 32, 64]
    ]) as Matrix;
    const matrixB = from([
        [128, 256, 512],
        [1024, 2048, 4096]
    ]) as Matrix;
    // matrixA / matrixB
    const resultA = from([
        [2 / 128, 4 / 256, 8 / 512],
        [16 / 1024, 32 / 2048, 64 / 4096]
    ]) as Matrix;
    // matrixB / matrixA
    const resultB = from([
        [128 / 2, 256 / 4, 512 / 8],
        [1024 / 16, 2048 / 32, 4096 / 64]
    ]) as Matrix;

    expect(divide(matrixA, matrixB)).toStrictEqual(resultA);
    expect(divide(matrixB, matrixA)).toStrictEqual(resultB);

    // Incompatible matrix operation must throw an error
    expect(() => divide(matrixB, from([
        [1, 2, 3, 4],
        [5, 6, 7, 8]
    ]))).toThrow();

    forEachEngine((engine: Engine) => {
        expect(engine.operateBinaryMatrices(matrixA, matrixB, DIVIDE)).toEqual(resultA);
        expect(engine.operateBinaryMatrices(matrixB, matrixA, DIVIDE)).toEqual(resultB);
    })
});

test(`Divide a vector and a matrix`, () => {
    const vector = from([2, 4, 8]) as Vector;
    const matrix = from([
        [16, 32, 64],
        [128, 256, 512]
    ]) as Matrix;

    // broadcast vector to matrix
    expect(divide(vector, matrix)).toStrictEqual(from([
        [2 / 16, 4 / 32, 8 / 64],
        [2 / 128, 4 / 256, 8 / 512]
    ]));
    expect(divide(matrix, vector)).toStrictEqual(from([
        [16 / 2, 32 / 4, 64 / 8],
        [128 / 2, 256 / 4, 512 / 8]
    ]));

    // broadcast rows with dimension 1
    expect(divide(matrix, from([vector]))).toStrictEqual(from([
        [16 / 2, 32 / 4, 64 / 8],
        [128 / 2, 256 / 4, 512 / 8]
    ]));
    expect(divide(from([vector]), matrix)).toStrictEqual(from([
        [2 / 16, 4 / 32, 8 / 64],
        [2 / 128, 4 / 256, 8 / 512]
    ]));

    // broadcast columns with dimension 1
    expect(divide(matrix, from([[2], [4]]))).toStrictEqual(from([
        [16 / 2, 32 / 2, 64 / 2],
        [128 / 4, 256 / 4, 512 / 4]
    ]));
    expect(divide(from([[2], [4]]), matrix)).toStrictEqual(from([
        [2 / 16, 2 / 32, 2 / 64],
        [4 / 128, 4 / 256, 4 / 512]
    ]));

    // Incompatible matrix and vvector multiplication must throw an error
    expect(() => divide(matrix, from([1, 2]))).toThrow();
});
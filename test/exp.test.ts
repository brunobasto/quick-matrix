/**
 * @jest-environment node
 */

import { Engine } from '../src/ts/engines/Engine';
import { from } from '../src/ts/api/from';
import { Vector, Operation, Matrix } from '../src/ts/types';
import EngineGPU from '../src/ts/engines/EngineGPU';
import EngineV8 from '../src/ts/engines/EngineV8';
import EngineWASM from '../src/ts/engines/EngineWASM';
import exp from '../src/ts/api/exp';

const engines = [new EngineGPU(), new EngineWASM(), new EngineV8()];
const forEachEngine = (fn: Function) => engines.forEach(engine => fn(engine));

const { EXP } = Operation;

const scalar = 2;

const assertWithPrecision = (actual: Float32Array, expected: Float32Array) => {
    for (let i = 0; i < actual.length; i++) {
        expect(actual[i]).toBeCloseTo(expected[i]);
    }
}

test(`Exp of a scalar`, () => {
    const expected = Math.exp(scalar);

    expect(exp(scalar)).toBe(expected);

    forEachEngine((engine: Engine) => {
        engine.operateUnaryScalar(scalar, EXP);
    });
});

test(`Exp of a vector`, () => {
    const vector = from([1, 2, 3]) as Vector;
    const expected = from([
        Math.exp(vector[0]),
        Math.exp(vector[1]),
        Math.exp(vector[2])
    ]) as Vector;

    expect(exp(vector)).toStrictEqual(expected);

    forEachEngine((engine: Engine) => {
        const actual = engine.operateUnaryVector(vector, EXP);

        assertWithPrecision(actual, expected);
    });
});

test(`Exp of a matrix`, () => {
    const matrix = from([
        [1, 2, 3],
        [4, 5, 6]
    ]) as Matrix;
    const expected = from([
        [Math.exp(matrix[0][0]), Math.exp(matrix[0][1]), Math.exp(matrix[0][2])],
        [Math.exp(matrix[1][0]), Math.exp(matrix[1][1]), Math.exp(matrix[1][2])]
    ]) as Matrix;

    expect(exp(matrix)).toStrictEqual(expected);

    forEachEngine((engine: Engine) => {
        const actual = engine.operateUnaryMatrix(matrix, EXP);

        for (let i = 0; i < expected.length; i++) {
            assertWithPrecision(actual[i], expected[i]);
        }
    });
});
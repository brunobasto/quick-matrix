/**
 * @jest-environment node
 */

import { Engine } from '../src/ts/engines/Engine';
import { from } from '../src/ts/api/from';
import { Operation, Matrix } from '../src/ts/types';
import EngineGPU from '../src/ts/engines/EngineGPU';
import EngineV8 from '../src/ts/engines/EngineV8';
import EngineWASM from '../src/ts/engines/EngineWASM';
import product from '../src/ts/api/product';

const { PRODUCT } = Operation;
const engines = [new EngineGPU(), new EngineWASM(), new EngineV8()];

const forEachEngine = (fn: Function) => engines.forEach(engine => fn(engine));

test(`Matrix product`, () => {
    const matrixA = from([
        [2, 4, 8],
        [16, 32, 64]
    ]) as Matrix;
    const matrixB = from([
        [3, 6],
        [9, 12],
        [15, 18]
    ]) as Matrix;
    // matrixA / matrixB
    const result = from([
        [162, 204],
        [1296, 1632]
    ]) as Matrix;

    expect(product(matrixA, matrixB)).toStrictEqual(result);

    // Incompatible matrix operation must throw an error
    expect(() => product(matrixA, from([
        [1, 2, 3, 4],
        [5, 6, 7, 8]
    ]) as Matrix)).toThrow();

    forEachEngine((engine: Engine) => {
        expect(engine.operateBinaryMatrices(matrixA, matrixB, PRODUCT)).toStrictEqual(result);
    })
});

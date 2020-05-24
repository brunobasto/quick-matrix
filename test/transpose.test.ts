/**
 * @jest-environment node
 */

import { Engine } from '../src/ts/engines/Engine';
import { from, transpose } from '../src/ts';
import { Operation, Matrix } from '../src/ts/types';
import EngineGPU from '../src/ts/engines/EngineGPU';
import EngineV8 from '../src/ts/engines/EngineV8';
import EngineWASM from '../src/ts/engines/EngineWASM';

const engines = [new EngineGPU(), new EngineWASM(), new EngineV8()];
const forEachEngine = (fn: Function) => engines.forEach(engine => fn(engine));
const { TRANSPOSE } = Operation;

test(`Transpose a matrix`, () => {
    const matrix = from([
        [1, 2, 3],
        [4, 5, 6]
    ]) as Matrix;
    const expected = from([
        [1, 4],
        [2, 5],
        [3, 6],
    ]) as Matrix;

    expect(transpose(matrix)).toStrictEqual(expected);

    forEachEngine((engine: Engine) => {
        expect(engine.operateUnaryMatrix(matrix, TRANSPOSE)).toStrictEqual(expected);
    });
});
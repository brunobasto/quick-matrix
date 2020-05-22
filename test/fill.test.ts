/**
 * @jest-environment node
 */

import { Shape } from '../src/ts/types';
import { fill } from '../src/ts/fill';
import shape from '../src/ts/shape';

test(`Creates a matrix of given shape with given number`, () => {
    const value = 5;
    const expectedShape = [20, 15] as Shape;
    const matrix = fill(expectedShape, value);

    expect(shape(matrix)).toStrictEqual(expectedShape);

    for (let i = 0; i < expectedShape[0]; i++) {
        for (let j = 0; j < expectedShape[1]; j++) {
            expect(matrix[i][j]).toBe(value);
        }
    }
});

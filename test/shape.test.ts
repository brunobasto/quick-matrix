/**
 * @jest-environment node
 */

import { from } from '../src/ts/api/from';
import shape from '../src/ts/api/shape';

test(`shape of number`, () => {
    expect(shape(2)).toStrictEqual([0, 0]);
});

test(`shape of vector`, () => {
    expect(shape(from([3, 4]))).toStrictEqual([2, 0]);
});

test(`shape of empty vector`, () => {
    expect(shape([])).toStrictEqual([0, 0]);
});

test(`shape of matrix`, () => {
    const matrix = from([
        [1, 2],
        [3, 4],
        [3, 4]
    ]);
    expect(shape(matrix)).toStrictEqual([3, 2]);
});
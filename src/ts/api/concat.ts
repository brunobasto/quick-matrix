import { Matrix, Vector, VectorOrMatrix } from '../types';
import shape from './shape';
import from from './from';

// Axis 0: Concat rows
// Axis 1: concat columns
export default (
    a: VectorOrMatrix,
    b: VectorOrMatrix,
    axis: number = 0
): VectorOrMatrix => {
    const [shapeA, shapeB] = [shape(a), shape(b)];

    if (axis > 1 || shapeA.length === 0 || shapeB.length === 0) {
        throw new Error(
            `Concatenation is only supported on 1d (vector) and 2d (matrices).`);
    }

    // concat two vectors
    if (shapeA.length === 1 && shapeB.length === 1) {
        return concatVectors(a as Vector, b as Vector);
    }

    const [rowsA, columnsA] = shapeA;
    const [rowsB, columnsB] = shapeB;

    // concat on rows
    if (axis === 0) {
        // a is a vector and b is a matrix
        if (shapeA.length === 1) {
            if (rowsA !== columnsB) {
                throw new Error(
                    `Vector length is not compatible with matrix columns`);
            }

            return [a as Vector].concat(b as Matrix);
        }

        // b is a vector and a is a matrix
        if (shapeB.length === 1) {
            if (rowsB !== columnsA) {
                throw new Error(
                    `Vector length is not compatible with matrix columns`);
            }

            return (a as Matrix).concat([b as Vector]);
        }

        if (columnsA !== columnsB) {
            throw new Error(
                `concat(): Matrices columns are not compatible`);
        }

        return ((a as Matrix).concat(b as Matrix));
    }

    // a is a vector and b is a matrix
    if (shapeA.length === 1) {
        if (rowsA !== rowsB) {
            throw new Error(
                `Vector length is not compatible with matrix rows`);
        }

        return (b as Matrix).map(
            (column, i) => concatVectors(
                from([a[i]]) as Vector,
                column
            )
        );
    }

    // b is a vector and a is a matrix
    if (shapeB.length === 1) {
        if (rowsA !== rowsB) {
            throw new Error(
                `Vector length is not compatible with matrix rows`);
        }

        return (a as Matrix).map(
            (column, i) => concatVectors(
                column,
                from([b[i]]) as Vector
            )
        );
    }

    if (rowsA !== rowsB) {
        throw new Error(
            `Matrices rows are not compatible`);
    }

    return (a as Matrix).map((column, i) => {
        return concatVectors(column, (b as Matrix)[i]);
    });
}

const concatVectors = (a: Vector, b: Vector): Vector => {
    const result = new Float32Array(a.length + b.length);

    result.set(a as Vector);
    result.set(b as Vector, a.length);

    return result;
}
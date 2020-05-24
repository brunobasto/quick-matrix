import { fill } from "../api/fill";
import { Matrix } from "../types";
import shape from "../api/shape";

export const transpose = (a: Matrix) => {
    const [rows, columns] = shape(a);
    const result = fill([columns, rows], 0) as Matrix;

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            result[i][j] = a[j][i];
        }
    }

    return result;
}

export const matrixProduct = (a: Matrix, b: Matrix): Matrix => {
    const [shapeA, shapeB] = [shape(a), shape(b)];
    const [[rowsA, columnsA], [rowsB, columnsB]] = [shapeA, shapeB];
    const result = fill([rowsA, columnsB], 0) as Matrix;

    for (let m = 0; m < rowsA; m++) {
        for (let n = 0; n < columnsB; n++) {
            for (let k = 0; k < columnsA; k++) {
                result[m][n] += a[m][k] * b[k][n];
            }
        }
    }

    return result;
}
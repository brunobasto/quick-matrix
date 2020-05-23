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
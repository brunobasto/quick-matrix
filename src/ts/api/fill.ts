import { Shape, Matrix, Vector, Scalar, Value } from "../types";

export const fillVector = (size: number, value: Scalar): Vector => {
    const vector = new Float32Array(size);

    for (let j = 0; j < size; j++) {
        vector[j] = value;
    }

    return vector;
}

export const fill = (shape: Shape, value: Scalar): Value => {
    const [rows, columns] = shape;
    const matrix: Matrix = Array(rows);

    if (shape.length === 0) {
        return value;
    }

    if (shape.length === 1 || !columns) {
        return fillVector(rows, value);
    }

    for (let i = 0; i < rows; i++) {
        matrix[i] = fillVector(columns, value);
    }

    return matrix;
}
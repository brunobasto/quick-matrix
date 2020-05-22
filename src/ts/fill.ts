import { Shape, Matrix, Vector } from "./types";

export const fillVector = (size: number, value: number): Vector => {
    const vector = new Float32Array(size);

    for (let j = 0; j < size; j++) {
        vector[j] = value;
    }

    return vector;
}

export const fill = (shape: Shape, value: number): Matrix => {
    const [rows, columns] = shape;
    const matrix: Matrix = Array(rows);

    for (let i = 0; i < rows; i++) {
        matrix[i] = fillVector(columns, value);
    }

    return matrix;
}
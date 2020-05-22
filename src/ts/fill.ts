import { Shape, Matrix } from "./types";

export default (shape: Shape, value: number): Matrix => {
    const [rows, columns] = shape;
    const result: Matrix = Array(rows);

    for (let i = 0; i < rows; i++) {
        result[i] = Array(columns).fill(value);
    }

    return result;
}
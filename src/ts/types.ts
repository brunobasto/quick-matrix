export type TypedArray = Float32Array;

export type Scalar = number;
export type Vector = TypedArray;
export type Matrix = Vector[];
export type VectorOrMatrix = Vector|Matrix;
export type Value = Scalar|VectorOrMatrix;
export type Shape = number[];

// Do not reorder
export enum Operation {
    ADD,
    DIVIDE,
    MULTIPLY,
    SUBTRACT,
    EXP,
    TRANSPOSE,
    PRODUCT,
    CONCAT
}
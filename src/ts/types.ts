export type TypedArray = Float32Array;

export type Vector = TypedArray;
export type Matrix = Vector[];
export type VectorOrMatrix = Vector|Matrix;
export type Value = number|VectorOrMatrix;
export type Shape = number[];
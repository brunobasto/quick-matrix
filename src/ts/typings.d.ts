import { Value, VectorOrMatrix, Shape, Scalar, Matrix } from "./types";

export type add = (a: Value, b: Value) => Value;
export type concat = (a: VectorOrMatrix, b: VectorOrMatrix, axis: number) => VectorOrMatrix
export type divide = (a: Value, b: Value) => Value;
export type exp = (a: Value) => Value;
export type fill = (shape: Shape, value: Scalar) => VectorOrMatrix;
export type from = (value: any) => Value;
export type multiply = (a: Value, b: Value) => Value;
export type ones = (shape: Shape) => VectorOrMatrix;
export type product = (a: Matrix, b: Matrix) => Matrix;
export type shape = (a: Value) => Shape;
export type subtract = (a: Value, b: Value) => Value;
export type transpose = (a: Matrix) => Matrix;
export type zeros = (shape: Shape) => VectorOrMatrix;

export * from './types';
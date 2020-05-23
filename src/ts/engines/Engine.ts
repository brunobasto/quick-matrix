import { Matrix, Vector } from "../types";

export enum Operation {
    ADD,
    DIVIDE,
    MULTIPLY,
    SUBTRACT,
}

export interface Engine {
    operateOnMatrices: (
        a: Matrix,
        b: Matrix,
        operation: Operation
    ) => Matrix;
    operateOnMatrixAndScalar: (
        a: Matrix,
        b: number,
        operation: Operation
    ) => Matrix;
    operateOnScalars: (
        a: number,
        b: number,
        operation: Operation
    ) => number;
    operateOnVectorAndScalar: (
        a: Vector,
        b: number,
        operation: Operation
    ) => Vector;
    operateOnVectors: (
        a: Vector,
        b: Vector,
        operation: Operation
    ) => Vector;
}
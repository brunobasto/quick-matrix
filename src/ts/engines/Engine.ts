import { Matrix, Operation, Vector } from "../types";

export interface Engine {
    operateOnMatrices: (
        a: Matrix,
        b: Matrix,
        operation: Operation
    ) => Matrix;
    operateOnMatrixAndScalar: (
        a: Matrix,
        b: number,
        operation: Operation,
        reverse: boolean
    ) => Matrix;
    operateOnScalars: (
        a: number,
        b: number,
        operation: Operation
    ) => number;
    operateOnVectorAndScalar: (
        a: Vector,
        b: number,
        operation: Operation,
        reverse: boolean
    ) => Vector;
    operateOnVectors: (
        a: Vector,
        b: Vector,
        operation: Operation
    ) => Vector;
}
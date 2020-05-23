import { Matrix, Operation, Vector, Scalar } from "../types";

export interface Engine {
    operateOnMatrices: (
        a: Matrix,
        b: Matrix,
        operation: Operation
    ) => Matrix;
    operateOnMatrixAndScalar: (
        a: Matrix,
        b: Scalar,
        operation: Operation,
        reverse: boolean
    ) => Matrix;
    operateOnScalars: (
        a: Scalar,
        b: Scalar,
        operation: Operation
    ) => Scalar;
    operateOnVectorAndScalar: (
        a: Vector,
        b: Scalar,
        operation: Operation,
        reverse: boolean
    ) => Vector;
    operateOnVectors: (
        a: Vector,
        b: Vector,
        operation: Operation
    ) => Vector;
}
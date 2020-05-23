import { Matrix, Operation, Vector, Scalar } from "../types";

export interface Engine {
    operateBinaryMatrices: (
        a: Matrix,
        b: Matrix,
        operation: Operation
    ) => Matrix;
    operateBinaryMatrixAndScalar: (
        a: Matrix,
        b: Scalar,
        operation: Operation,
        reverse: boolean
    ) => Matrix;
    operateBinaryScalars: (
        a: Scalar,
        b: Scalar,
        operation: Operation
    ) => Scalar;
    operateBinaryVectorAndScalar: (
        a: Vector,
        b: Scalar,
        operation: Operation,
        reverse: boolean
    ) => Vector;
    operateBinaryVectors: (
        a: Vector,
        b: Vector,
        operation: Operation
    ) => Vector;
    operateUnaryScalar: (
        a: Scalar,
        operation: Operation
    ) => Scalar;
    operateUnaryVector: (
        a: Vector,
        operation: Operation
    ) => Vector;
    operateUnaryMatrix: (
        a: Matrix,
        operation: Operation
    ) => Matrix;
}
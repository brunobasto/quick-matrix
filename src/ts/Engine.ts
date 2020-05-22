import { Matrix, Vector } from "./types";

export enum ArithmeticOperation {
    ADD,
    DIVIDE,
    MULTIPLY,
    SUBTRACT,
}

export interface Engine {
    operateOnMatrices: (
        a: Matrix,
        b: Matrix,
        operation: ArithmeticOperation
    ) => Matrix;
    operateOnMatrixAndScalar: (
        a: Matrix,
        b: number,
        operation: ArithmeticOperation
    ) => Matrix;
    operateOnScalars: (
        a: number,
        b: number,
        operation: ArithmeticOperation
    ) => number;
    operateOnVectorAndScalar: (
        a: Vector,
        b: number,
        operation: ArithmeticOperation
    ) => Vector;
    operateOnVectors: (
        a: Vector,
        b: Vector,
        operation: ArithmeticOperation
    ) => Vector;
}
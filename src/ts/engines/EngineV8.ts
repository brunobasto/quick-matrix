import { Engine } from "./Engine";
import { Matrix, Operation, Vector, Scalar } from "../types";

export default class EngineV8 implements Engine {
    operateOnMatrices(
        a: Matrix,
        b: Matrix,
        operation: Operation
    ): Matrix {
        return a.map((v: Vector, i: Scalar) => {
            return v.map((n, j) => this.operateOnScalars(n, b[i][j], operation));
        });
    }

    operateOnMatrixAndScalar(
        a: Matrix,
        b: Scalar,
        operation: Operation,
        reverse: boolean = false
    ): Matrix {
        return a.map((v: Vector) => {
            return this.operateOnVectorAndScalar(v, b, operation, reverse) as Vector;
        });
    }

    operateOnScalars(
        a: Scalar,
        b: Scalar,
        operation: Operation
    ): Scalar {
        switch (operation) {
            case Operation.ADD:
                return a + b;
            case Operation.DIVIDE:
                return a / b;
            case Operation.MULTIPLY:
                return a * b;
            case Operation.SUBTRACT:
                return a - b;
        }
    }

    operateOnVectorAndScalar(
        a: Vector,
        b: Scalar,
        operation: Operation,
        reverse: boolean = false
    ): Vector {
        const operate = (a: Scalar, b: Scalar) => 
            this.operateOnScalars(a, b, operation);

        return a.map((n: Scalar) =>
            reverse ? operate(b, n) : operate(n, b));
    }

    operateOnVectors(
        a: Vector,
        b: Vector,
        operation: Operation
    ): Vector {
        return a.map((n, i) => this.operateOnScalars(n, b[i], operation));
    }

}
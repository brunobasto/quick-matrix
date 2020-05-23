import { Engine } from "./Engine";
import { Matrix, Operation, Vector } from "../types";

export default class EngineV8 implements Engine {
    operateOnMatrices(
        a: Matrix,
        b: Matrix,
        operation: Operation
    ): Matrix {
        return a.map((v: Vector, i: number) => {
            return v.map((n, j) => this.operateOnScalars(n, b[i][j], operation));
        });
    }

    operateOnMatrixAndScalar(
        a: Matrix,
        b: number,
        operation: Operation
    ): Matrix {
        return a.map((v: Vector) => {
            return this.operateOnVectorAndScalar(v, b, operation) as Vector;
        });
    }

    operateOnScalars(
        a: number,
        b: number,
        operation: Operation
    ): number {
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
        b: number,
        operation: Operation
    ): Vector {
        return a.map((n: number) => this.operateOnScalars(n, b, operation));
    }

    operateOnVectors(
        a: Vector,
        b: Vector,
        operation: Operation
    ): Vector {
        return a.map((n, i) => this.operateOnScalars(n, b[i], operation));
    }

}
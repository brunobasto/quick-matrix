import { ArithmeticOperator, ArithmeticOperation } from "./ArithmeticOperator";
import { Matrix, Vector } from "./types";

export default class ArithmeticOperatorV8 implements ArithmeticOperator {
    operateOnMatrices(
        a: Matrix,
        b: Matrix,
        operation: ArithmeticOperation
    ): Matrix {
        return a.map((v: Vector, i: number) => {
            return v.map((n, j) => this.operateOnScalars(n, b[i][j], operation));
        });
    }

    operateOnMatrixAndScalar(
        a: Matrix,
        b: number,
        operation: ArithmeticOperation
    ): Matrix {
        return a.map((v: Vector) => {
            return this.operateOnVectorAndScalar(v, b, operation) as Vector;
        });
    }

    operateOnScalars(
        a: number,
        b: number,
        operation: ArithmeticOperation
    ): number {
        switch (operation) {
            case ArithmeticOperation.ADD:
                return a + b;
            case ArithmeticOperation.DIVIDE:
                return a / b;
            case ArithmeticOperation.MULTIPLY:
                return a * b;
            case ArithmeticOperation.SUBTRACT:
                return a - b;
        }
    }

    operateOnVectorAndScalar(
        a: Vector,
        b: number,
        operation: ArithmeticOperation
    ): Vector {
        return a.map((n: number) => this.operateOnScalars(n, b, operation));
    }

    operateOnVectors(
        a: Vector,
        b: Vector,
        operation: ArithmeticOperation
    ): Vector {
        return a.map((n, i) => this.operateOnScalars(n, b[i], operation));
    }

}
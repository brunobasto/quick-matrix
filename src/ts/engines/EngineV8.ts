import { Engine } from "./Engine";
import { fill } from "../api/fill";
import { Matrix, Operation, Vector, Scalar } from "../types";
import shape from "../api/shape";
import { matrixProduct } from "./utils";

export default class EngineV8 implements Engine {
    operateBinaryMatrices(
        a: Matrix,
        b: Matrix,
        operation: Operation
    ): Matrix {
        if (operation === Operation.PRODUCT) {
            return matrixProduct(a, b);
        }

        return a.map((v: Vector, i: Scalar) => {
            return v.map((n, j) => this.operateBinaryScalars(n, b[i][j], operation));
        });
    }

    operateBinaryMatrixAndScalar(
        a: Matrix,
        b: Scalar,
        operation: Operation,
        reverse: boolean = false
    ): Matrix {
        return a.map((v: Vector) => {
            return this.operateBinaryVectorAndScalar(v, b, operation, reverse) as Vector;
        });
    }

    operateBinaryScalars(
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

        throw new Error('Not implemented');
    }

    operateBinaryVectorAndScalar(
        a: Vector,
        b: Scalar,
        operation: Operation,
        reverse: boolean = false
    ): Vector {
        const operate = (a: Scalar, b: Scalar) =>
            this.operateBinaryScalars(a, b, operation);

        return a.map((n: Scalar) =>
            reverse ? operate(b, n) : operate(n, b));
    }

    operateBinaryVectors(
        a: Vector,
        b: Vector,
        operation: Operation
    ): Vector {
        return a.map((n, i) => this.operateBinaryScalars(n, b[i], operation));
    }

    operateUnaryScalar(
        a: Scalar,
        operation: Operation
    ): Scalar {
        switch (operation) {
            case Operation.EXP:
                return Math.exp(a);
        }

        throw new Error('Not implemented');
    }

    operateUnaryVector(
        a: Vector,
        operation: Operation
    ): Vector {
        return a.map(n => this.operateUnaryScalar(n, operation));
    }

    operateUnaryMatrix(
        a: Matrix,
        operation: Operation
    ): Matrix {
        if (operation === Operation.TRANSPOSE) {
            const [rows, columns] = shape(a);
            const result = fill([columns, rows], 0) as Matrix;

            for (let i = 0; i < columns; i++) {
                for (let j = 0; j < rows; j++) {
                    result[i][j] = a[j][i];
                }
            }

            return result;
        }

        return a.map(v => this.operateUnaryVector(v, operation));
    }

}
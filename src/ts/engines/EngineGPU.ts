import { Engine } from './Engine';
import { GPU } from 'gpu.js';
import { Matrix, Operation, Vector, Scalar } from '../types';
import memoize from 'fast-memoize';
import shape from '../api/shape';

const gpu = new GPU();

/* istanbul ignore next */
const operateBinaryScalarsKernel = gpu.createKernel(
    function (a: number, b: number, operator: number) {
        const operandA = a as number;
        const operandB = b as number;

        if (operator === 0) {
            return operandA + operandB;
        }
        else if (operator === 1) {
            return operandA / operandB;
        }
        else if (operator === 2) {
            return operandA * operandB;
        }

        return operandA - operandB;
    },
    {
        immutable: true,
    }
).setOutput([1]);

const makeMatrixByScalarKernel = memoize((rows, columns) => {
    /* istanbul ignore next */
    return gpu.createKernel(
        function (
            a: number[][],
            b: number,
            operator: number,
            reverse: boolean
        ) {
            const operandA = reverse ? b : a[this.thread.y as number][this.thread.x as number];
            const operandB = reverse ? a[this.thread.y as number][this.thread.x as number] : b;

            if (operator === 0) {
                return operandA + operandB;
            }
            else if (operator === 1) {
                return operandA / operandB;
            }
            else if (operator === 2) {
                return operandA * operandB;
            }

            return operandA - operandB;
        },
        {
            immutable: true,
        }
    ).setOutput([columns, rows]);
});

const makeMatricesKernel = memoize((rows, columns) => {
    /* istanbul ignore next */
    return gpu.createKernel(
        function (a: number[][], b: number[][], operator: number) {
            const operandA = a[this.thread.y as number][this.thread.x as number];
            const operandB = b[this.thread.y as number][this.thread.x as number];

            if (operator === 0) {
                return operandA + operandB;
            }
            else if (operator === 1) {
                return operandA / operandB;
            }
            else if (operator === 2) {
                return operandA * operandB;
            }

            return operandA - operandB;
        },
        {
            immutable: true,
        }
    ).setOutput([columns, rows]);
});

const makeVectorByScalarKernel = memoize(rows => {
    /* istanbul ignore next */
    return gpu.createKernel(
        function (
            a: number[],
            b: number,
            operator: number,
            reverse: boolean
        ) {
            const operandA = reverse ? b as number : a[this.thread.x] as number;
            const operandB = reverse ? a[this.thread.x] as number : b as number;

            if (operator === 0) {
                return operandA + operandB;
            }
            else if (operator === 1) {
                return operandA / operandB;
            }
            else if (operator === 2) {
                return operandA * operandB;
            }

            return operandA - operandB;
        },
        {
            immutable: true,
        }
    ).setOutput([rows]);
});

const makeVectorsKernel = memoize((rows) => {
    /* istanbul ignore next */
    return gpu.createKernel(
        function (a: number[], b: number[], operator: number) {
            const operandA = a[this.thread.x];
            const operandB = b[this.thread.x];

            if (operator === 0) {
                return operandA + operandB;
            }
            else if (operator === 1) {
                return operandA / operandB;
            }
            else if (operator === 2) {
                return operandA * operandB;
            }

            return operandA - operandB;
        },
        {
            immutable: true,
        }
    ).setOutput([rows]);
});

export default class EngineGPU implements Engine {
    operateBinaryMatrices(
        a: Matrix,
        b: Matrix,
        operation: Operation
    ): Matrix {
        const [rows, columns] = shape(a);
        const operate = makeMatricesKernel(rows, columns);

        return operate(a as any, b as any, operation) as any;
    }

    operateBinaryMatrixAndScalar(
        a: Matrix,
        b: Scalar,
        operation: Operation,
        reverse: boolean = false
    ): Matrix {
        const [rows, columns] = shape(a);
        const operate = makeMatrixByScalarKernel(rows, columns);

        return operate(a as any, b, operation, reverse) as any;
    }

    operateBinaryScalars(
        a: Scalar,
        b: Scalar,
        operation: Operation
    ): Scalar {
        return operateBinaryScalarsKernel(a, b, operation)[0];
    }

    operateBinaryVectorAndScalar(
        a: Vector,
        b: Scalar,
        operation: Operation,
        reverse: boolean = false
    ): Vector {
        const operate = makeVectorByScalarKernel(a.length);

        return operate(a, b, operation, reverse) as any;
    }

    operateBinaryVectors(
        a: Vector,
        b: Vector,
        operation: Operation
    ): Vector {
        const operate = makeVectorsKernel(a.length);

        return operate(a, b, operation) as any;
    }

    operateUnaryScalar(
        a: Scalar,
        operation: Operation
    ): Scalar {
        throw new Error('Not implemented');
    }

    operateUnaryVector(
        a: Vector,
        operation: Operation
    ): Vector {
        throw new Error('Not implemented');
    }

    operateUnaryMatrix(
        a: Matrix,
        operation: Operation
    ): Matrix {
        throw new Error('Not implemented');
    }
}
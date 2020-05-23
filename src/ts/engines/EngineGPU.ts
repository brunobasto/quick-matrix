import { Engine } from './Engine';
import { GPU } from 'gpu.js';
import { Matrix, Operation, Vector } from '../types';
import memoize from 'fast-memoize';
import shape from '../api/shape';

const gpu = new GPU();

/* istanbul ignore next */
const operateOnScalarsKernel = gpu.createKernel(
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
        function (a: number[][], b: number, operator: number) {
            const operandA = a[this.thread.y as number][this.thread.x as number];
            const operandB = b;

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
        function (a: number[], b: number, operator: number) {
            const operandA = a[this.thread.x] as number;
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
    operateOnMatrices(
        a: Matrix,
        b: Matrix,
        operation: Operation
    ): Matrix {
        const [rows, columns] = shape(a);
        const operate = makeMatricesKernel(rows, columns);

        return operate(a as any, b as any, operation) as any;
    }

    operateOnMatrixAndScalar(
        a: Matrix,
        b: number,
        operation: Operation
    ): Matrix {
        const [rows, columns] = shape(a);
        const operate = makeMatrixByScalarKernel(rows, columns);

        return operate(a as any, b, operation) as any;
    }

    operateOnScalars(
        a: number,
        b: number,
        operation: Operation
    ): number {
        return operateOnScalarsKernel(a, b, operation)[0];
    }

    operateOnVectorAndScalar(
        a: Vector,
        b: number,
        operation: Operation
    ): Vector {
        const operate = makeVectorByScalarKernel(a.length);

        return operate(a, b, operation) as any;
    }

    operateOnVectors(
        a: Vector,
        b: Vector,
        operation: Operation
    ): Vector {
        const operate = makeVectorsKernel(a.length);

        return operate(a, b, operation) as any;
    }
}
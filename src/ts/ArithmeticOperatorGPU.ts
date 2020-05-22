import { ArithmeticOperator, ArithmeticOperation } from "./ArithmeticOperator";
import { GPU } from 'gpu.js';
import { Matrix, Vector } from "./types";
import memoize from "fast-memoize";
import shape from "./shape";

const gpu = new GPU();

const toArray = (typedArray: any) => {
    const result = Array(typedArray.length);

    for (let i = 0; i < typedArray.length; i++) {
        result[i] = typedArray[i];
    }

    return result;
}

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

export default class ArithmeticOperatorGPU implements ArithmeticOperator {
    operateOnMatrices(
        a: Matrix,
        b: Matrix,
        operation: ArithmeticOperation
    ): Matrix {
        const [rows, columns] = shape(a);
        const operate = makeMatricesKernel(rows, columns);
        const matrix = operate(a, b, operation) as Vector;

        return matrix.map(vector => toArray(vector));
    }

    operateOnMatrixAndScalar(
        a: Matrix,
        b: number,
        operation: ArithmeticOperation
    ): Matrix {
        const [rows, columns] = shape(a);
        const operate = makeMatrixByScalarKernel(rows, columns);
        const matrix = operate(a, b, operation) as Vector;

        return matrix.map(vector => toArray(vector));
    }

    operateOnScalars(
        a: number,
        b: number,
        operation: ArithmeticOperation
    ): number {
        return operateOnScalarsKernel(a, b, operation)[0];
    }

    operateOnVectorAndScalar(
        a: Vector,
        b: number,
        operation: ArithmeticOperation
    ): Vector {
        const operate = makeVectorByScalarKernel(a.length);
        const vector = operate(a, b, operation) as Vector;

        return toArray(vector);
    }

    operateOnVectors(
        a: Vector,
        b: Vector,
        operation: ArithmeticOperation
    ): Vector {
        const operate = makeVectorsKernel(a.length);

        return toArray(operate(a, b, operation) as Vector);
    }
}
import { ArithmeticOperator, ArithmeticOperation } from "./ArithmeticOperator";
import { ccallArrays } from './wasm-arrays';
import { Matrix, Vector } from "./types";
import * as Module from '../../wasm/native';
import shape from "./shape";

export default class ArithmeticOperatorWASM implements ArithmeticOperator {
    operateOnMatrices(
        a: Matrix,
        b: Matrix,
        operation: ArithmeticOperation
    ): Matrix {
        const operationName = this.getOperationName(operation);

        return ccallArrays(
            Module,
            `${operationName}Matrices`,
            'matrix',
            ['matrix', 'matrix'],
            [a, b],
            {
                heapIn: 'HEAPF32',
                heapOut: 'HEAPF32',
                returnShape: shape(a)
            }
        );
    }

    operateOnMatrixAndScalar(
        a: Matrix,
        b: number,
        operation: ArithmeticOperation
    ): Matrix {
        const operationName = this.getOperationName(operation);

        return ccallArrays(
            Module,
            `${operationName}MatrixByScalar`,
            'matrix',
            ['matrix', 'number'],
            [a, b],
            {
                heapIn: 'HEAPF32',
                heapOut: 'HEAPF32',
                returnShape: shape(a)
            }
        );
    }

    operateOnScalars(
        a: number,
        b: number,
        operation: ArithmeticOperation
    ): number {
        const operationName = this.getOperationName(operation);

        return ccallArrays(
            Module,
            `${operationName}Scalars`,
            'number',
            ['number', 'number'],
            [a, b],
            {
                heapIn: 'HEAPF32',
                heapOut: 'HEAPF32',
                returnShape: shape(a)
            }
        );
    }

    operateOnVectorAndScalar(
        a: Vector,
        b: number,
        operation: ArithmeticOperation
    ): Vector {
        const operationName = this.getOperationName(operation);

        return ccallArrays(
            Module,
            `${operationName}VectorByScalar`,
            'vector',
            ['vector', 'number'],
            [a, b],
            {
                heapIn: 'HEAPF32',
                heapOut: 'HEAPF32',
                returnShape: shape(a)
            }
        );
    }

    operateOnVectors(
        a: Vector,
        b: Vector,
        operation: ArithmeticOperation
    ): Vector {
        const operationName = this.getOperationName(operation);

        return ccallArrays(
            Module,
            `${operationName}Vectors`,
            'vector',
            ['vector', 'vector'],
            [a, b],
            {
                heapIn: 'HEAPF32',
                heapOut: 'HEAPF32',
                returnShape: shape(a)
            }
        );
    }

    private getOperationName(operation: ArithmeticOperation) {
        switch (operation) {
            case ArithmeticOperation.ADD:
                return 'add';
            case ArithmeticOperation.DIVIDE:
                return 'divide';
            case ArithmeticOperation.MULTIPLY:
                return 'multiply';
            case ArithmeticOperation.SUBTRACT:
                return 'subtract';
        }

        throw new Error(`Unimplementted arithmetic operation ${operation}`);
    }
    
}
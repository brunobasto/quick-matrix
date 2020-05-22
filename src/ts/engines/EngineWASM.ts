import { Engine, ArithmeticOperation } from "./Engine";
import { ccallArrays } from '../wasm';
import { Matrix, Vector } from "../types";
import * as Module from '../../../wasm/native';
import shape from "../shape";

export default class EngineWASM implements Engine {
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
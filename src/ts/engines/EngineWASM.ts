import { Engine, ArithmeticOperation } from './Engine';
import { ccallArrays } from '../wasm';
import { Matrix, Vector } from '../types';
import * as Module from '../../../wasm/native';
import shape from '../api/shape';

export default class EngineWASM implements Engine {
    operateOnMatrices(
        a: Matrix,
        b: Matrix,
        operation: ArithmeticOperation
    ): Matrix {
        return ccallArrays(
            Module,
            `operateOnMatrices`,
            'matrix',
            ['matrix', 'matrix'],
            [a, b, operation],
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
        return ccallArrays(
            Module,
            `operateOnMatrixAndScalar`,
            'matrix',
            ['matrix', 'number'],
            [a, b, operation],
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
        return ccallArrays(
            Module,
            `operateOnScalars`,
            'number',
            ['number', 'number'],
            [a, b, operation],
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
        return ccallArrays(
            Module,
            `operateOnVectorAndScalar`,
            'vector',
            ['vector', 'number'],
            [a, b, operation],
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
        return ccallArrays(
            Module,
            `operateOnVectors`,
            'vector',
            ['vector', 'vector'],
            [a, b, operation],
            {
                returnShape: shape(a)
            }
        );
    }
}
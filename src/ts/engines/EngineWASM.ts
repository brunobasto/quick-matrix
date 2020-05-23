import { ccallArrays } from '../wasm';
import { Engine } from './Engine';
import { Matrix, Operation, Vector, Scalar } from '../types';
import * as Module from '../../../wasm/native';
import shape from '../api/shape';

export default class EngineWASM implements Engine {
    operateOnMatrices(
        a: Matrix,
        b: Matrix,
        operation: Operation
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
        b: Scalar,
        operation: Operation,
        reverse: boolean = false
    ): Matrix {
        return ccallArrays(
            Module,
            `operateOnMatrixAndScalar`,
            'matrix',
            ['matrix', 'number', 'boolean'],
            [a, b, operation, reverse],
            {
                returnShape: shape(a)
            }
        );
    }

    operateOnScalars(
        a: Scalar,
        b: Scalar,
        operation: Operation
    ): Scalar {
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
        b: Scalar,
        operation: Operation,
        reverse: boolean = false
    ): Vector {
        return ccallArrays(
            Module,
            `operateOnVectorAndScalar`,
            'vector',
            ['vector', 'number', 'boolean'],
            [a, b, operation, reverse],
            {
                returnShape: shape(a)
            }
        );
    }

    operateOnVectors(
        a: Vector,
        b: Vector,
        operation: Operation
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
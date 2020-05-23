import { ccallArrays } from '../wasm';
import { Engine } from './Engine';
import { Matrix, Operation, Vector, Scalar } from '../types';
import * as Module from '../../../wasm/native';
import shape from '../api/shape';

export default class EngineWASM implements Engine {
    operateBinaryMatrices(
        a: Matrix,
        b: Matrix,
        operation: Operation
    ): Matrix {
        return ccallArrays(
            Module,
            `operateBinaryMatrices`,
            'matrix',
            ['matrix', 'matrix'],
            [a, b, operation],
            {
                returnShape: shape(a)
            }
        );
    }

    operateBinaryMatrixAndScalar(
        a: Matrix,
        b: Scalar,
        operation: Operation,
        reverse: boolean = false
    ): Matrix {
        return ccallArrays(
            Module,
            `operateBinaryMatrixAndScalar`,
            'matrix',
            ['matrix', 'number', 'boolean'],
            [a, b, operation, reverse],
            {
                returnShape: shape(a)
            }
        );
    }

    operateBinaryScalars(
        a: Scalar,
        b: Scalar,
        operation: Operation
    ): Scalar {
        return ccallArrays(
            Module,
            `operateBinaryScalars`,
            'number',
            ['number', 'number'],
            [a, b, operation],
            {
                returnShape: shape(a)
            }
        );
    }

    operateBinaryVectorAndScalar(
        a: Vector,
        b: Scalar,
        operation: Operation,
        reverse: boolean = false
    ): Vector {
        return ccallArrays(
            Module,
            `operateBinaryVectorAndScalar`,
            'vector',
            ['vector', 'number', 'boolean'],
            [a, b, operation, reverse],
            {
                returnShape: shape(a)
            }
        );
    }

    operateBinaryVectors(
        a: Vector,
        b: Vector,
        operation: Operation
    ): Vector {
        return ccallArrays(
            Module,
            `operateBinaryVectors`,
            'vector',
            ['vector', 'vector'],
            [a, b, operation],
            {
                returnShape: shape(a)
            }
        );
    }

    operateUnaryScalar(
        a: Scalar,
        operation: Operation
    ): Scalar {
        return ccallArrays(
            Module,
            `operateUnaryScalar`,
            'number',
            ['number', 'number'],
            [a, operation],
            {
                returnShape: shape(a)
            }
        );
    }

    operateUnaryVector(
        a: Vector,
        operation: Operation
    ): Vector {
        return ccallArrays(
            Module,
            `operateUnaryVector`,
            'vector',
            ['vector', 'number'],
            [a, operation],
            {
                returnShape: shape(a)
            }
        );
    }

    operateUnaryMatrix(
        a: Matrix,
        operation: Operation
    ): Matrix {
        let returnShape = shape(a);

        if (operation === Operation.TRANSPOSE) {
            returnShape = returnShape.reverse();
        }

        return ccallArrays(
            Module,
            `operateUnaryMatrix`,
            'matrix',
            ['matrix', 'number'],
            [a, operation],
            {
                returnShape
            }
        );
    }
}
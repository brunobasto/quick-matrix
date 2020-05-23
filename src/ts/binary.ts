import { getBestEngine } from './engines/heuristics';
import { VectorOrMatrix, Matrix, Operation, Vector, Value, Scalar } from './types';
import broadcast from './broadcast';
import shape from './api/shape';

const isAssociative = (operation: Operation) => {
    return (
        operation === Operation.ADD ||
        operation === Operation.MULTIPLY
    );
}

export default (
    a: Value,
    b: Value,
    operation: Operation
): Value => {
    const [shapeA, shapeB] = [shape(a), shape(b)];
    const engine = getBestEngine(shapeA, shapeB);

    if (shapeA.length === 0 && shapeB.length === 0) {
        // simple scalar multiplication
        return engine.operateBinaryScalars(a as Scalar, b as Scalar, operation);
    }

    if (shapeA.length === 0) {
        // a is a scalar and b is not
        return operateElementWise(
            b as VectorOrMatrix,
            a as Scalar,
            operation,
            !isAssociative(operation)
        );
    }

    if (shapeB.length === 0) {
        // b is a scalar and a is not
        return operateElementWise(
            a as VectorOrMatrix,
            b as Scalar,
            operation
        );
    }

    return operateBinaryArrays(
        a as VectorOrMatrix,
        b as VectorOrMatrix,
        operation
    );
}

const operateBinaryArrays = (
    a: VectorOrMatrix,
    b: VectorOrMatrix,
    operation: Operation
): VectorOrMatrix => {
    const [shapeA, shapeB] = [shape(a), shape(b)];
    const engine = getBestEngine(shapeA, shapeB);

    if (shapeA.length === shapeB.length && shapeA.length === 1) {
        const [rowsA] = shapeA;
        const [rowsB] = shapeB;

        // if vectors are incompatible, throw error
        if (rowsA !== rowsB) {
            throw new Error(
                `Cannot operate on vectors of dimensions: ${shapeA} and ${shapeB}`);
        }

        return engine.operateBinaryVectors(
            a as Vector,
            b as Vector,
            operation
        );
    }

    const [operandA, operandB] = broadcast(a, b);

    return engine.operateBinaryMatrices(
        operandA as Matrix,
        operandB as Matrix,
        operation
    );
}

const operateElementWise = (
    a: VectorOrMatrix,
    b: Scalar,
    operation: Operation,
    reverse: boolean = false
): VectorOrMatrix => {
    const [shapeA, shapeB] = [shape(a), shape(b)];
    const engine = getBestEngine(shapeA, shapeB);

    if (shapeA.length > 1) {
        return engine.operateBinaryMatrixAndScalar(a as Matrix, b, operation, reverse);
    }

    return engine.operateBinaryVectorAndScalar(a as Vector, b, operation, reverse);
}

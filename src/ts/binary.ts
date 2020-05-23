import { getBestEngine } from './engines/heuristics';
import { VectorOrMatrix, Matrix, Operation, Vector, Value } from './types';
import broadcast from './broadcast';
import shape from './api/shape';

export default (
    a: Value,
    b: Value,
    operation: Operation
): Value => {
    const [shapeA, shapeB] = [shape(a), shape(b)];
    const engine = getBestEngine(shapeA, shapeB);

    if (shapeA.length === 0 && shapeB.length === 0) {
        // simple number multiplication
        return engine.operateOnScalars(a as number, b as number, operation);
    }

    if (shapeA.length === 0) {
        // a is a scalar and b is not
        return operateElementWise(
            b as VectorOrMatrix,
            a as number,
            operation
        );
    }

    if (shapeB.length === 0) {
        // b is a scalar and a is not
        return operateElementWise(
            a as VectorOrMatrix,
            b as number,
            operation
        );
    }

    return operateOnArrays(
        a as VectorOrMatrix,
        b as VectorOrMatrix,
        operation
    );
}

const operateOnArrays = (
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

        return engine.operateOnVectors(
            a as Vector,
            b as Vector,
            operation
        );
    }

    const [operandA, operandB] = broadcast(a, b);

    return engine.operateOnMatrices(
        operandA as Matrix,
        operandB as Matrix,
        operation
    );
}

const operateElementWise = (
    a: VectorOrMatrix,
    b: number,
    operation: Operation
): VectorOrMatrix => {
    const [shapeA, shapeB] = [shape(a), shape(b)];
    const engine = getBestEngine(shapeA, shapeB);

    if (shapeA.length > 1) {
        const matrix = a as Matrix;

        return engine.operateOnMatrixAndScalar(matrix, b, operation);
    }

    return engine.operateOnVectorAndScalar(a as Vector, b, operation);
}

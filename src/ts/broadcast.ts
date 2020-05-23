import { Engine, ArithmeticOperation } from './engines/Engine';
import { VectorOrMatrix, Matrix, Vector, Value } from './types';
import EngineV8 from './engines/EngineV8';
import EngineWASM from './engines/EngineWASM';
import shape from './api/shape';
import memoize from 'fast-memoize';

const getBestEngine = memoize(
    (cost: number): Engine => {
        if (cost > 1) {
            return new EngineWASM();
        }

        return new EngineV8();
    }
);

export default (
    a: Value,
    b: Value,
    operation: ArithmeticOperation
): Value => {
    const [shapeA, shapeB] = [shape(a), shape(b)];

    if (shapeA.length === 0 && shapeB.length === 0) {
        // simple number multiplication
        const engine = getBestEngine(1);

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
    operation: ArithmeticOperation
): VectorOrMatrix => {
    const [shapeA, shapeB] = [shape(a), shape(b)];
    let [rowsA, columnsA] = shapeA;
    let [rowsB, columnsB] = shapeB;

    let operandA = a as Matrix;
    let operandB = b as Matrix;

    if (shapeA.length === shapeB.length && shapeA.length === 1) {
        // we are operating on two vectors
        if (rowsA !== rowsB) {
            throw new Error(`Cannot operate on vectors with incompatible dimensions: ${shape(a)} * ${shape(b)}`);
        }

        const engine = getBestEngine(rowsA);

        return engine.operateOnVectors(a as Vector, b as Vector, operation);
    }

    if (shapeA.length === 1 && rowsA === columnsB) {
        // a is a vector and b is a matrix
        // broadcast a to b
        operandA = (b as Matrix).map(() => a as Vector)
        columnsA = rowsA;
        rowsA = rowsB;
    }
    else if (shapeB.length === 1 && rowsB === columnsA) {
        // b is a vector and a is a matrix
        // broadcast b to a
        operandB = (a as Matrix).map(() => b as Vector)
        columnsB = rowsB;
        rowsB = rowsA;
    }

    if (columnsA === columnsB) {
        if (rowsA === 1 && rowsB > 1) {
            // broadcast rowsA to rowsB
            operandA = (b as Matrix).map(() => a[0] as Vector)
            rowsA = rowsB;
        }
        else if (rowsB === 1 && rowsA > 1) {
            // broadcast rowsB to rowsA
            operandB = (a as Matrix).map(() => b[0] as Vector)
            rowsB = rowsA;
        }
    }

    if (rowsA === rowsB) {
        if (columnsA === 1 && columnsB > 1) {
            // broadcast columnsA to columnsB
            operandA = (a as Matrix).map((row, i) => (b as Matrix)[i].map(() => row[0]))
            columnsA = columnsB;
        }
        else if (columnsB === 1 && columnsA > 1) {
            // broadcast columnsB to columnsA
            operandB = (b as Matrix).map((row, i) => (a as Matrix)[i].map(() => row[0]))
            columnsB = columnsA;
        }
    }

    if (rowsA !== rowsB || columnsA !== columnsB) {
        throw new Error(`Cannot broadcast arrays with incompatible dimensions: ${shape(a)} * ${shape(b)}`);
    }

    const engine = getBestEngine(rowsA * columnsA);

    return engine.operateOnMatrices(operandA, operandB, operation);
}

const operateElementWise = (
    a: VectorOrMatrix,
    b: number,
    operation: ArithmeticOperation
): VectorOrMatrix => {
    const [rows, columns] = shape(a);

    if (columns > 1) {
        const matrix = a as Matrix;
        const engine = getBestEngine(rows * columns);

        return engine.operateOnMatrixAndScalar(matrix, b, operation);
    }

    const engine = getBestEngine(rows);

    return engine.operateOnVectorAndScalar(a as Vector, b, operation);
}

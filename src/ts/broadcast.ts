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
    const [rowsA, columnsA] = shape(a);
    const [rowsB, columnsB] = shape(b);

    if (rowsA === 0 && rowsB === 0 && columnsA == 0 && columnsB === 0) {
        // simple number multiplication
        const engine = getBestEngine(1);

        return engine.operateOnScalars(a as number, b as number, operation);
    }

    if (rowsA == 0 && columnsA == 0) {
        // a is either a scalar or an empty array
        if (Array.isArray(a)) {
            throw new Error('Cannot operate on empty array');
        }

        // a is a scalar
        return operateElementWise(
            b as VectorOrMatrix,
            a as number,
            operation
        );
    }

    if (rowsB == 0 && columnsB == 0) {
        // b is either a scalar or an empty array
        if (Array.isArray(b)) {
            throw new Error('Cannot operate on empty array');
        }

        // b is a scalar
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
    let [rowsA, columnsA] = shape(a);
    let [rowsB, columnsB] = shape(b);

    let operandA = a as Matrix;
    let operandB = b as Matrix;

    if (columnsA === columnsB && columnsA === 0) {
        if (rowsA !== rowsB) {
            throw new Error(`Cannot operate on vectors with incompatible dimensions: ${shape(a)} * ${shape(b)}`);
        }

        const engine = getBestEngine(rowsA);

        return engine.operateOnVectors(a as Vector, b as Vector, operation);
    }

    if (columnsA === 0 && rowsA === columnsB) {
        // a is a vector
        // broadcast a to b
        operandA = (b as Matrix).map(() => a as Vector)
        columnsA = rowsA;
        rowsA = rowsB;
    }
    else if (columnsB === 0 && rowsB === columnsA) {
        // b is a vector
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

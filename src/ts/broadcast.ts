import { Matrix, Vector, Value } from './types';
import shape from './api/shape';

export default (
    a: Value,
    b: Value
): [Value, Value] => {
    const [shapeA, shapeB] = [shape(a), shape(b)];

    let [rowsA, columnsA] = shapeA;
    let [rowsB, columnsB] = shapeB;

    // if they have the same shape, no need for broadcasting
    if (rowsA === rowsB && columnsA === columnsB) {
        return [a, b];
    }

    let operandA = a as Matrix;
    let operandB = b as Matrix;

    // a is a vector and b is a matrix
    if (shapeA.length === 1) {
        // broadcast a to columns of b
        if (rowsA === columnsB) {
            operandA = (b as Matrix).map(() => a as Vector);
            
            return [operandA, operandB];
        }
        // broadcast a to rows of b
        else if (rowsA === rowsB) {
            operandA = (b as Matrix).map(
                (column, i) => column.map(() => a[i])
            );

            return [operandA, operandB];
        }

        throw new Error(`Cannot broadcast ${shapeA} and ${shapeB}`);
    }
    // b is a vector and a is a matrix
    else if (shapeB.length === 1) {
        // broadcast b to columns of a
        if (rowsB === columnsA) {
            operandB = (a as Matrix).map(() => b as Vector);
            
            return [operandA, operandB];
        }
        // broadcast b to rows of a
        else if (rowsB === rowsA) {
            operandB = (a as Matrix).map(
                (column, i) => column.map(() => b[i])
            );

            return [operandA, operandB];
        }

        throw new Error(`Cannot broadcast ${shapeA} and ${shapeB}`);
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
        throw new Error(`Cannot broadcast: ${shapeA} and ${shapeB}`);
    }

    return [operandA, operandB];
}
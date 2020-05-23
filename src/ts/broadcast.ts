import { Matrix, Vector, Value } from './types';
import shape from './api/shape';

export default (
    a: Value,
    b: Value
): [Value, Value] => {
    const [shapeA, shapeB] = [shape(a), shape(b)];

    if (shapeA.length === 0 || shapeB.length === 0) {
        // operations with a scalar does not need broadcatsing
        return [a, b]
    }

    let [rowsA, columnsA] = shapeA;
    let [rowsB, columnsB] = shapeB;

    if (shapeA.length === shapeB.length && shapeA.length === 1) {
        // if we are operating on compatible vectors, no need for broadcasting
        return [a, b];
    }

    let operandA = a as Matrix;
    let operandB = b as Matrix;

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
        throw new Error(`Cannot broadcast: ${shapeA} * ${shapeB}`);
    }

    return [operandA, operandB];
}
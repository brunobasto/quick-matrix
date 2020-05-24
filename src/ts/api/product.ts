import { Operation, Matrix } from '../types';
import shape from './shape';
import { getBestEngine } from '../engines/heuristics';

export default (a: Matrix, b: Matrix): Matrix => {
    const [shapeA, shapeB] = [shape(a), shape(b)];

    if (shapeA.length !== 2 || shapeB.length !== 2) {
        throw new Error(
            `Matrix multiplication is only supported on matrices.`);
    }

    if (shapeA[1] !== shapeB[0]) {
        throw new Error(
            `Matrices of dimensions (${shapeA} x ${shapeB}) do not satisfy ` +
            `matrix multiplication prerequisites.`);
    }

    const engine = getBestEngine(shapeA, shapeB);

    return engine.operateBinaryMatrices(a, b, Operation.PRODUCT);
}
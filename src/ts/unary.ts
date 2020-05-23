import { Value, Operation, Scalar, Matrix, Vector } from "./types";
import { getBestEngine } from "./engines/heuristics";
import shape from "./api/shape";

export default (a: Value, operation: Operation) => {
    const shapeA = shape(a);
    const engine = getBestEngine(shapeA);

    if (shapeA.length === 1) {
        return engine.operateUnaryVector(a as Vector, operation);
    }
    else if (shapeA.length === 2) {
        return engine.operateUnaryMatrix(a as Matrix, operation);
    }

    return engine.operateUnaryScalar(a as Scalar, operation);
}
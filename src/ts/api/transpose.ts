import { Operation, Matrix } from "../types";
import unary from "../unary";

export default (a: Matrix): Matrix => {
    return unary(a, Operation.TRANSPOSE) as Matrix;
} 
import { Operation, Matrix } from "../types";
import unary from "../unary";

export default (a: Matrix) => {
    return unary(a, Operation.TRANSPOSE);
} 
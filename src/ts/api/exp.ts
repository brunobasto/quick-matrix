import { Value, Operation } from "../types";
import unary from "../unary";

export default (a: Value) => {
    return unary(a, Operation.EXP);
}
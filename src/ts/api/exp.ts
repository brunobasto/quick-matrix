import { Value, Operation } from "../types";
import unary from "../unary";

export default (a: Value): Value => {
    return unary(a, Operation.EXP);
}
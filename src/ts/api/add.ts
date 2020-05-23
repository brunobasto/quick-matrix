import { Operation, Value } from '../types';
import binary from '../binary';

export default (a: Value, b: Value): Value => {
    return binary(
        a,
        b,
        Operation.ADD
    );
}
import { Operation } from '../engines/Engine';
import { Value } from '../types';
import binary from '../binary';

export default (a: Value, b: Value): Value => {
    return binary(
        a,
        b,
        Operation.MULTIPLY
    );
}
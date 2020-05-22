import { ArithmeticOperation } from '../engines/Engine';
import { Value } from '../types';
import broadcast from '../broadcast';

export default (a: Value, b: Value): Value => {
    return broadcast(
        a,
        b,
        ArithmeticOperation.ADD
    );
}
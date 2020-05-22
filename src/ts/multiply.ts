import { ArithmeticOperation } from './Engine';
import { Value } from './types';
import arithmetic from './arithmetic';

export default (a: Value, b: Value): Value => {
    return arithmetic(
        a,
        b,
        ArithmeticOperation.MULTIPLY
    );
}
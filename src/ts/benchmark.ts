import { ArithmeticOperation } from './ArithmeticOperator';
import ArithmeticOperatorGPU from './ArithmeticOperatorGPU';
import ArithmeticOperatorV8 from './ArithmeticOperatorV8';
import ArithmeticOperatorWASM from './ArithmeticOperatorWASM';
import countdown from 'countdown';

const benchmark = (
    name: string,
    fn: Function,
    iterations: number = 10e1
) => {
    const start = new Date();

    for (let i = 0; i < iterations; i++) {
        fn();
    }

    const duration = countdown(
        start,
        null,
        countdown.SECONDS | countdown.MILLISECONDS
    ).toString();

    console.log(`${name}: ${duration}`);
}

(() => {
    const { MULTIPLY } = ArithmeticOperation;
    const scalar = 5;
    const vector = Array(10e5).fill(3);

    const gpu = new ArithmeticOperatorGPU();
    
    benchmark('gpu', () => gpu.operateOnVectorAndScalar(vector, scalar, MULTIPLY));

    const wasm = new ArithmeticOperatorWASM();

    benchmark('wasm', () => wasm.operateOnVectorAndScalar(vector, scalar, MULTIPLY));

    const v8 = new ArithmeticOperatorV8();

    benchmark('v8', () => v8.operateOnVectorAndScalar(vector, scalar, MULTIPLY));
})();
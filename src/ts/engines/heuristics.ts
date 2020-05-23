import { Engine } from './Engine';
import { Shape } from '../types';
import EngineV8 from './EngineV8';
import EngineWASM from './EngineWASM';
import memoize from 'fast-memoize';

const v8 = new EngineV8();
const wasm = new EngineWASM();

const countElements = (shape: Shape) => {
    let elements = 0;

    for (const axis of shape) {
        elements += axis;
    }

    return elements;
}

export const getBestEngine = memoize(
    (shapeA: Shape, shapeB: Shape): Engine => {
        const cost = countElements(shapeA) + countElements(shapeB);

        if (cost > 100) {
            return wasm;
        }

        return v8;
    }
);
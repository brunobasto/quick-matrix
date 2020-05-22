import { Value, Shape } from '../types';

export default (a: Value): Shape => {
    if (Array.isArray(a) || a instanceof Float32Array) {
        if (a.length === 0) {
            return [0, 0];
        }

        if (Array.isArray(a[0]) || a[0] instanceof Float32Array) {
            return [a.length, a[0].length];
        }

        return [a.length, 0];
    }

    return [0, 0];
}
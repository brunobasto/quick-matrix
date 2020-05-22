import { Value } from "./types";

export const from = (value: any): Value => {
    if (value instanceof Float32Array) {
        return value;
    }

    if (Array.isArray(value)) {
        if (value.length === 0) {
            return value;
        }

        if (value[0] instanceof Float32Array) {
            return value;
        }

        if (Array.isArray(value[0])) {
           return value.map(vector => new Float32Array(vector));
        }

        return new Float32Array(value);
    }
    
    return value as number;
}
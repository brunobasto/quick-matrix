import { Value, Shape } from "./types";

export default (a: Value): Shape => {
    if (Array.isArray(a)) {
        if (a.length === 0) {
            return [0, 0];
        }

        if (Array.isArray(a[0])) {
            return [a.length, a[0].length];
        }

        return [a.length, 0];
    }

    return [0, 0];
}
import { Shape, Vector, Matrix } from './types'
import shape from './shape'

const garbage: any = [];

const allocateMatrix = (
    Module: EmscriptenModule,
    matrix: Matrix,
) => {
    const [rows,] = shape(matrix);
    const pointers = new Uint32Array(rows);

    for (let i = 0; i < rows; i++) {
        pointers[i] = allocateVector(
            Module,
            matrix[i],
        );
    }

    // Allocate bytes needed for the array of pointers
    const pointerPtr = Module._malloc(pointers.length * pointers.BYTES_PER_ELEMENT);

    garbage.push(pointerPtr);

    // Copy array of pointers to Emscripten heap   
    Module.HEAPU32.set(pointers, pointerPtr >> 2);

    return pointerPtr;
}

const allocateVector = (
    Module: EmscriptenModule,
    vector: Vector,
) => {
    const pointer = Module._malloc(vector.length * vector.BYTES_PER_ELEMENT);

    garbage.push(pointer);

    Module.HEAPF32.set(vector, pointer >> 2);

    return pointer;
}

const prepareVectorArgument = (
    Module: EmscriptenModule,
    vector: Vector,
    parameters: any,
    parameterTypes: any,
) => {
    const pointer = allocateVector(Module, vector);

    parameters.push(pointer);
    parameters.push(vector.length);
    parameterTypes.push('number');
    parameterTypes.push('number');
}

const prepareMatrixArgument = (
    Module: EmscriptenModule,
    matrix: Matrix,
    parameters: any,
    parameterTypes: any,
) => {
    const [rows, columns] = shape(matrix);
    const pointer = allocateMatrix(Module, matrix);

    parameters.push(pointer);
    parameterTypes.push('number');

    parameters.push(rows);
    parameterTypes.push('number');

    parameters.push(columns);
    parameterTypes.push('number');
}

const prepareVectorReturnValue = (
    Module: EmscriptenModule,
    returnValue: number,
    returnShape: Shape,
    shouldFree: boolean = false
): Vector => {
    const [rows,] = returnShape;
    const heap = Module.HEAPF32;
    const offset = returnValue / Float32Array.BYTES_PER_ELEMENT;
    const vector = heap.slice(offset, offset + rows);

    if (shouldFree) {
        Module._free(returnValue);
    }

    return vector;
}

const prepareMatrixReturnValue = (
    Module: EmscriptenModule,
    returnValue: number,
    returnShape: Shape,
): Matrix => {
    const [rows, columns] = returnShape;
    const heap = Module.HEAPU32
    const offset = returnValue / heap.BYTES_PER_ELEMENT;
    const matrix: Matrix = []

    for (let i = 0; i < rows; i++) {
        matrix[i] = prepareVectorReturnValue(
            Module,
            heap[offset + i],
            [columns, 0],
            true
        );
    }

    Module._free(returnValue);

    return matrix;
}

export const ccallArrays = (
    Module,
    func,
    returnType,
    paramTypes,
    params,
    {
        returnShape = [0, 0] as Shape,
    } = {}) => {
    let returnValue;
    let error;
    paramTypes = paramTypes || []
    const returnTypeParam = returnType == 'vector' ? 'number' : returnType
    const parameters: any = []
    const parameterTypes: any = []

    try {
        if (params) {
            for (let p = 0; p < params.length; p++) {
                if (paramTypes[p] === 'matrix') {
                    prepareMatrixArgument(
                        Module,
                        params[p],
                        parameters,
                        parameterTypes,
                    );
                }
                else if (paramTypes[p] == 'vector' || Array.isArray(params[p])) {
                    prepareVectorArgument(
                        Module,
                        params[p],
                        parameters,
                        parameterTypes,
                    );
                }
                else {
                    parameters.push(params[p])
                    parameterTypes.push(paramTypes[p] == undefined ? 'number' : paramTypes[p])
                }
            }
        }

        returnValue = Module.ccall(func, returnTypeParam, parameterTypes, parameters);
    } catch (e) {
        error = e;
    } finally {
        while (garbage.length) {
            Module._free(garbage.shift());
        }
    }

    if (error) throw error

    if (returnType == 'vector') {
        return prepareVectorReturnValue(
            Module,
            returnValue,
            returnShape,
        );
    }

    if (returnType == 'matrix') {
        return prepareMatrixReturnValue(
            Module,
            returnValue,
            returnShape,
        );
    }

    return returnValue;
}
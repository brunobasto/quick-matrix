import { Shape, Vector, Matrix } from './types'
import shape from './shape'

const garbage: any = [];

const heapMap: any = {}
heapMap.HEAP8 = Int8Array // int8_t
heapMap.HEAPU8 = Uint8Array // uint8_t
heapMap.HEAP16 = Int16Array // int16_t
heapMap.HEAPU16 = Uint16Array // uint16_t
heapMap.HEAP32 = Int32Array // int32_t
heapMap.HEAPU32 = Uint32Array // uint32_t
heapMap.HEAPF32 = Float32Array // float
heapMap.HEAPF64 = Float64Array // double

const allocateMatrix = (
    Module: EmscriptenModule,
    matrix: Matrix,
    heapIn: string,
) => {
    const [rows,] = shape(matrix);
    const pointers = new Uint32Array(rows);

    for (let i = 0; i < rows; i++) {
        pointers[i] = allocateVector(
            Module,
            matrix[i],
            heapIn
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
    heapIn: string,
) => {
    const buffer = new ArrayBuffer(vector.length * heapMap[heapIn].BYTES_PER_ELEMENT);
    const typedArray = new heapMap[heapIn](buffer);

    for (let i = 0; i < typedArray.length; i++) {
        typedArray[i] = vector[i];
    }

    const pointer = Module._malloc(typedArray.length * typedArray.BYTES_PER_ELEMENT);

    garbage.push(pointer);

    switch (heapIn) {
        case 'HEAP8': case 'HEAPU8':
            Module[heapIn].set(typedArray, pointer)
            break
        case 'HEAP16': case 'HEAPU16':
            Module[heapIn].set(typedArray, pointer >> 1)
            break
        case 'HEAP32': case 'HEAPU32': case 'HEAPF32':
            Module[heapIn].set(typedArray, pointer >> 2)
            break
        case 'HEAPF64':
            Module[heapIn].set(typedArray, pointer >> 3)
            break
    }

    return pointer;
}

const prepareVectorArgument = (
    Module: EmscriptenModule,
    vector: Vector,
    heapIn: string,
    parameters: any,
    parameterTypes: any,
) => {
    const pointer = allocateVector(Module, vector, heapIn);

    parameters.push(pointer);
    parameters.push(vector.length);
    parameterTypes.push('number');
    parameterTypes.push('number');
}

const prepareMatrixArgument = (
    Module: EmscriptenModule,
    matrix: Matrix,
    heapIn: string,
    parameters: any,
    parameterTypes: any,
) => {
    const [rows, columns] = shape(matrix);
    const pointer = allocateMatrix(Module, matrix, heapIn);

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
    heapOut: string
): Vector => {
    const [rows,] = returnShape;
    const heap = Module[heapOut];
    const offset = returnValue / heapMap[heapOut].BYTES_PER_ELEMENT;
    const r = Array(rows);

    for (let i = 0; i < rows; i++) {
        r[i] = heap[offset + i];
    }

    return r;
}

const prepareMatrixReturnValue = (
    Module: EmscriptenModule,
    returnValue: number,
    returnShape: Shape,
    heapOut: string
): Matrix => {
    const [rows, columns] = returnShape;
    const returnData: Matrix = []

    const heap = Module.HEAPU32
    const offset = returnValue / heap.BYTES_PER_ELEMENT;

    for (let i = 0; i < rows; i++) {
        const vectorPointer = heap[offset + i];

        returnData.push(prepareVectorReturnValue(Module, vectorPointer, [columns, 0], heapOut));
    }

    return returnData;
}

export const ccallArrays = (
    Module,
    func,
    returnType,
    paramTypes,
    params,
    {
        heapIn = 'HEAPF32',
        heapOut = 'HEAPF32',
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
                        heapIn,
                        parameters,
                        parameterTypes,
                    );
                }
                else if (paramTypes[p] == 'vector' || Array.isArray(params[p])) {
                    prepareVectorArgument(
                        Module,
                        params[p],
                        heapIn,
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
            Module._free(garbage.pop());
        }
    }

    if (error) throw error

    if (returnType == 'vector') {
        return prepareVectorReturnValue(
            Module,
            returnValue,
            returnShape,
            heapOut
        );
    }

    if (returnType == 'matrix') {
        return prepareMatrixReturnValue(
            Module,
            returnValue,
            returnShape,
            heapOut
        );
    }

    return returnValue;
}
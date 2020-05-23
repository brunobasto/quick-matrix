#include <emscripten.h>
#include <math.h>
#include <stdbool.h>
#include <stdlib.h>

extern "C" {

EMSCRIPTEN_KEEPALIVE
inline float operateUnaryScalar(
    float a,
    int operation)
{
    if (operation == 4) {
        return exp(a);
    }

    return a;
}

EMSCRIPTEN_KEEPALIVE
inline float* operateUnaryVector(
    float* a,
    int aSize,
    int operation)
{
    float result[aSize];

    for (int i = 0; i < aSize; i++) {
        if (operation == 4) {
            result[i] = operateUnaryScalar(a[i], operation);
        }
    }

    float* arrayPtr = &result[0];

    return arrayPtr;
}

EMSCRIPTEN_KEEPALIVE
inline float** operateUnaryMatrix(
    float** a,
    int rows,
    int columns,
    int operation)
{
    float** result = (float**)malloc(rows * sizeof(float*));

    for (int i = 0; i < rows; i++) {
        result[i] = (float*)malloc(columns * sizeof(float));

        for (int j = 0; j < columns; j++) {
            result[i][j] = operateUnaryScalar(a[i][j], operation);
        }
    }

    return result;
}

EMSCRIPTEN_KEEPALIVE
inline float operateBinaryScalars(
    float a,
    float b,
    int operation)
{
    if (operation == 0) {
        return a + b;
    } else if (operation == 1) {
        return a / b;
    } else if (operation == 2) {
        return a * b;
    }

    return a - b;
}

EMSCRIPTEN_KEEPALIVE
float* operateBinaryVectors(
    float* a,
    int aSize,
    float* b,
    int bSize,
    int operation)
{
    float result[aSize];

    for (int i = 0; i < aSize; i++) {
        result[i] = operateBinaryScalars(a[i], b[i], operation);
    }

    float* arrayPtr = &result[0];

    return arrayPtr;
}

EMSCRIPTEN_KEEPALIVE
float** operateBinaryMatrixAndScalar(
    float** matrix,
    int rows,
    int columns,
    float scalar,
    int operation,
    bool reverse)
{
    float** result = (float**)malloc(rows * sizeof(float*));

    if (reverse) {
        for (int i = 0; i < rows; i++) {
            result[i] = (float*)malloc(columns * sizeof(float));

            for (int j = 0; j < columns; j++) {
                result[i][j] = operateBinaryScalars(scalar, matrix[i][j], operation);
            }
        }
    } else {
        for (int i = 0; i < rows; i++) {
            result[i] = (float*)malloc(columns * sizeof(float));

            for (int j = 0; j < columns; j++) {
                result[i][j] = operateBinaryScalars(matrix[i][j], scalar, operation);
            }
        }
    }

    return result;
}

EMSCRIPTEN_KEEPALIVE
float** operateBinaryMatrices(
    float** matrixA,
    int rowsA,
    int columnsA,
    float** matrixB,
    int rowsB,
    int columnsB,
    int operation)
{
    float** result = (float**)malloc(rowsA * sizeof(float*));

    for (int i = 0; i < rowsA; i++) {
        result[i] = (float*)malloc(columnsA * sizeof(float));

        for (int j = 0; j < columnsA; j++) {
            result[i][j] = operateBinaryScalars(matrixA[i][j], matrixB[i][j], operation);
        }
    }

    return result;
}

EMSCRIPTEN_KEEPALIVE
float* operateBinaryVectorAndScalar(
    float* vector,
    int vectorSize,
    float scalar,
    int operation,
    bool reverse)
{
    float result[vectorSize];

    if (reverse) {
        for (int i = 0; i < vectorSize; i++) {
            result[i] = operateBinaryScalars(scalar, vector[i], operation);
        }
    } else {
        for (int i = 0; i < vectorSize; i++) {
            result[i] = operateBinaryScalars(vector[i], scalar, operation);
        }
    }

    float* arrayPtr = &result[0];

    return arrayPtr;
}
}

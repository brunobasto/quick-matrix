#include <emscripten.h>
#include <stdbool.h>
#include <stdlib.h>

EMSCRIPTEN_KEEPALIVE
float operateOnScalars(
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
float* operateOnVectors(
    float* a,
    int aSize,
    float* b,
    int bSize,
    int operation)
{
    float result[aSize];

    for (int i = 0; i < aSize; i++) {
        result[i] = operateOnScalars(a[i], b[i], operation);
    }

    float* arrayPtr = &result[0];

    return arrayPtr;
}

EMSCRIPTEN_KEEPALIVE
float** operateOnMatrixAndScalar(
    float** matrix,
    int rows,
    int columns,
    float scalar,
    int operation,
    bool reverse)
{
    float** result = malloc(rows * sizeof(float*));

    if (reverse) {
        for (int i = 0; i < rows; i++) {
            result[i] = malloc(columns * sizeof(float));

            for (int j = 0; j < columns; j++) {
                result[i][j] = operateOnScalars(scalar, matrix[i][j], operation);
            }
        }
    } else {
        for (int i = 0; i < rows; i++) {
            result[i] = malloc(columns * sizeof(float));

            for (int j = 0; j < columns; j++) {
                result[i][j] = operateOnScalars(matrix[i][j], scalar, operation);
            }
        }
    }

    return result;
}

EMSCRIPTEN_KEEPALIVE
float** operateOnMatrices(
    float** matrixA,
    int rowsA,
    int columnsA,
    float** matrixB,
    int rowsB,
    int columnsB,
    int operation)
{
    float** result = malloc(rowsA * sizeof(float*));

    for (int i = 0; i < rowsA; i++) {
        result[i] = malloc(columnsA * sizeof(float));

        for (int j = 0; j < columnsA; j++) {
            result[i][j] = operateOnScalars(matrixA[i][j], matrixB[i][j], operation);
        }
    }

    return result;
}

EMSCRIPTEN_KEEPALIVE
float* operateOnVectorAndScalar(
    float* vector,
    int vectorSize,
    float scalar,
    int operation,
    bool reverse)
{
    float result[vectorSize];

    if (reverse) {
        for (int i = 0; i < vectorSize; i++) {
            result[i] = operateOnScalars(scalar, vector[i], operation);
        }
    } else {
        for (int i = 0; i < vectorSize; i++) {
            result[i] = operateOnScalars(vector[i], scalar, operation);
        }
    }

    float* arrayPtr = &result[0];

    return arrayPtr;
}
#include <emscripten.h>
#include <stdlib.h>

EMSCRIPTEN_KEEPALIVE
float addScalars(
    float a,
    float b)
{
    return a + b;
}

EMSCRIPTEN_KEEPALIVE
float multiplyScalars(
    float a,
    float b)
{
    return a * b;
}

EMSCRIPTEN_KEEPALIVE
float* addVectors(
    float* a,
    int aSize,
    float* b,
    int bSize)
{
    float result[aSize];

    for (int i = 0; i < aSize; i++) {
        result[i] = a[i] + b[i];
    }

    float* arrayPtr = &result[0];

    return arrayPtr;
}

EMSCRIPTEN_KEEPALIVE
float* multiplyVectors(
    float* a,
    int aSize,
    float* b,
    int bSize)
{
    float result[aSize];

    for (int i = 0; i < aSize; i++) {
        result[i] = a[i] * b[i];
    }

    float* arrayPtr = &result[0];

    return arrayPtr;
}

EMSCRIPTEN_KEEPALIVE
float** addMatrixByScalar(
    float** matrix,
    int rows,
    int columns,
    float scalar)
{
    float* values = calloc(rows * columns, sizeof(float));
    float** result = malloc(rows * sizeof(float*));

    for (int i = 0; i < rows; i++) {
        result[i] = values + i * columns;

        for (int j = 0; j < columns; j++) {
            result[i][j] = scalar + matrix[i][j];
        }
    }

    return result;
}

EMSCRIPTEN_KEEPALIVE
float** multiplyMatrixByScalar(
    float** matrix,
    int rows,
    int columns,
    float scalar)
{
    float* values = calloc(rows * columns, sizeof(float));
    float** result = malloc(rows * sizeof(float*));

    for (int i = 0; i < rows; i++) {
        result[i] = values + i * columns;

        for (int j = 0; j < columns; j++) {
            result[i][j] = scalar * matrix[i][j];
        }
    }

    return result;
}

EMSCRIPTEN_KEEPALIVE
float** multiplyMatrices(
    float** matrixA,
    int rowsA,
    int columnsA,
    float** matrixB,
    int rowsB,
    int columnsB)
{
    float* values = calloc(rowsA * columnsA, sizeof(float));
    float** result = malloc(rowsA * sizeof(float*));

    for (int i = 0; i < rowsA; i++) {
        result[i] = values + i * columnsA;

        for (int j = 0; j < columnsA; j++) {
            result[i][j] = matrixA[i][j] * matrixB[i][j];
        }
    }

    return result;
}

EMSCRIPTEN_KEEPALIVE
float** addMatrices(
    float** matrixA,
    int rowsA,
    int columnsA,
    float** matrixB,
    int rowsB,
    int columnsB)
{
    float* values = calloc(rowsA * columnsA, sizeof(float));
    float** result = malloc(rowsA * sizeof(float*));

    for (int i = 0; i < rowsA; i++) {
        result[i] = values + i * columnsA;

        for (int j = 0; j < columnsA; j++) {
            result[i][j] = matrixA[i][j] + matrixB[i][j];
        }
    }

    return result;
}

EMSCRIPTEN_KEEPALIVE
float* addVectorByScalar(
    float* vector,
    int vectorSize,
    float scalar)
{
    float result[vectorSize];

    for (int i = 0; i < vectorSize; i++) {
        result[i] = scalar + vector[i];
    }

    float* arrayPtr = &result[0];

    return arrayPtr;
}

EMSCRIPTEN_KEEPALIVE
float* multiplyVectorByScalar(
    float* vector,
    int vectorSize,
    float scalar)
{
    float result[vectorSize];

    for (int i = 0; i < vectorSize; i++) {
        result[i] = scalar * vector[i];
    }

    float* arrayPtr = &result[0];

    return arrayPtr;
}
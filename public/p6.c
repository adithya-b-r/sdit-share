#include <stdio.h>

void swap(int *x, int *y) {
  int temp = *x;
  *x = *y;
  *y = temp;
}

void bubbleSort(int *arr, int n) {
  int i, j;
  for (i = 0; i < n - 1; i++) {
    for (j = 0; j < (n - 1) - i; j++) {
      if (arr[j + 1] < arr[j]) {
        swap(&arr[j], &arr[j + 1]);
      }
    }
  }
  printf("END bubble Sort");
}

void selectionSort(int *arr, int n) {
  int i, j, min;
  for (i = 0; i < n - 1; i++) {
    min = i;
    for (j = i + 1; j < n; j++) {
      if (arr[j] > arr[min]) {
        min = j;
      }
    }
    swap(&arr[i], &arr[min]);
  }
}

void main() {
  int choice, arr[10], n, index, i;

  printf("Enter the size of the array : \n");
  scanf("%d", &n);

  printf("Enter array Elements : \n");
  for (i = 0; i < n; i++) {
    scanf("%d", &arr[i]);
  }

  printf("Select from Menu : \n 1. Bubble Sort. \n 2. Selection Sort. \n");
  printf("Enter Your Choice : ");
  scanf("%d", &choice);

  switch (choice) {
    case 1:
      bubbleSort(arr, n);
      break;
    case 2:
      selectionSort(arr, n);
      break;
    default:
      printf("***** Wrong Key Entered ******: \n");
  }

  printf("\nArray Elements after Sorting: \n");
  for (i = 0; i < n; i++) {
    printf("%d ", arr[i]);
  }
}
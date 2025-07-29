#include <stdio.h>

int linearSearch(int *a, int n, int key) {
  int i = 0;
  while (i < n) {
    if (a[i] == key) {
      return i + 1;
    }
    i++;
  }
  return -1;
}

int binarySearch(int a[], int left, int right, int key) {
  if (left > right) {
    return -1;
  }
  int mid = (left + right) / 2;
  if (a[mid] == key) {
    return mid + 1;
  } else if (a[mid] > key) {
    return binarySearch(a, left, mid - 1, key);
  } else {
    return binarySearch(a, mid + 1, right, key);
  }
}

void main() {
  int choice, arr[10], n, key, index;

  printf(" Enter the size of the array : ");
  scanf("%d", &n);

  printf(" Select from Menu : \n 1. Linear Search. \n 2. Binary Search. ");
  printf("\n Enter Your Choice : ");
  scanf("%d", &choice);

  if (choice == 1) {
    printf("\n Enter the array Elements: \n");
  } else {
    printf("\n Enter sorted elements for Binary Search : ");
  }

  for (int i = 0; i < n; i++) {
    scanf("%d", &arr[i]);
  }

  printf("\n Enter the Key Element: ");
  scanf("%d", &key);

  switch (choice) {
    case 1:
      index = linearSearch(arr, n, key);
      break;
    case 2:
      index = binarySearch(arr, 0, n - 1, key);
      break;
    default:
      printf(" ***** Wrong Choice Entered ******: \n");
      break;
  }

  if (index == -1) {
    printf("\n Element Not found. ");
  } else {
    printf("\n Element found at location %d \n", index);
  }
}
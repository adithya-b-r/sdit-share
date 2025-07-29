#include <stdio.h>

#define INF 999

void dijkstra(int c[10][10], int n, int s, int d[10]) {
  int v[10], min, u, i, j;

  for (i = 1; i <= n; i++) {
    d[i] = c[s][i];
    v[i] = 0;
  }
  v[s] = 1;

  for (i = 1; i < n; i++) {
    min = INF;
    u = -1;
    for (j = 1; j <= n; j++) {
      if (v[j] == 0 && d[j] < min) {
        min = d[j];
        u = j;
      }
    }

    if (u == -1) {
      break;
    }

    v[u] = 1;

    for (j = 1; j <= n; j++) {
      if (v[j] == 0 && (d[u] + c[u][j]) < d[j]) {
        d[j] = d[u] + c[u][j];
      }
    }
  }
}

int main() {
  int c[10][10], d[10], i, j, s, n;

  printf("Enter number of vertices: ");
  scanf("%d", &n);

  printf("Enter the cost matrix (0 if no edge):\n");
  for (i = 1; i <= n; i++) {
    for (j = 1; j <= n; j++) {
      scanf("%d", &c[i][j]);
      if (i != j && c[i][j] == 0) {
        c[i][j] = INF;
      }
    }
  }

  printf("Enter the source node (1 to %d): ", n);
  scanf("%d", &s);

  dijkstra(c, n, s, d);

  printf("\nShortest distances from node %d:\n", s);
  for (i = 1; i <= n; i++) {
    if (d[i] == INF) {
      printf("Node %d is unreachable\n", i);
    } else {
      printf("To node %d: %d\n", i, d[i]);
    }
  }

  return 0;
}
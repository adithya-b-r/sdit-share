#include <stdio.h>

#define INF 999

int main() {
  int n, i, j, u, v, a, b;
  int ne = 1, min_cost = 0;
  int cost[20][20], parent[20] = {0};

  printf("Enter the number of vertices: ");
  scanf("%d", &n);

  printf("Enter the cost matrix:\n");
  for (i = 1; i <= n; i++) {
    for (j = 1; j <= n; j++) {
      scanf("%d", &cost[i][j]);
    }
  }

  for (i = 1; i <= n; i++) {
    parent[i] = 0;
  }

  printf("\nThe edges of the Minimum Spanning Tree are:\n");
  while (ne < n) {
    int min = INF;
    for (i = 1; i <= n; i++) {
      for (j = 1; j <= n; j++) {
        if (cost[i][j] < min) {
          min = cost[i][j];
          a = u = i;
          b = v = j;
        }
      }
    }

    while (parent[u]) {
      u = parent[u];
    }
    while (parent[v]) {
      v = parent[v];
    }

    if (u != v) {
      printf("Edge %d:\t(%d -> %d) = %d\n", ne++, a, b, min);
      min_cost += min;
      parent[v] = u;
    }

    cost[a][b] = cost[b][a] = INF;

    if (min == INF) {
      printf("Graph is disconnected. Spanning tree not possible.\n");
      return 1;
    }
  }

  printf("\nMinimum cost = %d\n", min_cost);

  return 0;
}
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans

data = pd.read_csv("dataset.csv")

X = data.values

k = int(input("Enter the number of Clusters (k): "))
kmeans = KMeans(n_clusters=k, random_state=0)
kmeans.fit(X)

labels = kmeans.labels_
print("\nCluster Labels:", labels)

data['Cluster'] = labels
print("\nClustered Data:\n", data)

plt.scatter(X[:, 0], X[:, 1], c=labels, cmap='viridis', marker='o')
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1], 
            s=200, c='red', label='Centroids', marker='X')
plt.title('K-Means Clustering')
plt.xlabel('Height')
plt.ylabel('Weight')
plt.legend()
plt.grid(True)
plt.show()

Feature1,Feature2
1.0,2.0
1.5,1.8
5.0,8.0
8.0,8.0
1.0,0.6
9.0,11.0
8.0,2.0
10.0,2.0
9.0,3.0
4.0,8.0
2.0,5.0
2.5,5.5
3.5,6.0
3.0,4.5
6.0,9.0
7.0,10.0
6.5,8.5
3.0,3.0
2.0,2.0
1.0,1.0
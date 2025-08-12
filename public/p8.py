import statistics
from collections import Counter

def summary_statistics(data):
    print("Data:", data)
    print("---------------------")

    try:
        mean = statistics.mean(data)
        median = statistics.median(data)
        mode = statistics.mode(data)
        std_dev = statistics.stdev(data)
        variance = statistics.variance(data)

        print("Type: Numerical Data")
        print("Mean:", mean)
        print("Median:", median)
        print("Mode:", mode)
        print("Standard Deviation:", std_dev)
        print("Variance:", variance)

    except (TypeError, statistics.StatisticsError):
        print("Type: Categorical Data")
        frequency = Counter(data)
        print("frequency", frequency)
        most_common = frequency.most_common(1)[0][0]
        print("Mode (most frequent value):", most_common)
        print("Frequency count of each category:")
        for item, count in frequency.items():
            print(f"{item}: {count}")

print("Numerical Data Example:")
summary_statistics([10.2, 20, 30, 40, 50, 50, 60])
print("\n")

print("Categorical Data Example:")
summary_statistics(['Red', 'Blue', 'Green', 'Red', 'Blue', 'Red'])
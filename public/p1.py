import csv

def read_data(filename):
    with open(filename, 'r') as file:       
        csv_reader = csv.reader(file)       
        data = [row for row in csv_reader]
    return data

def find_s_algorithm(data):
    for row in data:
        if row[-1].lower() == 'yes':
            hypothesis = row[:-1]
            break
    else:
        return None  

    for row in data:
        if row[-1].lower() == 'yes':
            for i in range(len(hypothesis)):
                if hypothesis[i] != row[i]:
                    hypothesis[i] = '?' 

    return hypothesis

def main():
    filename = 'dataset.csv'
    data = read_data(filename)
    final_hypothesis = find_s_algorithm(data)

    if final_hypothesis:
        print("Most specific hypothesis found by FIND-S:")
        print(final_hypothesis)
    else:
        print("No positive examples found in the dataset.")

if __name__ == "__main__":
    main()
    
# Sky,AirTemp,Humidity,Wind,Water,Forecast,EnjoySport
# Sunny,Warm,Normal,Strong,Warm,Same,Yes
# Sunny,Warm,High,Strong,Warm,Same,Yes
# Rainy,Cold,High,Strong,Warm,Change,No
# Sunny,Warm,High,Strong,Cool,Change,Yes
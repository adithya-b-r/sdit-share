import pandas as pd                                         
from sklearn.model_selection import train_test_split        
from sklearn.naive_bayes import CategoricalNB               
from sklearn.preprocessing import LabelEncoder              
from sklearn.metrics import accuracy_score                 

data = pd.read_csv("weather.csv")

encoders = {}
for column in data.columns:
    le = LabelEncoder()
    data[column] = le.fit_transform(data[column])
    encoders[column] = le

X = data.drop("Play", axis=1)               
y = data["Play"] 

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)

model = CategoricalNB()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

predicted_labels = encoders["Play"].inverse_transform(y_pred)
actual_labels = encoders["Play"].inverse_transform(y_test)

print("\nPredicted vs Actual:")
for pred, actual in zip(predicted_labels, actual_labels):
    print(f"Predicted: {pred}   Actual: {actual}")

accuracy = accuracy_score(y_test, y_pred)
print(f"\nAccuracy of Naive Bayes classifier: {accuracy * 100:.2f}%")

# Outlook,Temperature,Humidity,Wind,Play
# Sunny,Hot,High,Weak,No
# Sunny,Hot,High,Strong,No
# Overcast,Hot,High,Weak,Yes
# Rain,Mild,High,Weak,Yes
# Rain,Cool,Normal,Weak,Yes
# Rain,Cool,Normal,Strong,No
# Overcast,Cool,Normal,Strong,Yes
# Sunny,Mild,High,Weak,No
# Sunny,Cool,Normal,Weak,Yes
# Rain,Mild,Normal,Weak,Yes
# Sunny,Mild,Normal,Strong,Yes
# Overcast,Mild,High,Strong,Yes
# Overcast,Hot,Normal,Weak,Yes
# Rain,Mild,High,Strong,No
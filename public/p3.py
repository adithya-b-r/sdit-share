import pandas as pd
from sklearn.tree import DecisionTreeClassifier, plot_tree
import matplotlib.pyplot as plt                           
from sklearn.preprocessing import LabelEncoder            

data = pd.read_csv('play_tennis.csv')

label_encoders = {}
for column in data.columns:
    le = LabelEncoder()
    data[column] = le.fit_transform(data[column])
    label_encoders[column] = le

print(data)

X = data.drop('Play', axis=1)       
y = data['Play']                    

print(X)
print(y)

model = DecisionTreeClassifier(criterion='entropy')           
model.fit(X, y)                                               

plt.figure(figsize=(10, 6))              
plot_tree(model, feature_names=X.columns, class_names=['No', 'Yes'], filled=True) 
plt.title("Decision Tree (ID3) - Play Tennis")
plt.show()

sample_dict = {
    "Outlook": "Sunny",
    "Temperature": "Cool",
    "Humidity": "High",
    "Wind": "Strong"
}

sample_encoded = [[
    label_encoders["Outlook"].transform([sample_dict["Outlook"]])[0],
    label_encoders["Temperature"].transform([sample_dict["Temperature"]])[0],
    label_encoders["Humidity"].transform([sample_dict["Humidity"]])[0],
    label_encoders["Wind"].transform([sample_dict["Wind"]])[0],
]]

prediction = model.predict(sample_encoded)

result = label_encoders["Play"].inverse_transform(prediction)

print(f"\nPrediction for the sample {sample_dict}: {result[0]}")

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
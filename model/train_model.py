import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.impute import SimpleImputer
import joblib

# Load the dataset
data = pd.read_csv('sustainable_india_packaging_data_cleaned.csv')

# Automatically handle missing values (impute) for both numeric and categorical features
numeric_columns = data.select_dtypes(include=['float64', 'int64']).columns
categorical_columns = data.select_dtypes(include=['object']).columns

# Numeric columns imputation (using median or mean strategy)
numeric_imputer = SimpleImputer(strategy='median')  # Or 'mean'
data[numeric_columns] = numeric_imputer.fit_transform(data[numeric_columns])

# Categorical columns imputation (using most frequent value strategy)
categorical_imputer = SimpleImputer(strategy='most_frequent')
data[categorical_columns] = categorical_imputer.fit_transform(data[categorical_columns])

# Step 1: Group by 'Location' and 'Product_Type'
# For each group, pick the row with the minimum 'Carbon_Footprint (kg CO₂)'
filtered_data = data.loc[
    data.groupby(['Location', 'Product_Type'])['Carbon_Footprint (kg CO₂)'].idxmin()
]

# Debugging: Ensure correct filtering
print("Filtered Data after grouping and picking the minimum 'Carbon_Footprint':")
print(filtered_data)

# Step 2: Encode the target column (Packaging_Material) with LabelEncoder
label_encoder = LabelEncoder()
filtered_data['Packaging_Material'] = label_encoder.fit_transform(filtered_data['Packaging_Material'])

# Save the label encoder for later use
joblib.dump(label_encoder, 'label_encoder.pkl')

# Step 3: Separate Features and Target
features = filtered_data[['Carbon_Footprint (kg CO₂)', 'Biodegradability_Score', 
                          'Recyclability_Score', 'Cost_Efficiency', 'Location', 'Product_Type']]
target = filtered_data['Packaging_Material']

# Apply OneHotEncoder to categorical features and scale numeric features
categorical_features = ['Location', 'Product_Type']
column_transformer = ColumnTransformer(
    transformers=[
        ('onehot', OneHotEncoder(drop='first'), categorical_features),
        ('scaler', StandardScaler(), ['Carbon_Footprint (kg CO₂)','Biodegradability_Score','Recyclability_Score','Cost_Efficiency'])  # Scaling numeric features
    ],
    remainder='passthrough'
)

# Transform the features
X = column_transformer.fit_transform(features)

# Save the ColumnTransformer for later use
joblib.dump(column_transformer, 'column_transformer.pkl')

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, target, test_size=0.2, random_state=42)

# Train the Random Forest model
model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# Save the trained model
joblib.dump(model, 'packaging_model.pkl')
print("Model, column transformer, and label encoder saved!")
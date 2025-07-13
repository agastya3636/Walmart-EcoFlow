from flask import Flask, request, jsonify, render_template
import pandas as pd
import joblib
from geopy.distance import geodesic

app = Flask(__name__)

# Load the trained model, column transformer, and label encoder
model = joblib.load('packaging_model.pkl')
column_transformer = joblib.load('column_transformer.pkl')
label_encoder = joblib.load('label_encoder.pkl')
data = pd.read_csv('sustainable_india_packaging_data_cleaned.csv')

# Load city coordinates
city_coordinates = {
    "Delhi": (28.6139, 77.2090),
    "Gurgaon": (28.4595, 77.0266),
    "Noida": (28.5355, 77.3910),
    "Ghaziabad": (28.6692, 77.4538),
    "Mumbai": (19.0760, 72.8777),
    "Thane": (19.2183, 72.9781),
    "Navi mumbai": (19.0330, 73.0297),
    "Pune": (18.5204, 73.8567),
    "Bangalore": (12.9716, 77.5946),
    "Mysore": (12.2958, 76.6394),
    "Hosur": (12.7406, 77.8253),
    "Chennai": (13.0827, 80.2707),
    "Puducherry": (11.9416, 79.8083),
    "Vellore": (12.9165, 79.1325),
    "Kolkata": (22.5726, 88.3639),
    "Howrah": (22.5958, 88.2636),
    "Durgapur": (23.5204, 87.3119),
    "Hyderabad": (17.3850, 78.4867),
    "Secunderabad": (17.4399, 78.4983),
    "Warangal": (17.9784, 79.5919),
    "Ahmedabad": (23.0225, 72.5714),
    "Vadodara": (22.3072, 73.1812),
    "Rajkot": (22.3039, 70.8022),
    "Surat": (21.1702, 72.8311),
    "Nashik": (19.9975, 73.7898),
    "Jaipur": (26.9124, 75.7873),
    "Ajmer": (26.4499, 74.6399),
    "Kota": (25.2138, 75.8648),
    # Add more cities as required
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    user_data = request.json
    location = user_data['location'].strip()
    product_type = user_data['product_type'].strip()

    print(f"Received request: Location = {location}, Product Type = {product_type}")

    # Step 1: Normalize data for consistent matching
    data['Location'] = data['Location']
    data['Product_Type'] = data['Product_Type']

    # Step 2: Filter the dataset for exact matches
    matched_data = data[(data['Location'] == location) & (data['Product_Type'] == product_type)]

    if matched_data.empty:
        # No exact matches; perform nearby location search
        if location not in city_coordinates:
            return jsonify({"error": f"Coordinates for '{location}' are not available."}), 404

        user_coord = city_coordinates[location]
        filtered_data = data[data['Product_Type'] == product_type].copy()

        if filtered_data.empty:
            return jsonify({"error": f"No data found for Product Type: {product_type} in any location."}), 404

        # Compute distances to nearby locations
        filtered_data['Distance_km'] = filtered_data['Location'].apply(
            lambda loc: geodesic(user_coord, city_coordinates.get(loc, (None, None))).km
            if loc in city_coordinates else float('inf')
        )

        # Filter out locations without valid distances and sort by proximity
        filtered_data = filtered_data[filtered_data['Distance_km'] < float('inf')]
        if filtered_data.empty:
            return jsonify({"error": "No suitable locations found nearby."}), 404

        filtered_data = filtered_data.sort_values(by='Distance_km')
        print("Nearby location data sorted by proximity:")
        print(filtered_data.head())

        # Use the closest location's rows for further processing
        nearest_location = filtered_data.iloc[0]['Location']
        matched_data = filtered_data[filtered_data['Location'] == nearest_location]

    # Debugging: Show matched data
    print("Matched data after fallback or exact matching:")
    print(matched_data)

    # Step 3: Transform features for prediction
    try:
        transformed_features = column_transformer.transform(matched_data[['Carbon_Footprint (kg CO₂)','Biodegradability_Score','Recyclability_Score','Cost_Efficiency','Location','Product_Type']])
    except Exception as e:
        return jsonify({"error": f"Error transforming features: {str(e)}"}), 400

    # Step 4: Predict the packaging material
    try:
        predictions = model.predict(transformed_features)
        predicted_materials = label_encoder.inverse_transform(predictions)

        # Add predictions to the matched data
        matched_data['Predicted_Material'] = predicted_materials

        # Select the most optimal packaging material based on the lowest 'Carbon_Footprint (kg CO₂)'
        optimal_row = matched_data.loc[matched_data['Carbon_Footprint (kg CO₂)'].idxmin()]
        response = {
            "Location": str(optimal_row['Location']),
            "Product_Type": str(optimal_row['Product_Type']),
            "Optimal_Packaging_Material": str(optimal_row['Predicted_Material']),
            "Carbon_Footprint (kg CO₂)": float(optimal_row['Carbon_Footprint (kg CO₂)']),
            "Biodegradability_Score": float(optimal_row['Biodegradability_Score']),
            "Recyclability_Score": float(optimal_row['Recyclability_Score']),
            "Cost_Efficiency": float(optimal_row['Cost_Efficiency']),
            "Availability": int(optimal_row['Availability'])
        }

    except Exception as e:
        return jsonify({"error": f"Error during prediction: {str(e)}"}), 500

    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
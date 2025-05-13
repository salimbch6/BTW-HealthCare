from flask import Blueprint, request, jsonify
import joblib
import numpy as np
import os

breast_bp = Blueprint('breast_bp', __name__)

# ✅ Chargement des modèles
model = joblib.load(os.path.join('models', 'breast_model', 'breast_model.pkl'))
scaler = joblib.load(os.path.join('models', 'breast_model', 'scaler.pkl'))

@breast_bp.route('/breast/predict', methods=['POST'])
def predict_breast():
    try:
        data = request.get_json()
        print("📥 Données reçues pour le cancer du sein:", data)

        # ✅ Validation des champs obligatoires
        required_fields = ['mean_radius', 'mean_texture', 'mean_perimeter', 'mean_area', 'mean_smoothness']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400

        # ✅ Conversion et transformation
        inputs = [
            float(data['mean_radius']),
            float(data['mean_texture']),
            float(data['mean_perimeter']),
            float(data['mean_area']),
            float(data['mean_smoothness'])
        ]

        features = scaler.transform([inputs])
        prediction = model.predict(features)[0]

        result = "Benign" if prediction == 1 else "Malignant"
        print("✅ Prédiction envoyée:", result)

        return jsonify({'prediction': result})

    except Exception as e:
        print("❌ Erreur backend breast:", str(e))
        return jsonify({'error': str(e)}), 500

from flask import Blueprint, request, jsonify
import joblib
import os
import numpy as np

prostate_bp = Blueprint('prostate_bp', __name__)

# 🔁 Charger le modèle depuis le dossier structuré
model = joblib.load(os.path.join('models', 'prostate_model', 'prostate_model.pkl'))

# 🔧 Fonctions d'encodage
def encode_alcohol(value):
    return 1 if value == 'Moderate' else 0

def encode_yes_no(value):
    return 1 if value == 'Yes' else 0

def encode_cholesterol(value):
    return 1 if value == 'High' else 0

# 📍 Route d’API pour prédire le cancer de la prostate
@prostate_bp.route('/prostate/predict', methods=['POST'])
def predict_prostate():
    try:
        data = request.get_json()
        print("📥 Reçu depuis frontend:", data)

        # Extraction et encodage
        psa_level = float(data['psa_level'])
        prostate_volume = float(data['prostate_volume'])
        alcohol_consumption = encode_alcohol(data['alcohol_consumption'])
        smoking_history = encode_yes_no(data['smoking_history'])
        cholesterol_level = encode_cholesterol(data['cholesterol_level'])
        diabetes = encode_yes_no(data['diabetes'])
        hypertension = encode_yes_no(data['hypertension'])

        input_data = np.array([
            psa_level,
            prostate_volume,
            alcohol_consumption,
            smoking_history,
            cholesterol_level,
            diabetes,
            hypertension
        ]).reshape(1, -1)

        prediction = model.predict(input_data)[0]
        print("✅ Prédiction envoyée:", prediction)

        message = (
            "⚠️ Prostate cancer likely"
            if prediction == 1 else
            "✅ No prostate cancer detected"
        )

        return jsonify({'prediction': message})

    except Exception as e:
        print("❌ Erreur côté serveur:", str(e))
        return jsonify({'error': str(e)}), 500

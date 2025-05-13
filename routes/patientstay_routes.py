from flask import Blueprint, request, jsonify
import joblib
import os
import numpy as np

patientstay_bp = Blueprint('patientstay_bp', __name__)

# Charger les modèles
model = joblib.load(os.path.join('models', 'patientstay_model', 'model.pkl'))
scaler = joblib.load(os.path.join('models', 'patientstay_model', 'scaler.pkl'))
label_encoders = joblib.load(os.path.join('models', 'patientstay_model', 'label_encoders.pkl'))

@patientstay_bp.route('/patientstay/predict', methods=['POST'])
def predict_stay():
    try:
        data = request.get_json()
        print("📥 Reçu depuis frontend:", data)

        # Encodage des colonnes catégorielles
        for col in ['AgeGroup', 'Gender', 'AdmissionType', 'CareUnit']:
            if data[col] not in label_encoders[col].classes_:
                return jsonify({'error': f'Invalid value for {col}: {data[col]}'}), 400
            data[col] = label_encoders[col].transform([data[col]])[0]

        input_data = np.array([
            data['AgeGroup'], data['Gender'], data['AdmissionType'], data['CareUnit'],
            int(data['HadDiabetes']), int(data['HadStroke']),
            int(data['DifficultyWalking']), int(data['CovidPos']),
            float(data['procedure_cost']), float(data['medication_cost']), float(data['lab_test_cost'])
        ]).reshape(1, -1)

        input_scaled = scaler.transform(input_data)
        prediction = model.predict(input_scaled)[0]

        print("✅ Prédiction envoyée:", prediction)
        return jsonify({'prediction': round(float(prediction), 2)})

    except Exception as e:
        print("❌ Erreur côté serveur:", str(e))
        return jsonify({'error': str(e)}), 500

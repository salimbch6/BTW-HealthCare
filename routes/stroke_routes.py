from flask import Blueprint, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64
import os

# ✅ Corrigé : ajouter url_prefix pour bien mapper /stroke/predict
stroke_bp = Blueprint('stroke_bp', __name__, url_prefix='/stroke')

# Charger le modèle une seule fois au démarrage
model = tf.keras.models.load_model(os.path.join('models', 'stroke_model', 'cnn_stroke_mri_classifier.h5'))
target_size = (224, 224)

@stroke_bp.route('/predict', methods=['POST'])
def predict_stroke():
    try:
        data = request.get_json()
        image_data = data.get('image')

        if not image_data:
            return jsonify({'error': 'No image provided'}), 400

        # Convertir l'image base64 en tableau numpy
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image = image.resize(target_size)
        image_array = np.array(image) / 255.0
        image_array = np.expand_dims(image_array, axis=0)

        # Prédiction
        prediction = model.predict(image_array)[0][0]
        result = "Stroke detected" if prediction >= 0.5 else "No stroke detected"

        return jsonify({'prediction': result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

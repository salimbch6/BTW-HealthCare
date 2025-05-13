from flask import Blueprint, request, jsonify
import pandas as pd
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import joblib
import pyodbc
import os

sentiment_bp = Blueprint('sentiment_bp', __name__, url_prefix='/sentiment')

# Connexion SQL Server
conn_str = (
    "DRIVER={SQL Server};"
    "SERVER=SALIM;"
    "DATABASE=HealthCareDW;"
    "Trusted_Connection=yes;"
)
conn = pyodbc.connect(conn_str)

# Lire les réclamations
def get_reclamations():
    query = "SELECT code_reclamation, Complaint_Description FROM dbo.Dim_Reclamations"
    df = pd.read_sql(query, conn)
    df["code_reclamation"] = df["code_reclamation"].astype(str)
    return df

# Charger modèle
model = AutoModelForSequenceClassification.from_pretrained(os.path.join("models", "sentiment_model"))
tokenizer = AutoTokenizer.from_pretrained(os.path.join("models", "sentiment_model"))
label_encoder = joblib.load(os.path.join("models", "sentiment_model", "label_encoder.pkl"))

# ✅ Route API pour récupérer les réclamations
@sentiment_bp.route('/reclamations', methods=['GET'])
def reclamations():
    df_reclamations = get_reclamations()
    return jsonify(df_reclamations.to_dict(orient="records"))

# ✅ Route API pour prédire le sentiment
@sentiment_bp.route('/predict', methods=['POST'])
def predict_sentiment():
    data = request.get_json()
    text = data.get('text', '')

    if not text or "No specific complaint" in text:
        return jsonify({"prediction": "No valid comment"})

    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)
        predicted_label = torch.argmax(probs, dim=1).item()
        raw_sentiment = label_encoder.inverse_transform([predicted_label])[0]
        sentiment = "Satisfied" if raw_sentiment == "positive" else "Unsatisfied"

    return jsonify({"prediction": sentiment})

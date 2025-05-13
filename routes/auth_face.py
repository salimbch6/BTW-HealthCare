from flask import Blueprint, request, jsonify, session
from deepface import DeepFace
from scipy.spatial.distance import cosine
import base64
import numpy as np
import cv2

auth_face_bp = Blueprint('auth_face_bp', __name__)

print("🧠 Encodage des visages connus...")

known_faces = {
    "salim": {
        "embedding": DeepFace.represent(img_path="static/faces/salim.jpg", model_name="Facenet", enforce_detection=False)[0]["embedding"],
        "role": "head"
    },
    "chedly": {
        "embedding": DeepFace.represent(img_path="static/faces/chedly.jpg", model_name="Facenet", enforce_detection=False)[0]["embedding"],
        "role": "admin"
    }
}

threshold = 0.50  # 🔽 Seuil plus strict

@auth_face_bp.route('/auth/face-login', methods=['POST'])
def face_login():
    print("✅ /auth/face-login route hit!")
    data = request.get_json()

    if not data or 'image' not in data:
        print("❌ Aucune image reçue.")
        return jsonify({'message': 'No image received'}), 400

    try:
        image_data = data['image'].split(',')[1]
        image_bytes = base64.b64decode(image_data)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        faces = DeepFace.extract_faces(img_path=frame, detector_backend='opencv', enforce_detection=False)
        print(f"📸 {len(faces)} visage(s) détecté(s).")

        for face in faces:
            area = face['facial_area']
            x, y, w, h = area['x'], area['y'], area['w'], area['h']
            face_crop = frame[y:y+h, x:x+w]

            embedding = DeepFace.represent(img_path=face_crop, model_name="Facenet", enforce_detection=False)[0]["embedding"]

            best_match = None
            best_dist = 1.0
            second_best_dist = 1.0

            for name, ref in known_faces.items():
                dist = cosine(ref["embedding"], embedding)
                print(f"🔍 Distance avec {name} = {dist:.4f}")

                if dist < best_dist:
                    second_best_dist = best_dist
                    best_dist = dist
                    best_match = name
                elif dist < second_best_dist:
                    second_best_dist = dist

            if best_dist < threshold and (second_best_dist - best_dist) > 0.15:
                print(f"✅ Visage reconnu : {best_match}")
                
                # ✅ Création de la session côté Flask
                session['user'] = best_match
                session['role'] = known_faces[best_match]['role']

                return jsonify({
                    "message": "Face login successful",
                    "username": best_match,
                    "role": known_faces[best_match]["role"]
                }), 200
            else:
                print("⚠️ Ambiguïté ou faible confiance")
                return jsonify({'message': 'Face not recognized'}), 401

        print("❌ Aucun visage détecté.")
        return jsonify({'message': 'No face detected'}), 401

    except Exception as e:
        print(f"❌ Erreur DeepFace : {e}")
        return jsonify({'message': 'Erreur traitement image', 'error': str(e)}), 500

print("✅ Module auth_face.py bien chargé")

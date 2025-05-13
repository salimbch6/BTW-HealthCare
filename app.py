from flask import Flask, request, session
from flask_cors import CORS
import threading

# ✅ Initialiser Flask AVANT d’enregistrer les blueprints
app = Flask(__name__)
app.secret_key = 'supersecretkey123'

# ✅ CORS activé pour Angular avec session
CORS(app, origins=["http://localhost:4200"], supports_credentials=True)

# ✅ Logger toutes les requêtes
@app.before_request
def log_all_requests():
    print(f"📥 {request.method} {request.path}")
    print(f"🔎 Headers: {dict(request.headers)}")
    try:
        print(f"📩 Body (JSON): {request.get_json()}")
    except Exception as e:
        print(f"❌ Erreur JSON: {e}")

# ✅ Déco sécurité par rôle
def require_role(role):
    def decorator(f):
        from functools import wraps
        @wraps(f)
        def wrapped(*args, **kwargs):
            if session.get("role") != role:
                return {"message": "Access denied – insufficient privileges"}, 403
            return f(*args, **kwargs)
        return wrapped
    return decorator

# ✅ Import des blueprints
from routes.patientstay_routes import patientstay_bp
from routes.sentiment_routes import sentiment_bp
from routes.stroke_routes import stroke_bp
from routes.auth import auth_bp
from routes.prostate import prostate_bp
from routes.tracking import tracking_bp, background_folder_watcher
from routes.breast_routes import breast_bp
from routes.auth_face import auth_face_bp

# ✅ Enregistrement
app.register_blueprint(patientstay_bp)
app.register_blueprint(sentiment_bp)
app.register_blueprint(stroke_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(prostate_bp)
app.register_blueprint(tracking_bp)
app.register_blueprint(breast_bp)
app.register_blueprint(auth_face_bp)
print("✅ Blueprint `auth_face_bp` bien enregistré")

# ✅ Lancement du watcher
threading.Thread(target=background_folder_watcher, daemon=True).start()

if __name__ == '__main__':
    print("🚀 Lancement de Flask sur http://localhost:5000")
    app.run(debug=True, use_reloader=False)

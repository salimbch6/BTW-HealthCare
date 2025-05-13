from flask import Blueprint, request, session, jsonify

auth_bp = Blueprint('auth_bp', __name__)  # Blueprint pour les routes d'authentification

# ✅ Base d'utilisateurs avec rôles (en mémoire)
USERS = {
    "chedly": {"password": "admin123", "role": "admin"},
    "salim":  {"password": "head123", "role": "head"}  
   }

# ✅ Endpoint de login
@auth_bp.route('/auth/login', methods=['POST'])
def login():
    print("✅ Requête reçue sur /auth/login")

    data = request.get_json()
    print("📩 Données reçues :", data)

    if not data:
        return jsonify({'message': 'Aucune donnée reçue'}), 400

    username = data.get('username')
    password = data.get('password')

    user = USERS.get(username)

    if user and user["password"] == password:
        session['user'] = username
        session['role'] = user["role"]

        return jsonify({
            'message': 'Login successful',
            'username': username,
            'role': user["role"]
        })
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# ✅ Endpoint de logout
@auth_bp.route('/auth/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    session.pop('role', None)
    return jsonify({'message': 'Logged out'})

# ✅ Endpoint d'enregistrement d'un nouvel utilisateur (non persistant)
@auth_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    print("🆕 Demande d'enregistrement :", data)

    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if not username or not password or not role:
        return jsonify({'message': 'Champs requis manquants'}), 400

    if username in USERS:
        return jsonify({'message': f"Utilisateur '{username}' existe déjà."}), 409

    USERS[username] = {"password": password, "role": role}
    print(f"✅ Utilisateur ajouté : {username} ({role})")
    return jsonify({'message': f"Utilisateur '{username}' enregistré avec succès", 'role': role})

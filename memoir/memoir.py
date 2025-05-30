from flask import Flask, request, jsonify
import psycopg2
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'database': 'biskra_health',
    'user': 'postgres',  # <-- your real username
    'password': '123'  # <-- your real password
}

def get_db_connection():
    conn = psycopg2.connect(**DB_CONFIG)
    return conn

@app.route('/api/auth', methods=['POST'])
def auth():
    data = request.get_json()
    action = data.get('action')
    
    if action == 'register':
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        if not all([name, email, password]):
            return jsonify({'success': False, 'message': 'All fields are required'}), 400
            
        hashed_password = generate_password_hash(password)
        
        try:
            conn = get_db_connection()
            cur = conn.cursor()
            
            cur.execute('SELECT id FROM users WHERE email = %s', (email,))
            if cur.fetchone():
                return jsonify({'success': False, 'message': 'Email already registered'}), 400
                
            cur.execute(
                'INSERT INTO users (name, email, password) VALUES (%s, %s, %s) RETURNING id',
                (name, email, hashed_password)
            )
            user_id = cur.fetchone()[0]
            conn.commit()
            
            return jsonify({'success': True, 'user_id': user_id}), 201
            
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500
        finally:
            cur.close()
            conn.close()
            
    elif action == 'login':
        email = data.get('email')
        password = data.get('password')
        
        try:
            conn = get_db_connection()
            cur = conn.cursor()
            
            cur.execute('SELECT id, password FROM users WHERE email = %s', (email,))
            user = cur.fetchone()
            
            if not user or not check_password_hash(user[1], password):
                return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
                
            return jsonify({'success': True, 'user_id': user[0]}), 200
            
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500
        finally:
            cur.close()
            conn.close()
    else:
        return jsonify({'success': False, 'message': 'Invalid action'}), 400

if __name__ == '__main__':
    app.run(debug=True)

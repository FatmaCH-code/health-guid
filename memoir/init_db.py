import psycopg2

DB_PARAMS = {
    "host": "localhost",
    "database": "postgres",  # Connect first to default db
    "user": "postgres",
    "password": "123"
}

# Create database
conn = psycopg2.connect(**DB_PARAMS)
conn.autocommit = True
cursor = conn.cursor()

try:
    cursor.execute("CREATE DATABASE biskra_health")
    print("Database created successfully")
except psycopg2.Error as e:
    print(f"Error creating database: {e}")
finally:
    cursor.close()
    conn.close()

# Now connect to the new database
DB_PARAMS["database"] = "biskra_health"

try:
    conn = psycopg2.connect(**DB_PARAMS)
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute("""
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE doctors (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            specialty VARCHAR(50) NOT NULL,
            city VARCHAR(50) NOT NULL,
            image_url TEXT,
            latitude DECIMAL(10, 6),
            longitude DECIMAL(10, 6),
            phone VARCHAR(20),
            address TEXT,
            cv_url TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE appointments (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            doctor_id INTEGER REFERENCES doctors(id),
            appointment_date DATE NOT NULL,
            appointment_time TIME NOT NULL,
            consultation_type VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    
    conn.commit()
    print("Tables created successfully")
    
except psycopg2.Error as e:
    print(f"Error creating tables: {e}")
finally:
    cursor.close()
    conn.close()


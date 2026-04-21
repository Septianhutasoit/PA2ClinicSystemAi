import sqlite3
import os

db_path = os.path.join('backend', 'clinic.db')
if not os.path.exists(db_path):
    print(f"Database tidak ditemukan di {db_path}")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT email, role FROM users")
        users = cursor.fetchall()
        print("Daftar Akun terdaftar:")
        for email, role in users:
            print(f"- {email} ({role})")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

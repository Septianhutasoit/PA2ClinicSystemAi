import sqlite3

def run_migration():
    try:
        conn = sqlite3.connect('backend/clinic.db')
        conn.execute('ALTER TABLE appointments ADD COLUMN user_id INTEGER REFERENCES users(id)')
        conn.commit()
        print("Migration successful")
    except sqlite3.OperationalError as e:
        print(f"Migration error (might be already done): {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    run_migration()

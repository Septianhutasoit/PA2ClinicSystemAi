import sqlite3

conn = sqlite3.connect('clinic.db')
cur = conn.cursor()

# Cek kolom yang ada
cols = [row[1] for row in cur.execute('PRAGMA table_info(users)')]
print('Kolom sebelum migrasi:', cols)

# Tambah kolom yang kurang (jika belum ada)
new_cols = {
    'phone': 'TEXT',
    'address': 'TEXT',
    'birth_date': 'TEXT',
    'gender': 'TEXT',
    'photo_url': 'TEXT',
}
for col, dtype in new_cols.items():
    if col not in cols:
        cur.execute(f'ALTER TABLE users ADD COLUMN {col} {dtype}')
        print(f'  + Kolom ditambahkan: {col}')
    else:
        print(f'  = Kolom sudah ada: {col}')

conn.commit()
cols_after = [row[1] for row in cur.execute('PRAGMA table_info(users)')]
print('Kolom setelah migrasi:', cols_after)
conn.close()
print('Migration selesai!')

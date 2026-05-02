import sys
with open(sys.argv[1], 'r') as f: lines = f.readlines()
new_lines = []
for line in lines:
    if line.startswith('pick'):
        parts = line.split(' ', 2)
        if len(parts) == 3:
            msg = parts[2].lower()
            bad = ['meluncur', 'mhm', 'skaada', 'oalah', 'gibrun', 'solo', 'asd', 'joko', 'prabo', 'run', 'yntkts', 'nofix', 'fixdata', 'addroledokter', 'addsttings', 'fixgool', 'sawitdb', 'q', 'sd', '.', 'hey an take', 'gibb run']
            if any(b in msg for b in bad) or msg.strip() == 'push' or msg.strip() == '-':
                new_lines.append(f'reword {parts[1]} {parts[2]}')
                continue
    new_lines.append(line)
with open(sys.argv[1], 'w') as f: f.writelines(new_lines)
